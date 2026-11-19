import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { Heart, Pause, Play, Send, ShoppingBag, Sparkles } from 'lucide-react';
import { CATALOG_PAGINATED_ITEMS, type ChatMessage } from '../../data/dashboardData.ts';
import {
  formatCurrency,
  paginateItems,
  type CurrencyCode,
} from '../../utils/dashboardLogic.ts';

interface MediaCommerceSectionProps {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onAddToCart: (item: { id: string; name: string; unitPriceUsd: number; quantity: number }) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onAnnounce: (msg: string) => void;
}

export function MediaCommerceSection({
  currency,
  onCurrencyChange,
  onAddToCart,
  chatMessages,
  onSendMessage,
  onAnnounce,
}: MediaCommerceSectionProps) {
  const [lampQty, setLampQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [playing, setPlaying] = useState(false);
  const [catalogPage, setCatalogPage] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveRingsRef = useRef<Array<{ x: number; y: number; r: number; alpha: number }>>([]);
  const rafRef = useRef<number | null>(null);

  const paginatedCatalog = paginateItems(CATALOG_PAGINATED_ITEMS, catalogPage, 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: typeof waveRingsRef.current = [];
      for (const ring of waveRingsRef.current) {
        ring.r += 3.5;
        ring.alpha *= 0.96;
        if (ring.alpha > 0.03) {
          next.push(ring);
          ctx.save();
          ctx.globalAlpha = ring.alpha;
          ctx.strokeStyle = '#8b7bff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
      waveRingsRef.current = next;
      if (next.length > 0) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        rafRef.current = null;
      }
    };

    if (waveRingsRef.current.length > 0 && rafRef.current === null) {
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  });

  const spawnCanvasWave = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    waveRingsRef.current.push({ x, y, r: 6, alpha: 0.9 });
    if (rafRef.current === null) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const step = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const next: typeof waveRingsRef.current = [];
        for (const ring of waveRingsRef.current) {
          ring.r += 3.5;
          ring.alpha *= 0.96;
          if (ring.alpha > 0.03) {
            next.push(ring);
            ctx.save();
            ctx.globalAlpha = ring.alpha;
            ctx.strokeStyle = '#8b7bff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
        waveRingsRef.current = next;
        if (next.length > 0) rafRef.current = requestAnimationFrame(step);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const handleAddLamp = () => {
    onAddToCart({ id: 'desk-lamp', name: 'Halo Studio Lamp', unitPriceUsd: 49, quantity: lampQty });
    setAddedFeedback(true);
    onAnnounce(`Added ${lampQty} Halo Studio Lamp to cart`);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setChatInput('');
  };

  return (
    <section aria-labelledby="commerce-heading" className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wider text-accent uppercase">
          Commerce, Media, Chat &amp; Interactive Canvas
        </p>
        <h2 id="commerce-heading" className="mt-1 text-2xl font-bold tracking-tight text-main">
          Product Cards, Multi-Currency, Audio, Chat &amp; &lt;canvas&gt;
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Product & Quantity & Wishlist */}
        <article className="col-span-12 flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 lg:col-span-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div
              aria-hidden="true"
              className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-amber-700/70 via-stone-900 to-zinc-950 sm:w-36"
            >
              <div className="absolute top-6 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-amber-200/80 blur-xs" />
              <button
                type="button"
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wished}
                onClick={() => setWished((w) => !w)}
                className={[
                  'absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full transition-colors',
                  wished ? 'bg-white text-rose-500' : 'bg-black/45 text-white hover:bg-black/65',
                ].join(' ')}
              >
                <Heart className={wished ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <span className="text-xs text-muted">Desk lamp · Walnut {wished ? '· Wishlisted' : ''}</span>
                <h3 className="text-lg font-bold text-main">Halo Studio Lamp</h3>
                <p className="mt-1 font-mono text-2xl font-extrabold tabular-nums text-main">
                  {formatCurrency(49, currency)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex h-10 items-center rounded-full border border-line-strong bg-elevated px-1">
                  <button
                    type="button"
                    aria-label="Decrease lamp quantity"
                    onClick={() => setLampQty((q) => Math.max(1, q - 1))}
                    className="grid h-8 w-8 place-items-center rounded-full text-secondary hover:bg-subtle hover:text-main"
                  >
                    −
                  </button>
                  <output className="min-w-7 text-center font-mono text-sm font-bold tabular-nums text-main">
                    {lampQty}
                  </output>
                  <button
                    type="button"
                    aria-label="Increase lamp quantity"
                    onClick={() => setLampQty((q) => Math.min(20, q + 1))}
                    className="grid h-8 w-8 place-items-center rounded-full text-secondary hover:bg-subtle hover:text-main"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddLamp}
                  className={[
                    'inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors',
                    addedFeedback
                      ? 'bg-success text-white'
                      : 'bg-accent text-accent-contrast hover:bg-accent-hover',
                  ].join(' ')}
                >
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{addedFeedback ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Multi-Currency List */}
          <div className="mt-5 border-t border-line pt-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase">Live Currency</span>
              <div role="group" aria-label="Currency selector" className="inline-flex rounded-lg border border-line bg-elevated p-0.5">
                {(['USD', 'EUR', 'JPY'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={currency === code}
                    onClick={() => onCurrencyChange(code)}
                    className={[
                      'rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition-colors',
                      currency === code ? 'bg-surface text-main shadow-xs' : 'text-muted hover:text-main',
                    ].join(' ')}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <ul className="divide-y divide-line rounded-xl border border-line bg-elevated px-3 text-xs">
              <li className="flex justify-between py-2">
                <span className="text-secondary">Dedicated Node Pack</span>
                <strong className="font-mono tabular-nums text-main">{formatCurrency(120, currency)}</strong>
              </li>
              <li className="flex justify-between py-2">
                <span className="text-secondary">Edge SSL Add-on</span>
                <strong className="font-mono tabular-nums text-main">{formatCurrency(18, currency)}</strong>
              </li>
            </ul>
          </div>
        </article>

        {/* Interactive Chat & Audio Player */}
        <article className="col-span-12 flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 lg:col-span-4">
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
              Operations Chat &amp; Audio Player
            </h3>

            <div className="space-y-2 rounded-xl border border-line bg-elevated p-3 max-h-48 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={[
                    'max-w-[85%] rounded-2xl px-3 py-2 text-xs',
                    msg.sender === 'me'
                      ? 'ml-auto rounded-br-xs bg-accent text-accent-contrast'
                      : 'mr-auto rounded-bl-xs border border-line bg-surface text-main',
                  ].join(' ')}
                >
                  <p>{msg.text}</p>
                  <time className="mt-0.5 block text-[10px] opacity-75">{msg.time}</time>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="mt-2.5 flex gap-2">
              <label htmlFor="chat-msg-input" className="sr-only">
                Send message
              </label>
              <input
                id="chat-msg-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Write a message..."
                className="h-9 flex-1 rounded-xl border border-line-strong bg-input px-3 text-xs text-main placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send chat message"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3 text-xs font-semibold text-accent-contrast hover:bg-accent-hover"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Send</span>
              </button>
            </form>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-elevated p-3">
            <div
              aria-hidden="true"
              className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-tr from-fuchsia-500 via-accent to-cyan-400"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-main">Night Drive · Synth</p>
              <p className="text-xs font-medium text-muted">
                {playing ? 'Playing · 01:24 / 03:45' : 'Paused · 00:00 / 03:45'}
              </p>
            </div>
            <button
              type="button"
              aria-label={playing ? 'Pause track' : 'Play track'}
              aria-pressed={playing}
              onClick={() => setPlaying((p) => !p)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-main text-inverse transition-opacity hover:opacity-90"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
            </button>
          </div>
        </article>

        {/* Interactive <canvas> & Paginated Component List */}
        <article className="col-span-12 flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 lg:col-span-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Interactive &lt;canvas&gt;
              </h3>
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            </div>
            <canvas
              ref={canvasRef}
              width={300}
              height={130}
              onClick={spawnCanvasWave}
              aria-label="Interactive ripple canvas. Click to draw wave rings."
              className="h-32 w-full cursor-crosshair rounded-xl border border-line bg-[#0b0c12]"
            />
            <p className="mt-1.5 text-[11px] text-muted">Click inside the canvas to emit wave rings.</p>
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary">Paginated List</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-current={catalogPage === p ? 'page' : undefined}
                    onClick={() => setCatalogPage(p)}
                    className={[
                      'grid h-6 w-6 place-items-center rounded-md font-mono text-[11px] font-bold',
                      catalogPage === p
                        ? 'bg-accent text-accent-contrast'
                        : 'border border-line bg-elevated text-muted hover:text-main',
                    ].join(' ')}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ul className="space-y-1.5">
              {paginatedCatalog.pageItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-elevated px-2.5 py-2 text-xs"
                >
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: item.color }}
                    className="h-5 w-5 shrink-0 rounded-md"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-main">{item.name}</p>
                    <p className="truncate text-[11px] text-muted">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
