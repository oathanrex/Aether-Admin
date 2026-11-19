import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Info,
  OctagonAlert,
  RotateCcw,
} from 'lucide-react';
import {
  filterAndSortClusters,
  formatThroughput,
  paginateItems,
  type ClusterStatus,
  type SortDirection,
  type SortKey,
  type WorkspaceCluster,
} from '../../utils/dashboardLogic.ts';

interface DataTablesSectionProps {
  clusters: WorkspaceCluster[];
  globalSearch: string;
  onToggleClusterStatus: (id: string) => void;
  onInspectCluster: (cluster: WorkspaceCluster) => void;
  onOpenModal: () => void;
  onAnnounce: (msg: string) => void;
}

export function DataTablesSection({
  clusters,
  globalSearch,
  onToggleClusterStatus,
  onInspectCluster,
  onOpenModal,
  onAnnounce,
}: DataTablesSectionProps) {
  const [localQuery, setLocalQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClusterStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('throughputRps');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(false);

  const combinedQuery = (localQuery || globalSearch).trim();

  const filtered = useMemo(
    () => filterAndSortClusters(clusters, combinedQuery, statusFilter, sortKey, sortDir),
    [clusters, combinedQuery, statusFilter, sortKey, sortDir]
  );

  const { pageItems, totalPages, currentPage } = useMemo(
    () => paginateItems(filtered, page, 4),
    [filtered, page]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    onAnnounce(`Sorted clusters by ${key}`);
  };

  const totalCost = filtered.reduce((sum, c) => sum + c.monthlyCostUsd, 0);

  return (
    <section aria-labelledby="tables-heading" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-accent uppercase">
            Tabular Data, Pagination, Dialogs &amp; Alerts
          </p>
          <h2 id="tables-heading" className="mt-1 text-2xl font-bold tracking-tight text-main">
            Admin Data Table, Pagination &amp; Native &lt;dialog&gt;
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setLoadingTable((v) => !v)}
            className="h-9 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-main hover:bg-subtle"
          >
            {loadingTable ? 'Exit Skeleton' : 'Simulate Loading'}
          </button>
          <button
            type="button"
            onClick={onOpenModal}
            className="h-9 rounded-xl bg-accent px-3.5 text-xs font-semibold text-accent-contrast hover:bg-accent-hover"
          >
            Open &lt;dialog&gt; Modal
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'active', 'building', 'paused'] as const).map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={statusFilter === status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={[
                'rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors',
                statusFilter === status
                  ? 'border-transparent bg-main text-inverse'
                  : 'border-line bg-elevated text-secondary hover:text-main',
              ].join(' ')}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="table-filter-input" className="sr-only">
            Filter table rows
          </label>
          <input
            id="table-filter-input"
            type="search"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by cluster or region..."
            className="h-9 w-full rounded-xl border border-line-strong bg-input px-3 text-xs text-main placeholder:text-muted focus:border-accent focus:outline-none sm:w-56"
          />
        </div>
      </div>

      {/* Semantic HTML5 Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Edge compute cluster inventory with throughput, latency, uptime, and monthly run rate
            </caption>
            <thead>
              <tr className="border-b border-line bg-elevated text-[11px] font-semibold tracking-wider text-muted uppercase">
                <th scope="col" className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-main"
                  >
                    <span>Cluster</span>
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                </th>
                <th scope="col" className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleSort('status')}
                    className="inline-flex items-center gap-1 hover:text-main"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('throughputRps')}
                    className="inline-flex items-center gap-1 hover:text-main"
                  >
                    <span>Throughput</span>
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('latencyMs')}
                    className="inline-flex items-center gap-1 hover:text-main"
                  >
                    <span>Latency</span>
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-right">Monthly</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {loadingTable ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3.5">
                      <div className="h-5 w-full animate-pulse rounded bg-subtle" />
                    </td>
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <p className="text-sm font-semibold text-main">No matching clusters found</p>
                    <p className="mt-1 text-xs text-muted">
                      Clear your search or status filter to view all provisioned workspaces.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLocalQuery('');
                        setStatusFilter('all');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-elevated px-3.5 py-1.5 text-xs font-semibold text-main hover:bg-subtle"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                pageItems.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-elevated/60">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-main">{c.name}</p>
                      <p className="font-mono text-xs text-muted">
                        {c.region} · {c.nodes} nodes · {c.uptimePct}% SLA
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                          c.status === 'active'
                            ? 'bg-success/15 text-success'
                            : c.status === 'building'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-danger/15 text-danger',
                        ].join(' ')}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums text-main">
                      {formatThroughput(c.throughputRps)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-secondary">
                      {c.latencyMs} ms
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums text-main">
                      ${c.monthlyCostUsd}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleClusterStatus(c.id)}
                          className="rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs font-semibold text-main hover:bg-subtle"
                        >
                          {c.status === 'paused' ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onInspectCluster(c)}
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/15"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot>
              <tr className="border-t border-line bg-elevated text-xs font-semibold text-secondary">
                <td colSpan={4} className="px-4 py-2.5">
                  Showing <span className="font-mono tabular-nums text-main">{pageItems.length}</span>{' '}
                  of <span className="font-mono tabular-nums text-main">{filtered.length}</span>{' '}
                  filtered clusters (&lt;tfoot&gt; summary)
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-main">
                  ${totalCost.toLocaleString('en-US')}/mo
                </td>
                <td className="px-4 py-2.5" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
          <span className="text-xs text-muted">
            Page <strong className="font-mono tabular-nums text-main">{currentPage}</strong> of{' '}
            <strong className="font-mono tabular-nums text-main">{totalPages}</strong>
          </span>
          <nav aria-label="Cluster table pagination" className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 rounded-lg border border-line bg-elevated px-2.5 text-xs font-semibold text-main disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  type="button"
                  aria-current={pNum === currentPage ? 'page' : undefined}
                  onClick={() => setPage(pNum)}
                  className={[
                    'grid h-8 w-8 place-items-center rounded-lg font-mono text-xs font-bold tabular-nums transition-colors',
                    pNum === currentPage
                      ? 'bg-accent text-accent-contrast'
                      : 'border border-line bg-elevated text-secondary hover:text-main',
                  ].join(' ')}
                >
                  {pNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 rounded-lg border border-line bg-elevated px-2.5 text-xs font-semibold text-main disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Semantic Alert Banners */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-success/35 bg-success/10 p-4 text-sm"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          <div>
            <p className="font-semibold text-main">Success Status (role="status")</p>
            <p className="mt-0.5 text-xs text-secondary">
              Zero automated contrast or keyboard trap violations detected across components.
            </p>
          </div>
        </div>

        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-info/35 bg-info/10 p-4 text-sm"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden="true" />
          <div>
            <p className="font-semibold text-main">Informational Notice</p>
            <p className="mt-0.5 text-xs text-secondary">
              Press <kbd className="rounded border border-line px-1 font-mono text-[11px]">⌘K</kbd>{' '}
              anywhere to jump directly to global filtering.
            </p>
          </div>
        </div>

        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-warning/35 bg-warning/10 p-4 text-sm"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <div>
            <p className="font-semibold text-main">Capacity Warning (role="alert")</p>
            <p className="mt-0.5 text-xs text-secondary">
              Vortex Shader Lab is building at 82% memory allocation in eu-central-1.
            </p>
          </div>
        </div>

        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm"
        >
          <OctagonAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <div>
            <p className="font-semibold text-main">Paused Node Alert</p>
            <p className="mt-0.5 text-xs text-secondary">
              Solaris Cache requires manual confirmation before resuming edge traffic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
