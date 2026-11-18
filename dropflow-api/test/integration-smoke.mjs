/**
 * End-to-end smoke test against a running API. Exercises the real database,
 * real session cookies, real API keys, real signed URLs and real object
 * verification. Run: node test/integration-smoke.mjs
 */
const BASE = process.env['API_URL'] ?? 'http://127.0.0.1:3001';
const email = `smoke+${Date.now()}@dropflow.test`;
let cookie = '';
let failures = 0;

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`  PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name} ${detail}`);
  }
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
  if (cookie) headers['Cookie'] = cookie;
  const response = await fetch(`${BASE}${path}`, { ...options, headers, redirect: 'manual' });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

/** Session-less client: used to prove a public key alone is insufficient. */
async function keyedApi(path, key, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(options.headers ?? {}),
    },
    redirect: 'manual',
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

console.log('Dropflow API integration smoke test');
console.log(`Target: ${BASE}\n`);

const health = await api('/health');
check('health reports database up', health.body?.info?.database?.status === 'up', JSON.stringify(health.body));

const register = await api('/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    email, password: 'correct-horse-battery', name: 'Smoke Tester',
    organizationName: `Smoke Org ${Date.now()}`,
  }),
});
check('register returns 201 and user', register.response.status === 201 && register.body.user?.email === email,
  `${register.response.status} ${JSON.stringify(register.body)}`);
check('register sets session cookie', cookie.startsWith('df_session='), cookie);

const me = await api('/auth/me');
check('GET /auth/me returns user', me.response.status === 200 && me.body.email === email, JSON.stringify(me.body));

const orgs = await api('/organizations');
check('organization created on register', Array.isArray(orgs.body) && orgs.body.length === 1, JSON.stringify(orgs.body));
const organizationId = orgs.body[0]?.id;

const project = await api('/projects', {
  method: 'POST',
  body: JSON.stringify({ name: 'Smoke Project', organizationId }),
});
check('project created', project.response.status === 201 && project.body.publicKey?.startsWith('df_public_'),
  JSON.stringify(project.body));
const projectId = project.body.id;
const publicKey = project.body.publicKey;

const key = await api(`/projects/${projectId}/keys`, {
  method: 'POST',
  body: JSON.stringify({ name: 'Smoke key' }),
});
check('secret key returned once', key.body.secret?.startsWith('df_secret_'), JSON.stringify(key.body));
const secretKey = key.body.secret;

const keyList = await api(`/projects/${projectId}/keys`);
check('key list hides secret', Array.isArray(keyList.body) && !JSON.stringify(keyList.body).includes(key.body.secret),
  JSON.stringify(keyList.body));

const init = await api('/v1/uploads', {
  method: 'POST',
  headers: { Authorization: `Bearer ${secretKey}` },
  body: JSON.stringify({
    originalFilename: 'smoke-file.txt', size: 15, mimeType: 'text/plain',
  }),
});
check('upload session initialised', init.response.status === 201 && init.body.uploadUrl?.startsWith('http'),
  `${init.response.status} ${JSON.stringify(init.body)}`);
const uploadId = init.body.id;

const bytes = Buffer.from('hello dropflow!');
const put = await fetch(init.body.uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'text/plain' },
  body: bytes,
});
check('direct PUT to storage succeeded', put.ok, `${put.status} ${await put.text()}`);

const start = await api(`/v1/uploads/${uploadId}/start`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${secretKey}` },
  body: '{}',
});
check('upload marked as uploading', start.response.status === 201 || start.response.status === 200, JSON.stringify(start.body));

const completeBody = { checksum: 'sha256:smoke' };
const complete = await api(`/v1/uploads/${uploadId}/complete`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${secretKey}` },
  body: JSON.stringify(completeBody),
});
check('completion verified object and created asset', complete.response.status === 201 && complete.body.status === 'completed',
  `${complete.response.status} ${JSON.stringify(complete.body)}`);
const assetId = complete.body.id;

const duplicate = await api(`/v1/uploads/${uploadId}/complete`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${secretKey}` },
  body: JSON.stringify(completeBody),
});
check('duplicate completion is idempotent', duplicate.body.id === assetId, JSON.stringify(duplicate.body));

const list = await api(`/v1/assets?projectId=${projectId}`);
check('asset visible through API', list.body.data?.some((asset) => asset.id === assetId), JSON.stringify(list.body));

const getAsset = await api(`/v1/assets/${assetId}?projectId=${projectId}`);
check('asset retrievable by id', getAsset.response.status === 200 && getAsset.body.id === assetId, JSON.stringify(getAsset.body));

const publicList = await keyedApi(`/v1/assets?projectId=${projectId}`, publicKey);
check('public key cannot list assets', publicList.response.status === 403, `${publicList.response.status}`);

const publicGet = await keyedApi(`/v1/assets/${assetId}?projectId=${projectId}`, publicKey);
check('public key cannot read an asset', publicGet.response.status === 403, `${publicGet.response.status}`);

const publicDelete = await keyedApi(`/v1/assets/${assetId}?projectId=${projectId}`, publicKey, {
  method: 'DELETE',
});
check('public key cannot delete an asset', publicDelete.response.status === 403, `${publicDelete.response.status}`);

check('asset URL is a signed URL', typeof getAsset.body.url === 'string' && getAsset.body.url.includes('token='), getAsset.body.url);
const unsigned = await fetch(getAsset.body.url.replace(/[?&]token=[^&]+/, ''));
check('storage URL without a signature is rejected', unsigned.status === 401, `${unsigned.status}`);

const publicInit = await api('/v1/uploads', {
  method: 'POST',
  headers: { Authorization: `Bearer ${publicKey}` },
  body: JSON.stringify({ originalFilename: 'public.txt', size: 2, mimeType: 'text/plain' }),
});
check('public key can still start an upload', publicInit.response.status === 201, `${publicInit.response.status} ${JSON.stringify(publicInit.body)}`);
await api(`/v1/uploads/${publicInit.body.id}/fail`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${publicKey}` },
  body: '{}',
});

const usage = await api(`/projects/${projectId}/usage`);
check('usage reflects persisted asset', usage.body.assetCount === 1 && usage.body.uploadCount === 1, JSON.stringify(usage.body));

const download = await fetch(getAsset.body.url);
check('asset URL serves real bytes', download.ok && (await download.text()) === 'hello dropflow!', `${download.status}`);

const del = await api(`/v1/assets/${assetId}?projectId=${projectId}`, { method: 'DELETE' });
check('asset deleted', del.response.status === 200, JSON.stringify(del.body));

const usageAfter = await api(`/projects/${projectId}/usage`);
check('storage accounting updated after delete', usageAfter.body.assetCount === 0 && usageAfter.body.storageBytes === 0,
  JSON.stringify(usageAfter.body));

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exitCode = failures === 0 ? 0 : 1;
