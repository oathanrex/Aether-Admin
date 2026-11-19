import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  Command,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  Trash2,
} from 'lucide-react';
import { NAV_ITEMS, type NotificationItem, type SectionId } from '../data/dashboardData.ts';
import {
  calculateCartTotalUsd,
  formatCurrency,
  type CartItem,
  type CurrencyCode,
  type ThemeMode,
} from '../utils/dashboardLogic.ts';

interface HeaderProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode, clientX?: number, clientY?: number) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  cart: CartItem[];
  currency: CurrencyCode;
  onUpdateCartQty: (id: string, delta: number) => void;
  onClearCart: () => void;
  onOpenCommandPalette: () => void;
}

export function Header({
  activeSection,
  onSelectSection,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  theme,
  onThemeChange,
  notifications,
  onMarkAllRead,
  cart,
  currency,
  onUpdateCartQty,
  onClearCart,
  onOpenCommandPalette,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const popoverRootRef = useRef<HTMLDivElement | null>(null);

  const activeItem = NAV_ITEMS.find((n) => n.id === activeSection) ?? NAV_ITEMS[0];
  const unreadCount = notifications.filter((n) => n.unread).length;
  const cartTotals = calculateCartTotalUsd(cart);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setCartOpen(false);
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (popoverRootRef.current && !popoverRootRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  return (
    <header
      role="banner"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md sm:px-6"
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-main hover:bg-subtle lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-sm">
            <li>
              <button
                type="button"
                onClick={() => onSelectSection('overview')}
                className="font-medium text-muted transition-colors hover:text-main"
              >
                Admin
              </button>
            </li>
            <li aria-hidden="true" className="text-muted">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="truncate font-semibold text-main" aria-current="page">
              {activeItem.label}
            </li>
          </ol>
        </nav>
      </div>

      <div className="hidden max-w-xs flex-1 md:block">
        <label htmlFor="global-search" className="sr-only">
          Filter clusters in data table
        </label>
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted" aria-hidden="true" />
          <input
            id="global-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter clusters..."
            className="h-10 w-full rounded-xl border border-line bg-input pr-3 pl-9 text-sm text-main placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div ref={popoverRootRef} className="relative flex shrink-0 items-center gap-2 whitespace-nowrap">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Open command palette (Cmd+K)"
          title="Open command palette (Cmd+K / Ctrl+K)"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-line bg-elevated px-2.5 text-xs font-semibold text-main transition-colors hover:bg-subtle sm:px-3"
        >
          <Command className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span className="hidden xl:inline">Commands</span>
          <kbd className="hidden rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] font-semibold text-muted sm:inline">
            ⌘K
          </kbd>
        </button>
        <label htmlFor="header-theme-select" className="sr-only">
          Select color theme
        </label>
        <select
          id="header-theme-select"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
          className="hidden h-10 rounded-xl border border-line bg-elevated px-3 text-xs font-semibold text-main focus:border-accent focus:outline-none sm:block"
        >
          <option value="dark">Obsidian Dark</option>
          <option value="light">Alabaster Light</option>
          <option value="oled">OLED Black</option>
          <option value="high-contrast">High Contrast</option>
        </select>

        <button
          type="button"
          onClick={(e) =>
            onThemeChange(theme === 'light' ? 'dark' : 'light', e.clientX, e.clientY)
          }
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-main transition-colors hover:bg-subtle"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setCartOpen(false);
            }}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-main transition-colors hover:bg-subtle"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid min-w-5 h-5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold tabular-nums text-accent-contrast">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              role="region"
              aria-label="Recent notifications"
              className="absolute right-0 mt-2 w-80 rounded-2xl border border-line-strong bg-surface p-3 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-main">Notifications</span>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              </div>
              <ul className="space-y-1.5">
                {notifications.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2.5 rounded-xl bg-elevated px-3 py-2 text-xs"
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        item.unread ? 'bg-accent' : 'bg-line-strong',
                      ].join(' ')}
                    />
                    <div className="min-w-0 flex-1 whitespace-normal">
                      <p className={item.unread ? 'font-semibold text-main' : 'text-secondary'}>
                        {item.title}
                      </p>
                      <time className="text-[11px] text-muted">{item.time}</time>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label={`Cart (${cartTotals.itemCount} items)`}
            aria-expanded={cartOpen}
            aria-haspopup="true"
            onClick={() => {
              setCartOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-main transition-colors hover:bg-subtle"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid min-w-5 h-5 place-items-center rounded-full bg-danger px-1 font-mono text-[10px] font-bold tabular-nums text-white">
                {cartTotals.itemCount}
              </span>
            )}
          </button>

          {cartOpen && (
            <div
              role="region"
              aria-label="Hardware provisioning cart"
              className="absolute right-0 mt-2 w-80 rounded-2xl border border-line-strong bg-surface p-3 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-main">Provisioning Cart</span>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </button>
                )}
              </div>
              {cart.length === 0 ? (
                <p className="rounded-xl bg-elevated p-4 text-center text-xs text-muted">
                  Cart is empty. Add items in the Commerce section.
                </p>
              ) : (
                <div className="space-y-2">
                  <ul className="space-y-1.5">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-2 rounded-xl bg-elevated px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-main">{item.name}</p>
                          <p className="font-mono tabular-nums text-muted">
                            {formatCurrency(item.unitPriceUsd, currency)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() => onUpdateCartQty(item.id, -1)}
                            className="grid h-6 w-6 place-items-center rounded-md border border-line bg-surface text-main hover:bg-subtle"
                          >
                            −
                          </button>
                          <output className="min-w-5 text-center font-mono font-semibold tabular-nums text-main">
                            {item.quantity}
                          </output>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() => onUpdateCartQty(item.id, 1)}
                            className="grid h-6 w-6 place-items-center rounded-md border border-line bg-surface text-main hover:bg-subtle"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-line pt-2 text-xs font-bold text-main">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">
                      {formatCurrency(cartTotals.subtotalUsd, currency)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
