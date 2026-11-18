/** Verifies organization/project isolation and invalid-key handling. */
const BASE = process.env['API_URL'] ?? 'http://127.0.0.1:3001';
let failures = 0;
function check(name, condition, detail = '') {
  if (condition) console.log(`  PASS  ${name}`);
  else { failures++; console.error(`  FAIL  ${name} ${detail}`); }
}
function client() {
  let cookie = '';
  return async function call(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(`${BASE}${path}`, { ...options, headers });
    const setCookie = r.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    const body = await r.json().catch(() => ({}));
    return { status: r.status, body };
  };
}

/** Session-less call: proves the key itself carries no session authority. */
async function keyed(path, key, options = {}) {
  const r = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(options.headers ?? {}),
    },
  });
  const body = await r.json().catch(() => ({}));
  return { status: r.status, body };
}

const a = client();
const b = client();
const suffix = Date.now();

const regA = await a('/auth/register', { method: 'POST', body: JSON.stringify({
  email: `authz-a-${suffix}@dropflow.test`, password: 'password123',
  name: 'User A', organizationName: `Org A ${suffix}`,
}) });
const orgA = (await a('/organizations')).body[0].id;
const projectA = (await a('/projects', { method: 'POST', body: JSON.stringify({
  name: 'Project A', organizationId: orgA,
}) })).body;

const regB = await b('/auth/register', { method: 'POST', body: JSON.stringify({
  email: `authz-b-${suffix}@dropflow.test`, password: 'password123',
  name: 'User B', organizationName: `Org B ${suffix}`,
}) });

check('two independent users registered', regA.status === 201 && regB.status === 201);

const crossProject = await b(`/projects/${projectA.id}`);
check('user B cannot read user A project', crossProject.status === 403, JSON.stringify(crossProject.body));

const crossKeys = await b(`/projects/${projectA.id}/keys`);
check('user B cannot list user A keys', crossKeys.status === 403, JSON.stringify(crossKeys.body));

const crossAssets = await b(`/v1/assets?projectId=${projectA.id}`);
check('user B cannot list user A assets', crossAssets.status === 403, JSON.stringify(crossAssets.body));

const publicAssets = await keyed(`/v1/assets?projectId=${projectA.id}`, projectA.publicKey);
check('public key cannot list assets', publicAssets.status === 403, JSON.stringify(publicAssets.body));

const badKey = await a('/v1/uploads', {
  method: 'POST',
  headers: { Authorization: 'Bearer df_public_nonexistent' },
  body: JSON.stringify({ originalFilename: 'x.txt', size: 1, mimeType: 'text/plain' }),
});
check('unknown public key is rejected', badKey.status === 401, JSON.stringify(badKey.body));

const disabled = await a(`/projects/${projectA.id}`, {
  method: 'PATCH', body: JSON.stringify({ status: 'disabled' }),
});
check('project can be disabled', disabled.status === 200, JSON.stringify(disabled.body));

const disabledUpload = await a('/v1/uploads', {
  method: 'POST',
  headers: { Authorization: `Bearer ${projectA.publicKey}` },
  body: JSON.stringify({ originalFilename: 'x.txt', size: 1, mimeType: 'text/plain' }),
});
check('disabled project cannot accept uploads', disabledUpload.status === 403, JSON.stringify(disabledUpload.body));

console.log(`\n${failures === 0 ? 'ALL AUTHORIZATION CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exitCode = failures === 0 ? 0 : 1;
