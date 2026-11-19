import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceOrderStep,
  assessPasswordStrength,
  calculateCartTotalUsd,
  filterAndSortClusters,
  filterCommands,
  formatCurrency,
  formatThroughput,
  paginateItems,
  validateEmailAddress,
  wrapHighlightIndex,
  type CommandPaletteItem,
  type WorkspaceCluster,
} from './dashboardLogic.ts';

const SAMPLE_CLUSTERS: WorkspaceCluster[] = [
  {
    id: 'c1',
    name: 'Acme Edge Cluster',
    region: 'us-east-1',
    nodes: 4,
    status: 'active',
    throughputRps: 1_840_000,
    latencyMs: 14,
    uptimePct: 99.98,
    monthlyCostUsd: 420,
  },
  {
    id: 'c2',
    name: 'Vortex Shader Lab',
    region: 'eu-central-1',
    nodes: 2,
    status: 'building',
    throughputRps: 640_000,
    latencyMs: 28,
    uptimePct: 99.4,
    monthlyCostUsd: 190,
  },
  {
    id: 'c3',
    name: 'Solaris Cache',
    region: 'ap-south-1',
    nodes: 1,
    status: 'paused',
    throughputRps: 12_000,
    latencyMs: 41,
    uptimePct: 98.2,
    monthlyCostUsd: 45,
  },
];

test('filterAndSortClusters filters by query and status and sorts numerically', () => {
  const activeOnly = filterAndSortClusters(SAMPLE_CLUSTERS, '', 'active', 'name', 'asc');
  assert.equal(activeOnly.length, 1);
  assert.equal(activeOnly[0].id, 'c1');

  const euSearch = filterAndSortClusters(SAMPLE_CLUSTERS, 'eu-central', 'all', 'name', 'asc');
  assert.equal(euSearch.length, 1);
  assert.equal(euSearch[0].id, 'c2');

  const byThroughputAsc = filterAndSortClusters(SAMPLE_CLUSTERS, '', 'all', 'throughputRps', 'asc');
  assert.deepEqual(
    byThroughputAsc.map((c) => c.id),
    ['c3', 'c2', 'c1']
  );
});

test('paginateItems clamps out-of-range page numbers cleanly', () => {
  const result = paginateItems(['a', 'b', 'c', 'd', 'e'], 99, 2);
  assert.equal(result.totalPages, 3);
  assert.equal(result.currentPage, 3);
  assert.deepEqual(result.pageItems, ['e']);
});

test('formatCurrency converts USD into USD, EUR, and JPY accurately', () => {
  assert.equal(formatCurrency(100, 'USD'), '$100.00');
  assert.equal(formatCurrency(100, 'EUR'), '€92.00');
  assert.equal(formatCurrency(100, 'JPY'), '¥15,400');
});

test('calculateCartTotalUsd sums item counts and subtotal safely', () => {
  const totals = calculateCartTotalUsd([
    { id: '1', name: 'Halo Lamp', unitPriceUsd: 49, quantity: 2 },
    { id: '2', name: 'Node Pack', unitPriceUsd: 12, quantity: 3 },
  ]);
  assert.equal(totals.itemCount, 5);
  assert.equal(totals.subtotalUsd, 134);
});

test('validateEmailAddress rejects invalid inputs and accepts valid addresses', () => {
  assert.equal(validateEmailAddress('').valid, false);
  assert.equal(validateEmailAddress('bad-email').valid, false);
  assert.equal(validateEmailAddress('admin@aether.dev').valid, true);
});

test('assessPasswordStrength scores weak through very strong passwords', () => {
  assert.equal(assessPasswordStrength('').score, 0);
  assert.equal(assessPasswordStrength('short').score, 1);
  assert.equal(assessPasswordStrength('AuraSecurePassword982!').score, 4);
});

test('advanceOrderStep cycles steps 1..4 cleanly', () => {
  assert.equal(advanceOrderStep(1), 2);
  assert.equal(advanceOrderStep(4), 1);
});

test('formatThroughput formats millions and thousands cleanly', () => {
  assert.equal(formatThroughput(1_840_000), '1.84M req/s');
  assert.equal(formatThroughput(640_000), '640K req/s');
  assert.equal(formatThroughput(512), '512 req/s');
});

const SAMPLE_COMMANDS: CommandPaletteItem[] = [
  {
    id: 'nav-forms',
    category: 'Navigation',
    label: 'Forms & Inputs',
    description: 'Switch view to Forms & Inputs',
    keywords: ['forms', 'inputs', 'validation'],
    actionType: 'section',
    payload: 'forms',
  },
  {
    id: 'theme-light',
    category: 'Theme',
    label: 'Alabaster Light Theme',
    description: 'High-clarity daylight alabaster workspace palette',
    keywords: ['light', 'day', 'alabaster'],
    actionType: 'theme',
    payload: 'light',
  },
  {
    id: 'theme-toggle',
    category: 'Theme',
    label: 'Light Mode Quick Toggle',
    description: 'Flip between Light and Dark theme',
    keywords: ['toggle', 'light', 'dark'],
    actionType: 'toggle-light-dark',
  },
];

test('filterCommands returns all commands when query is empty and ranks prefix matches first', () => {
  assert.equal(filterCommands(SAMPLE_COMMANDS, '   ').length, 3);

  const lightResults = filterCommands(SAMPLE_COMMANDS, 'light');
  assert.deepEqual(
    lightResults.map((c) => c.id),
    ['theme-toggle', 'theme-light']
  );

  const kwResults = filterCommands(SAMPLE_COMMANDS, 'validation');
  assert.deepEqual(
    kwResults.map((c) => c.id),
    ['nav-forms']
  );
});

test('wrapHighlightIndex wraps forward/backward cleanly and handles empty list', () => {
  assert.equal(wrapHighlightIndex(0, 1, 3), 1);
  assert.equal(wrapHighlightIndex(2, 1, 3), 0);
  assert.equal(wrapHighlightIndex(0, -1, 3), 2);
  assert.equal(wrapHighlightIndex(-1, 1, 3), 1);
  assert.equal(wrapHighlightIndex(0, 1, 0), -1);
});

