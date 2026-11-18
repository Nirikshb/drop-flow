/**
 * Development seed data for the dashboard. Uses the REAL API end-to-end:
 * register → projects → keys → signed uploads → assets → usage.
 * Run: node test/seed-dev.mjs
 */
const BASE = process.env['API_URL'] ?? 'http://127.0.0.1:3001';
const EMAIL = 'demo@dropflow.dev';
const PASSWORD = 'demo12345';
let cookie = '';

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(`${BASE}${path}`, { ...options, headers });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function upload(projectId, publicKey, name, content, mimeType) {
  const bytes = Buffer.from(content);
  const init = await api('/v1/uploads', {
    method: 'POST',
    headers: { Authorization: `Bearer ${publicKey}` },
    body: JSON.stringify({ originalFilename: name, size: bytes.length, mimeType }),
  });
  if (!init.response.ok) throw new Error(`init ${name}: ${JSON.stringify(init.body)}`);
  await fetch(init.body.uploadUrl, { method: 'PUT', headers: { 'Content-Type': mimeType }, body: bytes });
  await api(`/v1/uploads/${init.body.id}/start`, {
    method: 'POST', headers: { Authorization: `Bearer ${publicKey}` }, body: '{}',
  });
  await api(`/v1/uploads/${init.body.id}/complete`, {
    method: 'POST', headers: { Authorization: `Bearer ${publicKey}` }, body: '{}',
  });
}

async function main() {
  let register = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: EMAIL, password: PASSWORD, name: 'Demo Developer', organizationName: 'Acme Labs',
    }),
  });
  if (register.response.status === 409) {
    register = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    console.log('Demo account already exists — logged in.');
  } else {
    console.log('Created demo account.');
  }
  if (!register.response.ok) throw new Error(`auth failed: ${JSON.stringify(register.body)}`);

  const organizations = await api('/organizations');
  const organizationId = organizations.body[0]?.id;
  let projects = (await api('/projects')).body;

  if (projects.length === 0) {
    await api('/projects', {
      method: 'POST', body: JSON.stringify({ name: 'Production', organizationId }),
    });
    await api('/projects', {
      method: 'POST', body: JSON.stringify({ name: 'Staging', organizationId }),
    });
    projects = (await api('/projects')).body;
  }

  const production = projects.find((project) => project.name === 'Production') ?? projects[0];

  for (const project of projects) {
    const keys = (await api(`/projects/${project.id}/keys`)).body;
    if (keys.length === 0) {
      await api(`/projects/${project.id}/keys`, {
        method: 'POST', body: JSON.stringify({ name: 'Server — demo app' }),
      });
    }
  }

  const samples = [
    ['hero-banner.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#4f46e5"/></svg>', 'image/svg+xml'],
    ['release-notes.txt', 'Dropflow v0.1 — initial release notes.', 'text/plain'],
    ['brand-colors.json', '{"primary":"#4f46e5","accent":"#06b6d4"}', 'application/json'],
    ['welcome.md', '# Welcome to Dropflow\n\nUploads, sorted.', 'text/markdown'],
    ['config.yaml', 'storage:\n  driver: r2\n  private: true\n', 'text/yaml'],
  ];
  for (const project of projects) {
    const assets = (await api(`/v1/assets?projectId=${project.id}`)).body.data ?? [];
    if (assets.length === 0) {
      for (const [name, content, mime] of samples) {
        await upload(project.id, project.publicKey, name, content, mime);
      }
      console.log(`Seeded ${samples.length} assets into ${project.name}.`);
    } else {
      console.log(`${project.name}: ${assets.length} assets already present.`);
    }
  }

  console.log('\nDemo credentials for the dashboard:');
  console.log(`  email:    ${EMAIL}`);
  console.log(`  password: ${PASSWORD}`);
  console.log(`  public key: ${production.publicKey}`);
  console.log(`  open http://127.0.0.1:3000/login`);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
