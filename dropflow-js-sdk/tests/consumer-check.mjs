/**
 * Consumer check for the BUILT package (not the source).
 * Run after `pnpm build` with the API + object storage available.
 *
 * Key contract (see `project-docs/API_CONTRACT.md` and C-01 in the audit):
 * a public key is upload-only. Asset reads, listing and deletion require a
 * secret key. This script provisions a disposable account so it can exercise
 * both keys against the real API instead of relying on a hardcoded key.
 */
import { Dropflow, NotFoundError, UploadCancelledError } from '../dist/index.js';

const baseUrl = process.env['DROPFLOW_API_URL']
  ?? process.env['API_URL']
  ?? 'http://127.0.0.1:3001';

let cookie = '';
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers, redirect: 'manual' });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`API ${options.method ?? 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  }
  return body;
}

const suffix = Date.now();
await api('/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    email: `sdk-consumer-${suffix}@dropflow.test`,
    password: 'password123',
    name: 'SDK Consumer',
    organizationName: `SDK Consumer Org ${suffix}`,
  }),
});

const [organization] = await api('/organizations');
const project = await api('/projects', {
  method: 'POST',
  body: JSON.stringify({ name: `SDK Consumer ${suffix}`, organizationId: organization.id }),
});
const { secret } = await api(`/projects/${project.id}/keys`, {
  method: 'POST',
  body: JSON.stringify({ name: 'consumer-check' }),
});

if (!secret?.startsWith('df_secret_')) throw new Error('secret key was not returned');
if (!project.publicKey?.startsWith('df_public_')) throw new Error('public key was not returned');

console.log('Base URL:', baseUrl);

// --- secret key: the full management flow -----------------------------------
const client = new Dropflow({ publicKey: secret, baseUrl });
const progress = [];
const file = new Blob(['sdk consumer check ' + suffix], { type: 'text/plain' });

const asset = await client.upload(file, {
  retries: 1,
  onProgress: (event) => progress.push(Math.round(event.percentage)),
});
console.log('Uploaded asset:', asset.id, asset.url);
if (!progress.length) throw new Error('upload reported no progress');

const fetched = await client.getAsset(asset.id);
if (fetched.id !== asset.id) throw new Error('getAsset returned a different asset');

const listed = await client.listAssets({ limit: 5 });
if (!listed.data.some((entry) => entry.id === asset.id)) {
  throw new Error('listAssets did not include the uploaded asset');
}

await client.deleteAsset(asset.id);
let notFound = false;
try {
  await client.getAsset(asset.id);
} catch (error) {
  notFound = error instanceof NotFoundError;
}
if (!notFound) throw new Error('Deleted asset was still retrievable');

// --- public key: upload yes, manage no --------------------------------------
const publicClient = new Dropflow({ publicKey: project.publicKey, baseUrl });
const publicUpload = await publicClient.upload(
  new Blob(['public key upload ' + suffix], { type: 'text/plain' }),
  { retries: 1 },
);
console.log('Public-key upload succeeded:', publicUpload.id);

let publicListRejected = false;
try {
  await publicClient.listAssets({ limit: 1 });
} catch (error) {
  publicListRejected = error instanceof Error && !(error instanceof UploadCancelledError);
}
if (!publicListRejected) throw new Error('public key was allowed to list assets');

await client.deleteAsset(publicUpload.id);

console.log('Progress samples:', progress.join(', '));
console.log('ALL SDK CONSUMER CHECKS PASSED');
