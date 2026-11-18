/**
 * Regression checks for the confirmed critical/high findings.
 *
 * These are exploits, not happy paths: each block reproduces the original
 * attack and asserts that the API now refuses it. Run against a live API:
 *   node test/security-regressions.mjs
 */
import { existsSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env['API_URL'] ?? 'http://127.0.0.1:3001';
let failures = 0;

function check(name, condition, detail = '') {
  if (condition) console.log(`  PASS  ${name}`);
  else { failures++; console.error(`  FAIL  ${name} ${detail}`); }
}

function client() {
  let cookie = '';
  return async function call(pathname, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
    if (cookie) headers.Cookie = cookie;
    const response = await fetch(`${BASE}${pathname}`, { ...options, headers, redirect: 'manual' });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    const body = await response.json().catch(() => ({}));
    return { status: response.status, body };
  };
}

/** Session-less client: a public key must stand on its own. */
async function keyedApi(pathname, key, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(options.headers ?? {}),
    },
    redirect: 'manual',
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

const api = client();
const suffix = Date.now();
const useLocalStorage = !process.env['R2_BUCKET_NAME'];

const registration = await api('/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    email: `security-${suffix}@dropflow.test`,
    password: 'password123',
    name: 'Security Tester',
    organizationName: `Security Org ${suffix}`,
  }),
});
check('setup: account created', registration.status === 201, JSON.stringify(registration.body));
const organizationId = (await api('/organizations')).body[0].id;

async function createProject(name) {
  const response = await api('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, organizationId }),
  });
  return response.body;
}

const project = await createProject(`Security ${suffix}`);
const keyResponse = await api(`/projects/${project.id}/keys`, {
  method: 'POST',
  body: JSON.stringify({ name: 'security' }),
});
const secretKey = keyResponse.body.secret;

function uploadInit(projectId, key, { filename = 'file.txt', size = 5, mimeType = 'text/plain' } = {}) {
  return api('/v1/uploads', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: JSON.stringify({ originalFilename: filename, size, mimeType }),
  });
}

async function putBytes(url, bytes, contentType) {
  return fetch(url, { method: 'PUT', headers: { 'Content-Type': contentType }, body: Buffer.from(bytes) });
}

async function createAsset(projectId, key, options = {}) {
  const size = options.size ?? 5;
  const mimeType = options.mimeType ?? 'text/plain';
  const init = await uploadInit(projectId, key, { ...options, size, mimeType });
  if (init.status !== 201) return { init };
  const put = await putBytes(init.body.uploadUrl, Buffer.alloc(size, 0x61), mimeType);
  const complete = await api(`/v1/uploads/${init.body.id}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: '{}',
  });
  return { init, put, complete };
}

console.log('\nC-01 — public key is an identifier, not an authorizer');
{
  const asset = await createAsset(project.id, secretKey, { filename: 'owned.txt' });
  const assetId = asset.complete.body.id;

  const list = await keyedApi(`/v1/assets?projectId=${project.id}`, project.publicKey);
  check('public key cannot list assets', list.status === 403, `${list.status}`);
  const get = await keyedApi(`/v1/assets/${assetId}?projectId=${project.id}`, project.publicKey);
  check('public key cannot read an asset', get.status === 403, `${get.status}`);
  const del = await keyedApi(`/v1/assets/${assetId}?projectId=${project.id}`, project.publicKey, {
    method: 'DELETE',
  });
  check('public key cannot delete an asset', del.status === 403, `${del.status}`);

  const viaSecret = await keyedApi(`/v1/assets/${assetId}?projectId=${project.id}`, secretKey);
  check('secret key can still read the asset', viaSecret.status === 200, `${viaSecret.status}`);

  const stillThere = await api(`/v1/assets/${assetId}?projectId=${project.id}`);
  check('asset survived the public-key delete attempt', stillThere.status === 200, `${stillThere.status}`);
}

console.log('\nH-01 — declared size is enforced before bytes are stored');
{
  const init = await uploadInit(project.id, secretKey, { filename: 'oversize.bin', size: 5 });
  const oversize = Buffer.alloc(2 * 1024 * 1024, 0x62);
  const put = await putBytes(init.body.uploadUrl, oversize, 'text/plain');
  check('oversized PUT is rejected by storage', put.status === 400 || put.status === 413, `${put.status}`);

  const complete = await api(`/v1/uploads/${init.body.id}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}` },
    body: '{}',
  });
  check('completion cannot finalise a rejected upload', complete.status === 400, `${complete.status}`);

  if (useLocalStorage) {
    const target = path.join(process.cwd(), '.local-storage', ...init.body.objectKey.split('/'));
    check('no object was written for the rejected upload', !existsSync(target), target);
  }
}

console.log('\nH-01/H-02 — failed uploads do not leak objects');
{
  const init = await uploadInit(project.id, secretKey, { filename: 'abandoned.txt', size: 5 });
  const put = await putBytes(init.body.uploadUrl, 'hello', 'text/plain');
  check('setup: valid bytes stored', put.status === 200, `${put.status}`);

  const failed = await api(`/v1/uploads/${init.body.id}/fail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}` },
    body: '{}',
  });
  check('fail endpoint accepted', failed.status === 201 || failed.status === 200, `${failed.status}`);

  if (useLocalStorage) {
    const target = path.join(process.cwd(), '.local-storage', ...init.body.objectKey.split('/'));
    check('object removed when the upload is abandoned', !existsSync(target), target);
  }

  const complete = await api(`/v1/uploads/${init.body.id}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}` },
    body: '{}',
  });
  check('failed session cannot be completed later', complete.status === 400, `${complete.status}`);
}

console.log('\nH-04 — MIME declarations and active content');
{
  const wildcard = await uploadInit(project.id, secretKey, { mimeType: '*/*' });
  check('wildcard MIME declaration rejected', wildcard.status === 400, `${wildcard.status}`);

  const majorWildcard = await uploadInit(project.id, secretKey, { mimeType: 'image/*' });
  check('major wildcard declaration rejected', majorWildcard.status === 400, `${majorWildcard.status}`);

  const html = await uploadInit(project.id, secretKey, { mimeType: 'text/html' });
  check('HTML upload denied by default', html.status === 400, `${html.status}`);

  const svg = await uploadInit(project.id, secretKey, { mimeType: 'image/svg+xml' });
  check('SVG upload denied by default', svg.status === 400, `${svg.status}`);

  const wildcardPolicy = await api(`/projects/${project.id}`, {
    method: 'PATCH', body: JSON.stringify({ allowedMimeTypes: ['*/*'] }),
  });
  check('project cannot be configured with a wildcard allowlist', wildcardPolicy.status === 400, `${wildcardPolicy.status}`);

  const explicitSvg = await api(`/projects/${project.id}`, {
    method: 'PATCH', body: JSON.stringify({ allowedMimeTypes: ['image/*'] }),
  });
  check('concrete major wildcard is accepted as policy', explicitSvg.status === 200, `${explicitSvg.status}`);
  const allowedSvg = await uploadInit(project.id, secretKey, { mimeType: 'image/svg+xml' });
  check('explicitly allowed SVG is still denied (exact type required)', allowedSvg.status === 400, `${allowedSvg.status}`);

  const restored = await api(`/projects/${project.id}`, {
    method: 'PATCH', body: JSON.stringify({ allowedMimeTypes: [] }),
  });
  check('policy reset', restored.status === 200, `${restored.status}`);
}

console.log('\nH-03/H-10 — signed downloads only');
{
  const asset = await createAsset(project.id, secretKey, { filename: 'download.txt' });
  const assetId = asset.complete.body.id;
  const detail = await api(`/v1/assets/${assetId}?projectId=${project.id}`);
  check('asset detail returns a signed URL', detail.body.url?.includes('token='), detail.body.url);

  const signed = await fetch(detail.body.url);
  check('signed URL serves the bytes', signed.ok && (await signed.text()) === 'aaaaa', `${signed.status}`);

  const unsigned = await fetch(`${BASE}/v1/local-storage?key=${encodeURIComponent(detail.body.objectKey)}`);
  check('unauthenticated storage read is rejected', unsigned.status === 401, `${unsigned.status}`);

  const forged = await fetch(`${BASE}/v1/local-storage?key=${encodeURIComponent(detail.body.objectKey)}&expires=${Date.now() + 60_000}&token=forged`);
  check('forged storage token is rejected', forged.status === 401, `${forged.status}`);
}

console.log('\nH-06 — project deletion after soft-deleting assets');
{
  const doomed = await createProject(`Doomed ${suffix}`);
  const doomedKey = (await api(`/projects/${doomed.id}/keys`, {
    method: 'POST',
    body: JSON.stringify({ name: 'doomed' }),
  })).body.secret;
  const asset = await createAsset(doomed.id, doomedKey, { filename: 'soft-deleted.txt' });
  check('setup: asset created in doomed project', asset.complete.status === 201, `${asset.complete.status}`);

  const softDelete = await api(`/v1/assets/${asset.complete.body.id}?projectId=${doomed.id}`, {
    method: 'DELETE',
  });
  check('setup: asset soft-deleted', softDelete.status === 200, `${softDelete.status} ${JSON.stringify(softDelete.body)}`);

  const removal = await api(`/projects/${doomed.id}`, { method: 'DELETE' });
  check('project deletion succeeds after soft-deleting its assets', removal.status === 200, `${removal.status} ${JSON.stringify(removal.body)}`);

  const gone = await api(`/projects/${doomed.id}`);
  check('deleted project is gone', gone.status === 404, `${gone.status}`);
}

console.log('\nH-09 — origin policy is explicit');
{
  const badOrigin = await api(`/projects/${project.id}`, {
    method: 'PATCH', body: JSON.stringify({ allowedOrigins: ['*'] }),
  });
  check('wildcard origin rejected', badOrigin.status === 400, `${badOrigin.status}`);

  const origin = await api(`/projects/${project.id}`, {
    method: 'PATCH', body: JSON.stringify({ allowedOrigins: ['https://customer.example'] }),
  });
  check('concrete origin accepted', origin.status === 200 && origin.body.allowedOrigins?.includes('https://customer.example'),
    JSON.stringify(origin.body));
}

console.log(`\n${failures === 0 ? 'ALL SECURITY REGRESSIONS PASSED' : `${failures} SECURITY REGRESSION(S) FAILED`}`);
process.exitCode = failures === 0 ? 0 : 1;
