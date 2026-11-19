import { useEffect } from 'react';
import {
  Blocks,
  FileCode2,
  FormInput,
  LayoutDashboard,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  SlidersHorizontal,
  Table2,
  Type,
  X,
} from 'lucide-react';
import { NAV_ITEMS, type SectionId } from '../data/dashboardData.ts';

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  waveEnabled: boolean;
  onToggleWave: () => void;
}

const ICON_MAP: Record<SectionId, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  all: Layers,
  typography: Type,
  forms: FormInput,
  controls: SlidersHorizontal,
  tables: Table2,
  commerce: ShoppingBag,
};

export function Sidebar({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  waveEnabled,
  onToggleWave,
}: SidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const handleSelect = (id: SectionId) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
          onClick={onCloseMobile}
        />
      )}

      <aside
        aria-label="Workspace sidebar"
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-surface transition-all duration-200 lg:sticky lg:top-0 lg:z-20 lg:h-screen',
          collapsed ? 'lg:w-[76px]' : 'lg:w-[260px]',
          mobileOpen ? 'w-[272px] translate-x-0 shadow-2xl' : 'w-[272px] -translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <button
            type="button"
            onClick={() => handleSelect('overview')}
            className="flex min-w-0 items-center gap-3 text-left focus-visible:rounded-lg"
            title="Aether Admin Home"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-contrast shadow-sm"
            >
              <Blocks className="h-5 w-5" />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold tracking-tight text-main">
                  Aether Admin
                </span>
                <span className="block truncate text-xs text-muted">Tailwind HTML5 Kit</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-secondary hover:bg-subtle hover:text-main lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden h-8 w-8 place-items-center rounded-lg border border-line text-secondary transition-colors hover:bg-subtle hover:text-main lg:grid"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted uppercase">
              Sections
            </p>
          )}
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.id];
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                    className={[
                      'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      collapsed ? 'justify-center px-0' : '',
                      isActive
                        ? 'bg-accent/15 text-accent font-semibold border border-accent/25'
                        : 'text-secondary hover:bg-subtle hover:text-main border border-transparent',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <>
                        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-md bg-subtle px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-main">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {!collapsed && (
            <div className="mt-6 rounded-xl border border-line bg-elevated p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-main">
                  <FileCode2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span>Fluid Ripple FX</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={waveEnabled}
                  aria-label="Toggle fluid ripple effect"
                  onClick={onToggleWave}
                  className={[
                    'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors',
                    waveEnabled ? 'border-accent bg-accent' : 'border-line-strong bg-subtle',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                      waveEnabled ? 'translate-x-4' : 'translate-x-0.5',
                    ].join(' ')}
                  />
                </button>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-muted">
                Subtle Canvas wave feedback on clicks; honors reduced motion.
              </p>
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
          <div
            className={[
              'flex items-center gap-3 rounded-xl border border-line bg-elevated p-2.5',
              collapsed ? 'justify-center p-2' : '',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-contrast"
            >
              EV
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-main">Elena Vance</p>
                <p className="truncate text-[11px] text-muted">Principal Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
