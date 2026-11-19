import type { CartItem, WorkspaceCluster } from '../utils/dashboardLogic.ts';

export type SectionId =
  | 'all'
  | 'overview'
  | 'typography'
  | 'forms'
  | 'controls'
  | 'tables'
  | 'commerce';

export interface NavItem {
  id: SectionId;
  label: string;
  shortLabel: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview Grid', shortLabel: 'Overview' },
  { id: 'all', label: 'All HTML Elements', shortLabel: 'All Elements', badge: '65+' },
  { id: 'typography', label: 'Typography & Prose', shortLabel: 'Typography' },
  { id: 'forms', label: 'Forms & Inputs', shortLabel: 'Forms' },
  { id: 'controls', label: 'Controls & Widgets', shortLabel: 'Controls' },
  { id: 'tables', label: 'Data, Tables & Modals', shortLabel: 'Tables' },
  { id: 'commerce', label: 'Commerce, Media & Chat', shortLabel: 'Commerce' },
];

export const INITIAL_CLUSTERS: WorkspaceCluster[] = [
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
  {
    id: 'c4',
    name: 'Helios Telemetry Mesh',
    region: 'us-west-2',
    nodes: 6,
    status: 'active',
    throughputRps: 2_310_000,
    latencyMs: 11,
    uptimePct: 99.99,
    monthlyCostUsd: 680,
  },
  {
    id: 'c5',
    name: 'Boreal Inference Pool',
    region: 'eu-west-1',
    nodes: 3,
    status: 'active',
    throughputRps: 980_000,
    latencyMs: 19,
    uptimePct: 99.91,
    monthlyCostUsd: 310,
  },
  {
    id: 'c6',
    name: 'Kuro Streaming Relay',
    region: 'ap-northeast-1',
    nodes: 2,
    status: 'building',
    throughputRps: 450_000,
    latencyMs: 24,
    uptimePct: 99.62,
    monthlyCostUsd: 215,
  },
];

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Jakub promoted Acme Edge Cluster to v2.4', time: '2 min ago', unread: true },
  { id: 'n2', title: 'Security policy audit passed WCAG AAA contrast', time: '1 h ago', unread: true },
  { id: 'n3', title: 'Quarterly billing invoice #INV-2084 settled', time: 'Yesterday', unread: false },
];

export interface ChatMessage {
  id: string;
  sender: 'them' | 'me';
  text: string;
  time: string;
}

export const INITIAL_CHAT: ChatMessage[] = [
  { id: 'm1', sender: 'them', text: 'Did you verify all HTML5 form controls in light & dark mode?', time: '10:41' },
  { id: 'm2', sender: 'me', text: 'Yes — semantic tags, Tailwind tokens, and keyboard focus rings are live.', time: '10:42' },
];

export const INITIAL_CART: CartItem[] = [
  { id: 'desk-lamp', name: 'Halo Studio Lamp', unitPriceUsd: 49, quantity: 1 },
];

export const THROUGHPUT_SERIES = [
  { hour: '00:00', requests: 1.12, errors: 0.04 },
  { hour: '04:00', requests: 0.94, errors: 0.02 },
  { hour: '08:00', requests: 1.48, errors: 0.05 },
  { hour: '12:00', requests: 2.15, errors: 0.03 },
  { hour: '16:00', requests: 2.42, errors: 0.04 },
  { hour: '20:00', requests: 1.88, errors: 0.02 },
  { hour: '23:59', requests: 1.64, errors: 0.02 },
];

export const CATALOG_PAGINATED_ITEMS = [
  { id: 'p1', name: 'Aurora Grid Engine', meta: 'Layout · CSS Grid', color: '#8b7bff' },
  { id: 'p2', name: 'Obsidian Form Suite', meta: 'Inputs · Validation', color: '#10b981' },
  { id: 'p3', name: 'Tabular Ledger Table', meta: 'Data · Sorting', color: '#38bdf8' },
  { id: 'p4', name: 'Dialog Focus Trap', meta: 'Overlay · WAI-ARIA', color: '#f59e0b' },
  { id: 'p5', name: 'Segmented Tab Bar', meta: 'Navigation · Keyboard', color: '#ec4899' },
  { id: 'p6', name: 'Progress & Meter Bar', meta: 'Telemetry · Native', color: '#06b6d4' },
];
