export type ThemeMode = 'dark' | 'light' | 'oled' | 'high-contrast';

export type ClusterStatus = 'active' | 'building' | 'paused';

export type SortKey = 'name' | 'status' | 'throughputRps' | 'latencyMs';
export type SortDirection = 'asc' | 'desc';

export interface WorkspaceCluster {
  id: string;
  name: string;
  region: string;
  nodes: number;
  status: ClusterStatus;
  throughputRps: number;
  latencyMs: number;
  uptimePct: number;
  monthlyCostUsd: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'JPY';

export interface CartItem {
  id: string;
  name: string;
  unitPriceUsd: number;
  quantity: number;
}

export interface PasswordAssessment {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Empty' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  meetsLength: boolean;
  hasNumberOrSymbol: boolean;
  hasMixedCase: boolean;
}

const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; decimals: number }> = {
  USD: { rate: 1, symbol: '$', decimals: 2 },
  EUR: { rate: 0.92, symbol: '€', decimals: 2 },
  JPY: { rate: 154, symbol: '¥', decimals: 0 },
};

export function filterAndSortClusters(
  clusters: WorkspaceCluster[],
  query: string,
  statusFilter: ClusterStatus | 'all',
  sortKey: SortKey,
  sortDir: SortDirection
): WorkspaceCluster[] {
  const normalized = query.trim().toLowerCase();

  const filtered = clusters.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    if (!matchesStatus) return false;
    if (!normalized) return true;
    return (
      c.name.toLowerCase().includes(normalized) ||
      c.region.toLowerCase().includes(normalized) ||
      c.status.toLowerCase().includes(normalized)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name' || sortKey === 'status') {
      cmp = a[sortKey].localeCompare(b[sortKey]);
    } else {
      cmp = a[sortKey] - b[sortKey];
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return sorted;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): { pageItems: T[]; totalPages: number; currentPage: number } {
  const safeSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / safeSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safeSize;
  return {
    pageItems: items.slice(start, start + safeSize),
    totalPages,
    currentPage,
  };
}

export function formatCurrency(usdAmount: number, currency: CurrencyCode): string {
  const meta = CURRENCY_RATES[currency];
  const converted = usdAmount * meta.rate;
  return `${meta.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  })}`;
}

export function calculateCartTotalUsd(items: CartItem[]): { itemCount: number; subtotalUsd: number } {
  return items.reduce(
    (acc, item) => ({
      itemCount: acc.itemCount + Math.max(0, item.quantity),
      subtotalUsd: acc.subtotalUsd + Math.max(0, item.quantity) * Math.max(0, item.unitPriceUsd),
    }),
    { itemCount: 0, subtotalUsd: 0 }
  );
}

export function validateEmailAddress(email: string): { valid: boolean; error: string | null } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email like admin@company.com.' };
  }
  return { valid: true, error: null };
}

export function assessPasswordStrength(password: string): PasswordAssessment {
  if (!password) {
    return {
      score: 0,
      label: 'Empty',
      meetsLength: false,
      hasNumberOrSymbol: false,
      hasMixedCase: false,
    };
  }
  const meetsLength = password.length >= 12;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let score: 0 | 1 | 2 | 3 | 4 = 1;
  if (password.length >= 8) score = 2;
  if (meetsLength && (hasNumberOrSymbol || hasMixedCase)) score = 3;
  if (meetsLength && hasNumberOrSymbol && hasMixedCase) score = 4;

  const labels: Record<0 | 1 | 2 | 3 | 4, PasswordAssessment['label']> = {
    0: 'Empty',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong',
  };

  return {
    score,
    label: labels[score],
    meetsLength,
    hasNumberOrSymbol,
    hasMixedCase,
  };
}

export function advanceOrderStep(currentStep: number, totalSteps = 4): number {
  if (currentStep >= totalSteps) return 1;
  return currentStep + 1;
}

export function formatThroughput(rps: number): string {
  if (rps >= 1_000_000) return `${(rps / 1_000_000).toFixed(2)}M req/s`;
  if (rps >= 1_000) return `${Math.round(rps / 1_000)}K req/s`;
  return `${rps} req/s`;
}

export type CommandCategory = 'Navigation' | 'Theme' | 'Actions';

export interface CommandPaletteItem {
  id: string;
  category: CommandCategory;
  label: string;
  description: string;
  keywords: string[];
  actionType: 'section' | 'theme' | 'toggle-light-dark' | 'toggle-wave' | 'open-modal';
  payload?: string;
}

export function filterCommands(
  items: CommandPaletteItem[],
  query: string
): CommandPaletteItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  const scored: Array<{ item: CommandPaletteItem; score: number }> = [];
  for (const item of items) {
    const labelLower = item.label.toLowerCase();
    const descLower = item.description.toLowerCase();
    const catLower = item.category.toLowerCase();
    const kwMatch = item.keywords.some((k) => k.toLowerCase().includes(q));

    if (labelLower.startsWith(q)) {
      scored.push({ item, score: 3 });
    } else if (labelLower.includes(q)) {
      scored.push({ item, score: 2 });
    } else if (kwMatch || descLower.includes(q) || catLower.includes(q)) {
      scored.push({ item, score: 1 });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.item);
}

export function wrapHighlightIndex(
  currentIndex: number,
  delta: number,
  length: number
): number {
  if (length <= 0) return -1;
  const base = currentIndex < 0 ? 0 : currentIndex;
  return (((base + delta) % length) + length) % length;
}

