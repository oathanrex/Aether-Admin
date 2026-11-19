import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface TypographySectionProps {
  onAnnounce: (msg: string) => void;
}

const SAMPLE_SNIPPET = `import { createAdminGrid } from '@aether/ui';

export function DashboardShell() {
  return <main className="grid grid-cols-12 gap-4" />;
}`;

export function TypographySection({ onAnnounce }: TypographySectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_SNIPPET);
    } catch {
      // Clipboard fallback in restricted iframe
    }
    setCopied(true);
    onAnnounce('Code block copied to clipboard');
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section aria-labelledby="typography-heading" className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wider text-accent uppercase">
          Semantic Text &amp; Prose Elements
        </p>
        <h2 id="typography-heading" className="mt-1 text-2xl font-bold tracking-tight text-main">
          Typography, Lists, Code &amp; Blockquotes
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Headings Scale */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-6 lg:col-span-6">
          <h3 className="mb-4 text-xs font-semibold tracking-wider text-muted uppercase">
            Heading Hierarchy (&lt;h1&gt; – &lt;h6&gt;) &amp; Lead Copy
          </h3>
          <div className="space-y-3">
            <p
              aria-label="Heading 1 specimen"
              className="text-3xl font-extrabold tracking-tight text-main sm:text-4xl"
            >
              Heading 1 · Display Hero <code className="align-middle text-xs font-normal text-muted">&lt;h1&gt;</code>
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-main">
              Heading 2 · Section Header
            </h2>
            <h3 className="text-xl font-semibold text-main">Heading 3 · Module Title</h3>
            <h4 className="text-lg font-semibold text-main">Heading 4 · Card Title</h4>
            <h5 className="text-sm font-semibold tracking-wider text-secondary uppercase">
              Heading 5 · Metadata Label
            </h5>
            <h6 className="text-xs font-semibold tracking-widest text-muted uppercase">
              Heading 6 · Micro Eyebrow
            </h6>
            <hr className="my-4 border-line" />
            <p className="text-base font-medium leading-relaxed text-main">
              Lead paragraph (<code>&lt;p&gt;</code>): Engineered with Plus Jakarta Sans and JetBrains Mono for legible high-density administration panels.
            </p>
            <p className="text-sm leading-relaxed text-secondary">
              Standard body text with <strong>&lt;strong&gt; emphasis</strong>,{' '}
              <em>&lt;em&gt; italic stress</em>, H<sub>2</sub>O subscript (<code>&lt;sub&gt;</code>),
              and 2<sup>10</sup> superscript (<code>&lt;sup&gt;</code>).
            </p>
          </div>
        </article>

        {/* Inline Semantics & Blockquote */}
        <article className="col-span-12 space-y-5 rounded-2xl border border-line bg-surface p-6 lg:col-span-6">
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
              Inline Semantic Tags
            </h3>
            <div className="space-y-2.5 text-sm text-secondary">
              <p>
                Highlight important output with{' '}
                <mark className="rounded bg-warning/20 px-1.5 py-0.5 font-semibold text-main">
                  &lt;mark&gt; highlighted text
                </mark>
                .
              </p>
              <p>
                Keyboard shortcuts:{' '}
                <kbd className="rounded-md border border-line-strong border-b-2 bg-elevated px-1.5 py-0.5 font-mono text-xs font-semibold text-main">
                  ⌘
                </kbd>{' '}
                +{' '}
                <kbd className="rounded-md border border-line-strong border-b-2 bg-elevated px-1.5 py-0.5 font-mono text-xs font-semibold text-main">
                  K
                </kbd>{' '}
                or{' '}
                <kbd className="rounded-md border border-line-strong border-b-2 bg-elevated px-1.5 py-0.5 font-mono text-xs font-semibold text-main">
                  Tab
                </kbd>
              </p>
              <p>
                Inline code: <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-xs text-accent">grid-cols-12</code> and{' '}
                <samp className="rounded bg-subtle px-1.5 py-0.5 font-mono text-xs text-success">OK 200</samp> sample output.
              </p>
              <p>
                Revisions:{' '}
                <del className="text-muted line-through decoration-danger">$199.00</del>{' '}
                <ins className="font-semibold text-success no-underline">$99.00 active</ins> ·{' '}
                <small className="text-xs text-muted">&lt;small&gt; billing note</small>
              </p>
              <p>
                Abbreviation &amp; Time:{' '}
                <abbr
                  title="Web Content Accessibility Guidelines 2.2"
                  className="cursor-help underline decoration-accent decoration-dotted underline-offset-4"
                >
                  WCAG 2.2
                </abbr>{' '}
                verified at <time dateTime="2025-05-12T09:30">09:30 UTC</time> ·{' '}
                <q cite="https://w3.org" className="italic text-main">
                  Structure precedes style
                </q>
              </p>
            </div>
          </div>

          <blockquote
            cite="https://aether.admin/spec"
            className="rounded-xl border border-line-strong bg-elevated p-4 text-sm italic leading-relaxed text-main"
          >
            &ldquo;Snapshot, update, and let clean grid geometry carry complex administration workflows into effortless clarity.&rdquo;
            <cite className="mt-2 block text-xs font-semibold not-italic text-muted">
              &mdash; Aether Design Architecture Standards (&lt;blockquote&gt; + &lt;cite&gt;)
            </cite>
          </blockquote>
        </article>

        {/* Preformatted Code & Lists */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-6 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
              Preformatted Code (&lt;pre&gt; &lt;code&gt;)
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs font-semibold text-main hover:bg-subtle"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy snippet'}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-line bg-[#090a0d] p-4 font-mono text-xs leading-relaxed text-slate-200">
            <code>{SAMPLE_SNIPPET}</code>
          </pre>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted uppercase">Unordered (&lt;ul&gt;)</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-secondary">
                <li>Semantic landmarks</li>
                <li>Tabular numerals</li>
                <li>WCAG focus rings</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted uppercase">Ordered (&lt;ol&gt;)</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-secondary">
                <li>Authenticate session</li>
                <li>Select target cluster</li>
                <li>Deploy configuration</li>
              </ol>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted uppercase">Definition (&lt;dl&gt;)</h4>
              <dl className="space-y-1 text-sm">
                <dt className="font-semibold text-main">Grid Columns</dt>
                <dd className="text-xs text-muted">12 responsive tracks</dd>
                <dt className="font-semibold text-main">Theme Modes</dt>
                <dd className="text-xs text-muted">Dark, Light, OLED, Contrast</dd>
              </dl>
            </div>
          </div>
        </article>

        {/* Figure & Figcaption */}
        <article className="col-span-12 rounded-2xl border border-line bg-surface p-6 lg:col-span-5">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
            Media Figure (&lt;figure&gt; &amp; &lt;figcaption&gt;)
          </h3>
          <figure className="overflow-hidden rounded-xl border border-line bg-elevated">
            <svg
              viewBox="0 0 400 180"
              role="img"
              aria-label="Node mesh topology diagram"
              className="h-44 w-full bg-[#0c0d12]"
            >
              <defs>
                <linearGradient id="meshGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b7bff" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.5">
                <line x1="80" y1="90" x2="200" y2="45" />
                <line x1="80" y1="90" x2="200" y2="135" />
                <line x1="200" y1="45" x2="320" y2="90" />
                <line x1="200" y1="135" x2="320" y2="90" />
                <line x1="200" y1="45" x2="200" y2="135" />
              </g>
              <circle cx="80" cy="90" r="16" fill="url(#meshGrad)" />
              <circle cx="200" cy="45" r="14" fill="#10b981" />
              <circle cx="200" cy="135" r="14" fill="#f59e0b" />
              <circle cx="320" cy="90" r="16" fill="url(#meshGrad)" />
              <text x="80" y="124" textAnchor="middle" fill="#a1a1aa" fontSize="11">Ingress</text>
              <text x="200" y="22" textAnchor="middle" fill="#a1a1aa" fontSize="11">Router A</text>
              <text x="200" y="166" textAnchor="middle" fill="#a1a1aa" fontSize="11">Router B</text>
              <text x="320" y="124" textAnchor="middle" fill="#a1a1aa" fontSize="11">Edge</text>
            </svg>
            <figcaption className="border-t border-line px-4 py-2.5 text-xs text-muted">
              Figure 1.1 — Multi-region edge routing topology rendered as accessible inline SVG.
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
