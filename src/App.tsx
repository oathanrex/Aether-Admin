import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { CommandPalette } from './components/CommandPalette.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { WaveOverlay, type WaveHandle } from './components/WaveOverlay.tsx';
import { ControlsSection } from './components/sections/ControlsSection.tsx';
import { DataTablesSection } from './components/sections/DataTablesSection.tsx';
import { FormsSection } from './components/sections/FormsSection.tsx';
import { MediaCommerceSection } from './components/sections/MediaCommerceSection.tsx';
import { OverviewSection } from './components/sections/OverviewSection.tsx';
import { TypographySection } from './components/sections/TypographySection.tsx';
import {
  INITIAL_CART,
  INITIAL_CHAT,
  INITIAL_CLUSTERS,
  INITIAL_NOTIFICATIONS,
  type ChatMessage,
  type NotificationItem,
  type SectionId,
} from './data/dashboardData.ts';
import {
  formatThroughput,
  type CartItem,
  type CurrencyCode,
  type ThemeMode,
  type WorkspaceCluster,
} from './utils/dashboardLogic.ts';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [waveEnabled, setWaveEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [clusters, setClusters] = useState<WorkspaceCluster[]>(INITIAL_CLUSTERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [announcement, setAnnouncement] = useState('');
  const [inspectedCluster, setInspectedCluster] = useState<WorkspaceCluster | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const waveRef = useRef<WaveHandle | null>(null);

  const announce = useCallback((msg: string) => {
    setAnnouncement('');
    window.setTimeout(() => setAnnouncement(msg), 30);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, []);

  const handleThemeChange = (nextTheme: ThemeMode, clientX?: number, clientY?: number) => {
    setTheme(nextTheme);
    announce(`Theme changed to ${nextTheme}`);
    const x = clientX ?? window.innerWidth - 100;
    const y = clientY ?? 32;
    waveRef.current?.ripple(x, y, nextTheme === 'light' ? '#5b45ff' : '#8b7bff');
  };

  const handleOpenModal = (cluster: WorkspaceCluster | null = null) => {
    setInspectedCluster(cluster);
    dialogRef.current?.showModal();
  };

  const handleCloseModal = () => {
    dialogRef.current?.close();
  };

  const handleToggleClusterStatus = (id: string) => {
    setClusters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === 'paused' ? 'active' : 'paused';
        announce(`${c.name} is now ${nextStatus}`);
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleAddToCart = (incoming: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === incoming.id);
      if (existing) {
        return prev.map((i) =>
          i.id === incoming.id ? { ...i, quantity: i.quantity + incoming.quantity } : i
        );
      }
      return [...prev, incoming];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleSendMessage = (text: string) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages((prev) => [...prev, { id: `m-${Date.now()}`, sender: 'me', text, time }]);
    announce('Chat message sent');
  };

  const showSection = (id: SectionId) => activeSection === 'all' || activeSection === id;

  return (
    <div className="min-h-screen bg-app text-main transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-accent-contrast focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <WaveOverlay ref={waveRef} enabled={waveEnabled} />

      <div className="flex min-h-screen w-full">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            announce(`Navigated to ${sec}`);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          waveEnabled={waveEnabled}
          onToggleWave={() => setWaveEnabled((w) => !w)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            theme={theme}
            onThemeChange={handleThemeChange}
            notifications={notifications}
            onMarkAllRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
              announce('All notifications marked as read');
            }}
            cart={cart}
            currency={currency}
            onUpdateCartQty={handleUpdateCartQty}
            onClearCart={() => {
              setCart([]);
              announce('Cart cleared');
            }}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-[1440px] flex-1 space-y-10 px-4 py-6 focus:outline-none sm:px-6 lg:px-8"
          >
            {showSection('overview') && (
              <OverviewSection
                clusters={clusters}
                onNavigate={setActiveSection}
                onAnnounce={announce}
                onOpenModal={() => handleOpenModal(null)}
                isAllView={activeSection === 'all'}
              />
            )}

            {showSection('typography') && (
              <>
                {activeSection === 'all' && <hr className="border-line" />}
                <TypographySection onAnnounce={announce} />
              </>
            )}

            {showSection('forms') && (
              <>
                {activeSection === 'all' && <hr className="border-line" />}
                <FormsSection onAnnounce={announce} />
              </>
            )}

            {showSection('controls') && (
              <>
                {activeSection === 'all' && <hr className="border-line" />}
                <ControlsSection onAnnounce={announce} />
              </>
            )}

            {showSection('tables') && (
              <>
                {activeSection === 'all' && <hr className="border-line" />}
                <DataTablesSection
                  clusters={clusters}
                  globalSearch={searchQuery}
                  onToggleClusterStatus={handleToggleClusterStatus}
                  onInspectCluster={(cluster) => handleOpenModal(cluster)}
                  onOpenModal={() => handleOpenModal(null)}
                  onAnnounce={announce}
                />
              </>
            )}

            {showSection('commerce') && (
              <>
                {activeSection === 'all' && <hr className="border-line" />}
                <MediaCommerceSection
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  onAddToCart={handleAddToCart}
                  chatMessages={chatMessages}
                  onSendMessage={handleSendMessage}
                  onAnnounce={announce}
                />
              </>
            )}
          </main>

          <footer
            role="contentinfo"
            className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 border-t border-line px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <strong className="font-semibold text-main">Aether Admin</strong>
              <span>·</span>
              <span>Semantic HTML5 + Tailwind CSS v4 Dashboard Architecture</span>
            </div>
            <address className="not-italic">
              Support: <a href="mailto:ops@aether.dev" className="text-accent hover:underline">ops@aether.dev</a> ·{' '}
              <span>San Francisco, CA</span>
            </address>
          </footer>
        </div>
      </div>

      {/* Native HTML5 <dialog> Modal */}
      <dialog
        ref={dialogRef}
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        onClick={(e) => {
          if (e.target === dialogRef.current) handleCloseModal();
        }}
        className="aether-dialog m-auto w-[92vw] max-w-md rounded-2xl border border-line-strong bg-surface p-6 text-main shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-accent uppercase">
              Native HTML5 &lt;dialog&gt;
            </p>
            <h3 id="modal-title" className="mt-1 text-lg font-bold text-main">
              {inspectedCluster ? inspectedCluster.name : 'Accessible Administration Modal'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            aria-label="Close modal"
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevated text-secondary hover:bg-subtle hover:text-main"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div id="modal-desc" className="mt-3 space-y-2 text-sm leading-relaxed text-secondary">
          {inspectedCluster ? (
            <dl className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-elevated p-3 text-xs">
              <div>
                <dt className="text-muted">Region</dt>
                <dd className="font-mono font-semibold text-main">{inspectedCluster.region}</dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="font-semibold capitalize text-main">{inspectedCluster.status}</dd>
              </div>
              <div>
                <dt className="text-muted">Throughput</dt>
                <dd className="font-mono font-semibold tabular-nums text-main">
                  {formatThroughput(inspectedCluster.throughputRps)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Latency</dt>
                <dd className="font-mono font-semibold tabular-nums text-main">
                  {inspectedCluster.latencyMs} ms
                </dd>
              </div>
            </dl>
          ) : (
            <p>
              Rendered natively via <code>HTMLDialogElement.showModal()</code> with backdrop blur,
              automatic focus isolation, and <kbd className="rounded border border-line px-1 font-mono text-xs">Esc</kbd> dismissal.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCloseModal}
            className="h-9 rounded-xl border border-line bg-elevated px-4 text-xs font-semibold text-main hover:bg-subtle"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => {
              if (inspectedCluster) {
                handleToggleClusterStatus(inspectedCluster.id);
              }
              handleCloseModal();
            }}
            className="h-9 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-contrast hover:bg-accent-hover"
          >
            {inspectedCluster ? 'Toggle Status' : 'Confirm'}
          </button>
        </div>
      </dialog>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          announce(`Navigated to ${sec}`);
        }}
        theme={theme}
        onThemeChange={(nextTheme) => handleThemeChange(nextTheme, window.innerWidth / 2, 120)}
        waveEnabled={waveEnabled}
        onToggleWave={() => {
          setWaveEnabled((prev) => {
            const next = !prev;
            announce(`Fluid Ripple FX ${next ? 'enabled' : 'disabled'}`);
            return next;
          });
        }}
        onOpenModal={() => handleOpenModal(null)}
      />
    </div>
  );
}
