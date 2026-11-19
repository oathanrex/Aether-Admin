import { useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Globe,
  Layers,
  Server,
  Terminal,
} from 'lucide-react';
import { THROUGHPUT_SERIES, type SectionId } from '../../data/dashboardData.ts';
import {
  advanceOrderStep,
  formatThroughput,
  type WorkspaceCluster,
} from '../../utils/dashboardLogic.ts';

interface OverviewSectionProps {
  clusters: WorkspaceCluster[];
  onNavigate: (section: SectionId) => void;
  onAnnounce: (msg: string) => void;
  onOpenModal: () => void;
  isAllView?: boolean;
}

const STEP_LABELS = ['Queued', 'Building', 'Verifying', 'Live Edge'];

export function OverviewSection({
  clusters,
  onNavigate,
  onAnnounce,
  onOpenModal,
  isAllView = false,
}: OverviewSectionProps) {
  const [chartWindow, setChartWindow] = useState<'24H' | '7D' | '30D'>('24H');
  const [selectedBarIdx, setSelectedBarIdx] = useState<number>(4);
  const [deployStep, setDeployStep] = useState<number>(2);
  const [autoScale, setAutoScale] = useState<boolean>(true);
  const [strictCsp, setStrictCsp] = useState<boolean>(true);

  const multiplier = chartWindow === '24H' ? 1 : chartWindow === '7D' ? 6.4 : 26.8;
  const activeCount = clusters.filter((c) => c.status === 'active').length;
  const totalRps = clusters.reduce((sum, c) => sum + c.throughputRps, 0);
  const avgLatency = clusters.length
    ? Math.round(clusters.reduce((sum, c) => sum + c.latencyMs, 0) / clusters.length)
    : 0;
  const monthlySpend = clusters.reduce((sum, c) => sum + c.monthlyCostUsd, 0);

  const maxRequests = Math.max(...THROUGHPUT_SERIES.map((d) => d.requests));
  const activePoint = THROUGHPUT_SERIES[selectedBarIdx] ?? THROUGHPUT_SERIES[0];

  return (
    <section aria-labelledby="overview-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-accent uppercase">
            Administration Console
          </p>
          <h1 id="overview-heading" className="mt-1 text-2xl font-extrabold tracking-tight text-main sm:text-3xl">
            System Overview &amp; Grid Layout
          </h1>
          <p className="mt-1 text-sm text-secondary">
            12-column responsive Bento architecture built with semantic HTML5 and Tailwind CSS tokens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-main transition-colors hover:bg-subtle"
          >
            Inspect &lt;dialog&gt;
          </button>
          {!isAllView && (
            <button
              type="button"
              onClick={() => onNavigate('all')}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <span>Browse All 65+ Elements</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* 12-Column Responsive Bento Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* KPI 1 */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 sm:col-span-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Global Throughput
            </span>
            <Activity className="h-4 w-4 text-accent" aria-hidden="true" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums text-main">
            {formatThroughput(totalRps)}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 font-semibold tabular-nums text-success">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              +14.2%
            </span>
            <span className="text-muted">vs previous 24h</span>
          </div>
        </article>

        {/* KPI 2 */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 sm:col-span-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Active Clusters
            </span>
            <Server className="h-4 w-4 text-success" aria-hidden="true" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums text-main">
            {activeCount} / {clusters.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 font-semibold tabular-nums text-success">
              99.96% SLA
            </span>
            <span className="text-muted">multi-region</span>
          </div>
        </article>

        {/* KPI 3 */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 sm:col-span-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Median Latency
            </span>
            <Globe className="h-4 w-4 text-info" aria-hidden="true" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums text-main">
            {avgLatency} ms
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 font-semibold tabular-nums text-success">
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
              −4 ms
            </span>
            <span className="text-muted">p50 edge latency</span>
          </div>
        </article>

        {/* KPI 4 */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 sm:col-span-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Monthly Run Rate
            </span>
            <Cpu className="h-4 w-4 text-warning" aria-hidden="true" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums text-main">
            ${monthlySpend.toLocaleString('en-US')}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 font-semibold tabular-nums text-warning">
              74% budget
            </span>
            <span className="text-muted">auto-capped</span>
          </div>
        </article>

        {/* Chart Panel */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-main">Edge Request Volume</h2>
              <p className="text-xs text-muted">
                Selected window: <strong className="font-mono text-main">{activePoint.hour}</strong> —{' '}
                <span className="font-mono tabular-nums text-accent">
                  {(activePoint.requests * multiplier).toFixed(2)}M req
                </span>{' '}
                ({activePoint.errors}% error rate)
              </p>
            </div>
            <div role="tablist" aria-label="Chart timeframe" className="inline-flex rounded-xl border border-line bg-elevated p-1">
              {(['24H', '7D', '30D'] as const).map((win) => (
                <button
                  key={win}
                  type="button"
                  role="tab"
                  aria-selected={chartWindow === win}
                  onClick={() => {
                    setChartWindow(win);
                    onAnnounce(`Chart timeframe updated to ${win}`);
                  }}
                  className={[
                    'rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors',
                    chartWindow === win
                      ? 'bg-surface text-main shadow-xs'
                      : 'text-muted hover:text-main',
                  ].join(' ')}
                >
                  {win}
                </button>
              ))}
            </div>
          </div>

          <figure className="mt-5">
            <div className="grid h-48 grid-cols-7 items-end gap-3 rounded-xl border border-line bg-elevated p-4">
              {THROUGHPUT_SERIES.map((point, idx) => {
                const heightPct = Math.round((point.requests / maxRequests) * 100);
                const isSelected = idx === selectedBarIdx;
                return (
                  <button
                    key={point.hour}
                    type="button"
                    onClick={() => setSelectedBarIdx(idx)}
                    aria-label={`${point.hour}: ${(point.requests * multiplier).toFixed(2)} million requests`}
                    className="group flex h-full flex-col items-center justify-end gap-2 focus-visible:rounded-lg"
                  >
                    <span
                      className={[
                        'font-mono text-[11px] font-semibold tabular-nums transition-opacity',
                        isSelected
                          ? 'text-accent opacity-100'
                          : 'text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                      ].join(' ')}
                    >
                      {(point.requests * multiplier).toFixed(1)}M
                    </span>
                    <span
                      style={{ height: `${Math.max(18, heightPct)}%` }}
                      className={[
                        'w-full max-w-[38px] rounded-t-lg transition-all duration-300',
                        isSelected
                          ? 'bg-accent shadow-sm'
                          : 'bg-accent/35 group-hover:bg-accent/70',
                      ].join(' ')}
                    />
                    <span
                      className={[
                        'font-mono text-[11px] tabular-nums',
                        isSelected ? 'font-bold text-main' : 'text-muted',
                      ].join(' ')}
                    >
                      {point.hour}
                    </span>
                  </button>
                );
              })}
            </div>
            <figcaption className="mt-2 flex items-center justify-between text-xs text-muted">
              <span>Interactive bar telemetry — click or tab any interval.</span>
              <time dateTime="2025-05-12">Updated today</time>
            </figcaption>
          </figure>
        </article>

        {/* Deployment Stepper & Telemetry */}
        <article className="col-span-12 flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-main">Release Pipeline</h2>
              <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-accent">
                Step {deployStep}/4
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Interactive ordered list (<code>&lt;ol&gt;</code>), <code>&lt;progress&gt;</code>, and{' '}
              <code>&lt;meter&gt;</code>.
            </p>

            <ol className="mt-4 space-y-2.5">
              {STEP_LABELS.map((label, idx) => {
                const stepNum = idx + 1;
                const done = stepNum <= deployStep;
                return (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span
                      className={[
                        'grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-xs font-bold tabular-nums transition-colors',
                        done
                          ? 'border-accent bg-accent text-accent-contrast'
                          : 'border-line-strong bg-elevated text-muted',
                      ].join(' ')}
                    >
                      {stepNum}
                    </span>
                    <span className={done ? 'font-semibold text-main' : 'text-muted'}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 space-y-3 border-t border-line pt-4">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <label htmlFor="overview-progress" className="font-medium text-secondary">
                    Artifact Sync (<code>&lt;progress&gt;</code>)
                  </label>
                  <output className="font-mono font-semibold tabular-nums text-main">
                    {deployStep * 25}%
                  </output>
                </div>
                <progress
                  id="overview-progress"
                  value={deployStep * 25}
                  max={100}
                  className="aether-progress h-2 w-full"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <label htmlFor="overview-meter" className="font-medium text-secondary">
                    Memory Headroom (<code>&lt;meter&gt;</code>)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-success">78%</span>
                </div>
                <meter
                  id="overview-meter"
                  min={0}
                  max={100}
                  low={30}
                  high={85}
                  optimum={75}
                  value={78}
                  className="aether-meter"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = advanceOrderStep(deployStep, 4);
              setDeployStep(next);
              onAnnounce(`Release pipeline advanced to step ${next}: ${STEP_LABELS[next - 1]}`);
            }}
            className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl border border-line bg-elevated px-4 text-sm font-semibold text-main transition-colors hover:bg-subtle"
          >
            Advance Pipeline Step
          </button>
        </article>

        {/* Active Clusters Quick Preview */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 xl:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-main">Compute Clusters</h2>
              <p className="text-xs text-muted">
                Semantic <code>&lt;table&gt;</code> summary with tabular throughput figures.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tables')}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Manage all &rarr;
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-elevated text-[11px] font-semibold tracking-wider text-muted uppercase">
                  <th scope="col" className="px-4 py-2.5">Workspace</th>
                  <th scope="col" className="px-4 py-2.5">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Throughput</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {clusters.slice(0, 4).map((cluster) => (
                  <tr key={cluster.id} className="transition-colors hover:bg-elevated/60">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-main">{cluster.name}</p>
                      <p className="font-mono text-xs text-muted">
                        {cluster.region} · {cluster.nodes} nodes
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={[
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                          cluster.status === 'active'
                            ? 'bg-success/15 text-success'
                            : cluster.status === 'building'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-danger/15 text-danger',
                        ].join(' ')}
                      >
                        <span
                          aria-hidden="true"
                          className={[
                            'h-1.5 w-1.5 rounded-full',
                            cluster.status === 'active'
                              ? 'bg-success'
                              : cluster.status === 'building'
                                ? 'bg-warning'
                                : 'bg-danger',
                          ].join(' ')}
                        />
                        {cluster.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-main">
                      {formatThroughput(cluster.throughputRps)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-secondary">
                      {cluster.latencyMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Quick Switches & HTML5 Kit Directory */}
        <article className="col-span-12 flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 xl:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-main">Quick Governance &amp; Kit Index</h2>
              <Layers className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-3.5 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-main">Auto-scale Edge Nodes</p>
                  <p className="text-xs text-muted">Expand pool when p95 exceeds 35ms</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoScale}
                  aria-label="Auto-scale Edge Nodes"
                  onClick={() => setAutoScale((v) => !v)}
                  className={[
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
                    autoScale ? 'border-accent bg-accent' : 'border-line-strong bg-subtle',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                      autoScale ? 'translate-x-5.5' : 'translate-x-1',
                    ].join(' ')}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-3.5 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-main">Strict CSP Headers</p>
                  <p className="text-xs text-muted">Enforce nonce-verified scripts only</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={strictCsp}
                  aria-label="Strict CSP Headers"
                  onClick={() => setStrictCsp((v) => !v)}
                  className={[
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
                    strictCsp ? 'border-accent bg-accent' : 'border-line-strong bg-subtle',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                      strictCsp ? 'translate-x-5.5' : 'translate-x-1',
                    ].join(' ')}
                  />
                </button>
              </div>
            </div>

            <details className="rounded-xl border border-line bg-elevated p-3 text-xs">
              <summary className="flex items-center justify-between font-semibold text-main">
                <span className="inline-flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  Included Semantic HTML5 Categories
                </span>
                <span className="font-mono text-muted">Expand</span>
              </summary>
              <p className="mt-2 leading-relaxed text-secondary">
                Covers landmarks (<code>header</code>, <code>aside</code>, <code>nav</code>,{' '}
                <code>main</code>, <code>section</code>, <code>article</code>, <code>footer</code>),
                prose, 15+ form input types, ARIA switches/tabs, tables, native{' '}
                <code>&lt;dialog&gt;</code>, media, and commerce controls.
              </p>
            </details>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 pt-2">
            {(
              [
                ['typography', 'Typography'],
                ['forms', 'Forms & Inputs'],
                ['controls', 'Controls & UI'],
                ['commerce', 'Commerce & Chat'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="rounded-xl border border-line bg-elevated px-3 py-2 text-left text-xs font-semibold text-main transition-colors hover:border-accent/50 hover:bg-subtle"
              >
                {label} &rarr;
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
