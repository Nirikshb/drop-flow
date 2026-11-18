/** H-08: login attempts are rate limited per client. */
const BASE = process.env['API_URL'] ?? 'http://127.0.0.1:3001';
let failures = 0;

function check(name, condition, detail = '') {
  if (condition) console.log(`  PASS  ${name}`);
  else { failures++; console.error(`  FAIL  ${name} ${detail}`); }
}

const email = `rate-limit-${Date.now()}@dropflow.test`;
const statuses = [];
for (let attempt = 0; attempt < 11; attempt += 1) {
  const response = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'definitely-wrong' }),
  });
  statuses.push(response.status);
  await response.text();
}

check(
  'the eleventh rapid login is rate limited',
  statuses.slice(0, 10).every((status) => status === 401) && statuses[10] === 429,
  JSON.stringify(statuses),
);

console.log(`\n${failures === 0 ? 'ALL RATE LIMIT CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exitCode = failures === 0 ? 0 : 1;
