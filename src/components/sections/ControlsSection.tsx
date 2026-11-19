import { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowBigDown,
  ArrowBigUp,
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  Download,
  Heart,
  Loader2,
  Trash2,
  Undo2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ControlsSectionProps {
  onAnnounce: (msg: string) => void;
}

const PM_COMMANDS = {
  npm: 'npm i @aether/admin-kit',
  pnpm: 'pnpm add @aether/admin-kit',
  yarn: 'yarn add @aether/admin-kit',
  bun: 'bun add @aether/admin-kit',
} as const;

const GREETINGS = [
  { lang: 'English', text: 'Hello, administrator' },
  { lang: 'हिन्दी (Hindi)', text: 'नमस्ते, व्यवस्थापक' },
  { lang: 'Français', text: 'Bonjour, administrateur' },
  { lang: '日本語 (Japanese)', text: 'こんにちは、管理者' },
];

export function ControlsSection({ onAnnounce }: ControlsSectionProps) {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [vote, setVote] = useState<-1 | 0 | 1>(0);
  const [dlState, setDlState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [cliCopied, setCliCopied] = useState(false);
  const [fileDeleted, setFileDeleted] = useState(false);
  const [muted, setMuted] = useState(false);

  const [statusIdx, setStatusIdx] = useState(0);
  const [activeChips, setActiveChips] = useState<string[]>(['Design', 'Grid']);
  const [todos, setTodos] = useState([
    { id: 't1', label: 'Audit WCAG contrast', done: true },
    { id: 't2', label: 'Verify mobile drawer', done: false },
    { id: 't3', label: 'Publish Tailwind preset', done: false },
  ]);

  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const [pm, setPm] = useState<keyof typeof PM_COMMANDS>('npm');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [langIdx, setLangIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ringProgress, setRingProgress] = useState(74);
  const [showSkeletons, setShowSkeletons] = useState(false);

  const statuses = [
    { label: 'Online', dot: 'bg-success' },
    { label: 'Degraded', dot: 'bg-warning' },
    { label: 'Offline', dot: 'bg-danger' },
  ];

  const handleDownload = () => {
    if (dlState !== 'idle') return;
    setDlState('busy');
    setTimeout(() => {
      setDlState('done');
      onAnnounce('Package download completed');
      setTimeout(() => setDlState('idle'), 1800);
    }, 800);
  };

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(PM_COMMANDS[pm]);
    } catch {
      // ignore in sandbox
    }
    setCliCopied(true);
    onAnnounce(`Copied ${PM_COMMANDS[pm]}`);
    setTimeout(() => setCliCopied(false), 1500);
  };

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const strokeDashoffset = 226 - (226 * ringProgress) / 100;

  return (
    <section aria-labelledby="controls-heading" className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wider text-accent uppercase">
          Buttons, Toggles, Accordions &amp; Feedback
        </p>
        <h2 id="controls-heading" className="mt-1 text-2xl font-bold tracking-tight text-main">
          Interactive Controls &amp; Micro-Widgets
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Button Variants */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 lg:col-span-8">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
            Button Variants (&lt;button&gt;)
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Primary Solid
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong bg-elevated px-4 text-sm font-semibold text-main transition-colors hover:bg-subtle"
            >
              Secondary Surface
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface/70 px-4 text-sm font-semibold text-main backdrop-blur-md transition-colors hover:border-line-strong hover:bg-subtle"
            >
              Frosted Glass
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-accent/50 bg-transparent px-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/15"
            >
              Outline Accent
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-secondary transition-colors hover:bg-subtle hover:text-main"
            >
              Ghost
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-danger/35 bg-danger/15 px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-white"
            >
              Danger
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-success/35 bg-success/15 px-4 text-sm font-semibold text-success transition-colors hover:bg-success hover:text-white"
            >
              Success
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-main px-5 text-sm font-semibold text-inverse transition-opacity hover:opacity-90"
            >
              Pill Action
            </button>
            <button
              type="button"
              onClick={() => {
                setLoadingBtn(true);
                setTimeout(() => setLoadingBtn(false), 1200);
              }}
              disabled={loadingBtn}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong bg-elevated px-4 text-sm font-semibold text-main disabled:opacity-70"
            >
              {loadingBtn && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              <span>{loadingBtn ? 'Processing...' : 'Trigger Loading'}</span>
            </button>
          </div>
        </article>

        {/* Like, Bookmark, Karma Vote, Mute */}
        <article className="col-span-12 space-y-3 rounded-2xl border border-line bg-surface p-5 lg:col-span-4">
          <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
            Stateful Action Triggers
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              aria-pressed={liked}
              onClick={() => setLiked((v) => !v)}
              className={[
                'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
                liked
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-400'
                  : 'border-line-strong bg-elevated text-secondary hover:text-main',
              ].join(' ')}
            >
              <Heart className={liked ? 'h-4 w-4 fill-current' : 'h-4 w-4'} aria-hidden="true" />
              <span className="font-mono tabular-nums">{liked ? 129 : 128}</span>
            </button>

            <button
              type="button"
              aria-pressed={bookmarked}
              onClick={() => setBookmarked((v) => !v)}
              className={[
                'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors',
                bookmarked
                  ? 'border-accent/50 bg-accent/15 text-accent'
                  : 'border-line-strong bg-elevated text-secondary hover:text-main',
              ].join(' ')}
            >
              <Bookmark
                className={bookmarked ? 'h-4 w-4 fill-current' : 'h-4 w-4'}
                aria-hidden="true"
              />
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <div
              role="group"
              aria-label="Karma vote"
              className="inline-flex h-10 items-center gap-1 rounded-full border border-line-strong bg-elevated px-1.5"
            >
              <button
                type="button"
                aria-label="Upvote"
                aria-pressed={vote === 1}
                onClick={() => setVote((v) => (v === 1 ? 0 : 1))}
                className={[
                  'grid h-7 w-7 place-items-center rounded-full transition-colors',
                  vote === 1 ? 'bg-amber-500/20 text-amber-400' : 'text-muted hover:text-main',
                ].join(' ')}
              >
                <ArrowBigUp className="h-4 w-4" />
              </button>
              <span className="min-w-7 text-center font-mono text-xs font-bold tabular-nums text-main">
                {42 + vote}
              </span>
              <button
                type="button"
                aria-label="Downvote"
                aria-pressed={vote === -1}
                onClick={() => setVote((v) => (v === -1 ? 0 : -1))}
                className={[
                  'grid h-7 w-7 place-items-center rounded-full transition-colors',
                  vote === -1 ? 'bg-accent/20 text-accent' : 'text-muted hover:text-main',
                ].join(' ')}
              >
                <ArrowBigDown className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              aria-pressed={muted}
              onClick={() => setMuted((m) => !m)}
              className={[
                'grid h-10 w-10 place-items-center rounded-xl border transition-colors',
                muted
                  ? 'border-danger/40 bg-danger/15 text-danger'
                  : 'border-line-strong bg-elevated text-main hover:bg-subtle',
              ].join(' ')}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-elevated p-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-amber-400 to-fuchsia-500 text-xs font-bold text-white"
              >
                LB
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-main">Lucas Bonomi</p>
                <p className="truncate text-xs text-muted">@LukyVj</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFollowing((f) => !f)}
              className={[
                'h-8 shrink-0 rounded-full px-3.5 text-xs font-semibold transition-colors',
                following
                  ? 'border border-line-strong bg-transparent text-muted hover:text-main'
                  : 'bg-accent text-accent-contrast hover:bg-accent-hover',
              ].join(' ')}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </article>

        {/* Download, Delete/Undo, Status Cycler, Chips */}
        <article className="col-span-12 space-y-4 rounded-2xl border border-line bg-surface p-5 md:col-span-6 lg:col-span-4">
          <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
            Download, Undo Row &amp; Filter Chips
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className={[
                'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors',
                dlState === 'done'
                  ? 'bg-success text-white'
                  : 'bg-accent text-accent-contrast hover:bg-accent-hover',
              ].join(' ')}
            >
              {dlState === 'busy' ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : dlState === 'done' ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" aria-hidden="true" />
              )}
              <span>
                {dlState === 'idle' ? 'Download Bundle' : dlState === 'busy' ? 'Fetching...' : 'Saved'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusIdx((i) => (i + 1) % statuses.length)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-elevated px-3.5 text-xs font-semibold text-main hover:bg-subtle"
            >
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${statuses[statusIdx].dot}`} />
              <span>{statuses[statusIdx].label}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-elevated px-3 py-2.5 text-xs">
            {fileDeleted ? (
              <>
                <span className="text-muted">report-q4.pdf removed</span>
                <button
                  type="button"
                  onClick={() => setFileDeleted(false)}
                  className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                >
                  <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Undo
                </button>
              </>
            ) : (
              <>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-main">report-q4.pdf</p>
                  <p className="font-mono text-[11px] text-muted">2.4 MB · Audit</p>
                </div>
                <button
                  type="button"
                  aria-label="Delete report-q4.pdf"
                  onClick={() => setFileDeleted(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2.5 py-1 font-semibold text-danger hover:bg-danger hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['Design', 'Grid', 'Tailwind', 'Motion'].map((chip) => {
              const pressed = activeChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => toggleChip(chip)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                    pressed
                      ? 'border-transparent bg-main text-inverse'
                      : 'border-line-strong bg-elevated text-secondary hover:text-main',
                  ].join(' ')}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </article>

        {/* Package Manager & Pricing Segmented Tabs */}
        <article className="col-span-12 space-y-4 rounded-2xl border border-line bg-surface p-5 md:col-span-6 lg:col-span-4">
          <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
            Package Tabs &amp; Billing Switch
          </h3>

          <div className="overflow-hidden rounded-xl border border-line">
            <div role="tablist" aria-label="Package manager" className="flex gap-1 bg-elevated px-2 pt-2">
              {(Object.keys(PM_COMMANDS) as Array<keyof typeof PM_COMMANDS>).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={pm === key}
                  onClick={() => setPm(key)}
                  className={[
                    'rounded-t-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors',
                    pm === key ? 'bg-[#090a0d] text-slate-100' : 'text-muted hover:text-main',
                  ].join(' ')}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 bg-[#090a0d] px-3 py-2.5 font-mono text-xs text-purple-300">
              <code className="truncate">$ {PM_COMMANDS[pm]}</code>
              <button
                type="button"
                onClick={handleCopyCli}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
              >
                {cliCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {cliCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-elevated p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div role="tablist" aria-label="Billing interval" className="inline-flex rounded-lg border border-line bg-surface p-0.5">
                {(['monthly', 'yearly'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    role="tab"
                    aria-selected={billing === b}
                    onClick={() => setBilling(b)}
                    className={[
                      'rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors',
                      billing === b ? 'bg-accent text-accent-contrast' : 'text-muted hover:text-main',
                    ].join(' ')}
                  >
                    {b}
                  </button>
                ))}
              </div>
              {billing === 'yearly' && (
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                  Save 20%
                </span>
              )}
            </div>
            <p className="mt-2.5 font-mono text-2xl font-extrabold tabular-nums text-main">
              {billing === 'yearly' ? '$19' : '$24'}
              <span className="text-xs font-normal text-muted"> /seat/mo</span>
            </p>
          </div>
        </article>

        {/* Text Align, Units, Language, Checklist */}
        <article className="col-span-12 space-y-4 rounded-2xl border border-line bg-surface p-5 md:col-span-6 lg:col-span-4">
          <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
            Alignment, Units, Locale &amp; Checklist
          </h3>

          <div className="space-y-2">
            <div role="group" aria-label="Text alignment" className="inline-flex rounded-xl border border-line bg-elevated p-1">
              {(
                [
                  ['left', AlignLeft],
                  ['center', AlignCenter],
                  ['right', AlignRight],
                ] as const
              ).map(([val, Icon]) => (
                <button
                  key={val}
                  type="button"
                  aria-label={`Align ${val}`}
                  aria-pressed={align === val}
                  onClick={() => setAlign(val)}
                  className={[
                    'grid h-8 w-9 place-items-center rounded-lg transition-colors',
                    align === val ? 'bg-surface text-main shadow-xs' : 'text-muted hover:text-main',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <p
              className={[
                'rounded-xl border border-line bg-elevated px-3 py-2 text-xs text-secondary',
                align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right',
              ].join(' ')}
            >
              Dynamic text alignment controlled cleanly with Tailwind utilities.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center justify-between rounded-xl border border-line bg-elevated px-3 py-2.5">
              <div>
                <p className="font-mono text-lg font-extrabold tabular-nums text-main">
                  {tempUnit === 'C' ? '21°C' : '70°F'}
                </p>
                <p className="text-[11px] text-muted">Paris · Clear</p>
              </div>
              <button
                type="button"
                onClick={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
                className="rounded-lg border border-line bg-surface px-2 py-1 font-mono text-xs font-bold text-main hover:bg-subtle"
              >
                °{tempUnit}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setLangIdx((i) => (i + 1) % GREETINGS.length)}
              className="flex flex-col justify-center rounded-xl border border-line bg-elevated px-3 py-2 text-left transition-colors hover:border-accent/50"
            >
              <span className="truncate text-xs font-bold text-main">{GREETINGS[langIdx].text}</span>
              <span className="text-[11px] text-accent">{GREETINGS[langIdx].lang} ↻</span>
            </button>
          </div>

          <ul className="space-y-1.5">
            {todos.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={item.done}
                  onClick={() =>
                    setTodos((prev) =>
                      prev.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t))
                    )
                  }
                  className={[
                    'flex w-full items-center gap-2.5 rounded-xl border border-line bg-elevated px-3 py-2 text-left text-xs font-medium transition-colors',
                    item.done ? 'text-muted line-through' : 'text-main',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'grid h-4 w-4 shrink-0 place-items-center rounded border',
                      item.done
                        ? 'border-success bg-success text-white'
                        : 'border-line-strong bg-surface',
                    ].join(' ')}
                  >
                    {item.done && <Check className="h-3 w-3" />}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>

        {/* Accordion (<details>/<summary>), Flashcard, Circular Ring & Skeletons */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-5 lg:col-span-6">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
            Native Accordion (&lt;details&gt; / &lt;summary&gt;) &amp; Flashcard
          </h3>

          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-elevated">
            <details open className="group">
              <summary className="flex list-none items-center justify-between px-4 py-3 text-sm font-semibold text-main">
                <span>How are CSS variables mapped into Tailwind v4?</span>
                <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-3 text-xs leading-relaxed text-secondary">
                Tokens in <code>:root</code> and <code>[data-theme]</code> are mapped inside{' '}
                <code>@theme</code> so utility classes like <code>bg-surface</code> and{' '}
                <code>text-main</code> adapt automatically across all four themes.
              </p>
            </details>
            <details className="group">
              <summary className="flex list-none items-center justify-between px-4 py-3 text-sm font-semibold text-main">
                <span>Does every control support keyboard navigation?</span>
                <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-3 text-xs leading-relaxed text-secondary">
                Yes — native buttons, links, form fields, <code>&lt;details&gt;</code>, and{' '}
                <code>&lt;dialog&gt;</code> elements provide high-contrast focus rings and full Tab/Enter/Escape support.
              </p>
            </details>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-elevated p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-accent uppercase">
                  {flipped ? 'Answer' : 'Flashcard Prompt'}
                </p>
                <p className="mt-1 text-sm font-semibold text-main">
                  {flipped
                    ? 'Use font-variant-numeric: tabular-nums (Tailwind tabular-nums).'
                    : 'Which CSS property prevents jitter when dashboard counters update?'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                className="shrink-0 rounded-xl border border-line-strong bg-surface px-3 py-2 text-xs font-semibold text-main hover:bg-subtle"
              >
                {flipped ? 'Show Prompt' : 'Reveal'}
              </button>
            </div>
          </div>
        </article>

        {/* Circular SVG Gauge & Skeleton Loader */}
        <article className="col-span-12 flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Circular SVG Gauge &amp; Skeleton Loaders
              </h3>
              <p className="mt-1 text-xs text-secondary">
                Adjust progress interactively or toggle skeleton placeholder preview.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSkeletons((s) => !s)}
              className="shrink-0 rounded-xl border border-line bg-elevated px-3 py-1.5 text-xs font-semibold text-main hover:bg-subtle"
            >
              {showSkeletons ? 'Show Live Card' : 'Preview Skeleton'}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 rounded-xl border border-line bg-elevated p-4">
            <div className="relative grid h-20 w-20 shrink-0 place-items-center">
              <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  strokeWidth="7"
                  className="stroke-subtle"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="226"
                  strokeDashoffset={strokeDashoffset}
                  className="stroke-accent transition-all duration-300"
                />
              </svg>
              <span className="absolute font-mono text-sm font-bold tabular-nums text-main">
                {ringProgress}%
              </span>
            </div>

            {showSkeletons ? (
              <div className="flex-1 space-y-2.5" aria-busy="true" aria-label="Loading preview">
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-subtle" />
                <div className="h-3 w-full animate-pulse rounded bg-subtle" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-subtle" />
              </div>
            ) : (
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="ring-slider" className="font-semibold text-main">
                    Build Completion
                  </label>
                  <span className="font-mono text-muted">4.2s elapsed</span>
                </div>
                <input
                  id="ring-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={ringProgress}
                  onChange={(e) => setRingProgress(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <p className="text-xs text-muted">
                  Smooth SVG stroke-dashoffset binding with Tailwind accent stroke.
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
