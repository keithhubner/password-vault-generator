/**
 * API endpoint integration tests for Password Vault Generator.
 * Runs against a live server (default: http://localhost:3000).
 *
 * Usage:
 *   node scripts/test-api.mjs              # uses localhost:3000
 *   BASE_URL=http://host:port node scripts/test-api.mjs
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const DELAY_BETWEEN_POSTS_MS = 7000; // 7s between POST requests to respect rate limit

const failures = [];
let passed = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTest(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failures.push({ name, error: err.message });
    console.error(`  FAIL  ${name}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// GET endpoint tests
// ---------------------------------------------------------------------------

async function testGetConfig() {
  await runTest('GET /api/config — returns hostedOn field', async () => {
    const res = await fetch(`${BASE_URL}/api/config`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert('hostedOn' in json, 'Response missing "hostedOn" field');
  });
}

async function testGetFormats() {
  await runTest('GET /api/vault/formats — returns all 7 formats', async () => {
    const res = await fetch(`${BASE_URL}/api/vault/formats`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.formats, 'Response missing "formats" object');
    const expected = ['bitwarden', 'lastpass', 'keeper', 'edge', 'keepassx', 'keepass2', 'password-depot'];
    for (const fmt of expected) {
      assert(json.formats[fmt], `Missing format: ${fmt}`);
    }
  });
}

async function testGetGenerate() {
  await runTest('GET /api/vault/generate — returns supportedFormats', async () => {
    const res = await fetch(`${BASE_URL}/api/vault/generate`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(Array.isArray(json.supportedFormats), 'Response missing "supportedFormats" array');
    assert(json.supportedFormats.length === 7, `Expected 7 formats, got ${json.supportedFormats.length}`);
  });
}

// ---------------------------------------------------------------------------
// POST endpoint tests (vault generation)
// ---------------------------------------------------------------------------

async function postGenerate(body) {
  return fetch(`${BASE_URL}/api/vault/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function testBitwardenIndividual() {
  await runTest('POST bitwarden (individual) — valid JSON with items', async () => {
    const res = await postGenerate({ format: 'bitwarden', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('application/json'), `Expected JSON content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('vault_export.json'), `Expected vault_export.json disposition, got ${cd}`);

    const json = await res.json();
    assert(Array.isArray(json.items), 'Response missing "items" array');
    assert(json.items.length > 0, 'items array is empty');
  });
}

async function testBitwardenOrg() {
  await runTest('POST bitwarden (org) — valid JSON with collections', async () => {
    const res = await postGenerate({
      format: 'bitwarden',
      loginCount: 5,
      vaultType: 'org',
      useCollections: true,
      collectionCount: 3,
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const json = await res.json();
    assert(Array.isArray(json.collections), 'Response missing "collections" array');
    assert(json.collections.length > 0, 'collections array is empty');
  });
}

async function testLastPass() {
  await runTest('POST lastpass — CSV with header and data rows', async () => {
    const res = await postGenerate({ format: 'lastpass', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('text/csv'), `Expected CSV content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('lastpass_export.csv'), `Expected lastpass_export.csv, got ${cd}`);

    const text = await res.text();
    const lines = text.trim().split('\n');
    assert(lines.length >= 2, `Expected header + data rows, got ${lines.length} lines`);
  });
}

async function testKeeper() {
  await runTest('POST keeper — CSV with header and data rows', async () => {
    const res = await postGenerate({ format: 'keeper', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('text/csv'), `Expected CSV content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('keeper_export.csv'), `Expected keeper_export.csv, got ${cd}`);

    const text = await res.text();
    const lines = text.trim().split('\n');
    assert(lines.length >= 2, `Expected header + data rows, got ${lines.length} lines`);
  });
}

async function testEdge() {
  await runTest('POST edge — CSV with header and data rows', async () => {
    const res = await postGenerate({ format: 'edge', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('text/csv'), `Expected CSV content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('edge_export.csv'), `Expected edge_export.csv, got ${cd}`);

    const text = await res.text();
    const lines = text.trim().split('\n');
    assert(lines.length >= 2, `Expected header + data rows, got ${lines.length} lines`);
  });
}

async function testKeePassX() {
  await runTest('POST keepassx — CSV with header and data rows', async () => {
    const res = await postGenerate({ format: 'keepassx', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('text/csv'), `Expected CSV content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('keepassx_export.csv'), `Expected keepassx_export.csv, got ${cd}`);

    const text = await res.text();
    const lines = text.trim().split('\n');
    assert(lines.length >= 2, `Expected header + data rows, got ${lines.length} lines`);
  });
}

async function testKeePass2() {
  await runTest('POST keepass2 — valid XML', async () => {
    const res = await postGenerate({ format: 'keepass2', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('application/xml'), `Expected XML content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('keepass2_export.xml'), `Expected keepass2_export.xml, got ${cd}`);

    const text = await res.text();
    assert(text.includes('<?xml'), 'Response missing XML declaration');
    assert(text.includes('</KeePassFile>'), 'Response missing </KeePassFile> closing tag');
  });
}

async function testPasswordDepot() {
  await runTest('POST password-depot — CSV with header and data rows', async () => {
    const res = await postGenerate({ format: 'password-depot', loginCount: 5 });
    assert(res.status === 200, `Expected 200, got ${res.status}`);

    const ct = res.headers.get('content-type');
    assert(ct && ct.includes('text/csv'), `Expected CSV content-type, got ${ct}`);

    const cd = res.headers.get('content-disposition');
    assert(cd && cd.includes('password_depot_export.csv'), `Expected password_depot_export.csv, got ${cd}`);

    const text = await res.text();
    const lines = text.trim().split('\n');
    assert(lines.length >= 2, `Expected header + data rows, got ${lines.length} lines`);
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nTesting API at ${BASE_URL}\n`);
  console.log('--- GET endpoints ---');

  await testGetConfig();
  await testGetFormats();
  await testGetGenerate();

  console.log('\n--- POST /api/vault/generate (per format) ---');

  const postTests = [
    testBitwardenIndividual,
    testBitwardenOrg,
    testLastPass,
    testKeeper,
    testEdge,
    testKeePassX,
    testKeePass2,
    testPasswordDepot,
  ];

  for (let i = 0; i < postTests.length; i++) {
    if (i > 0) {
      process.stdout.write(`  ... waiting ${DELAY_BETWEEN_POSTS_MS / 1000}s (rate limit)\n`);
      await sleep(DELAY_BETWEEN_POSTS_MS);
    }
    await postTests[i]();
  }

  // Summary
  console.log(`\n--- Results: ${passed} passed, ${failures.length} failed ---`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    for (const f of failures) {
      console.error(`  - ${f.name}: ${f.error}`);
    }
    process.exit(1);
  }

  console.log('\nAll tests passed!\n');
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
