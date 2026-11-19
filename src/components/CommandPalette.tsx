import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  Blocks,
  Check,
  Command,
  CornerDownLeft,
  FileCode2,
  FormInput,
  Layers,
  LayoutDashboard,
  Monitor,
  Moon,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Table2,
  Type,
  X,
} from 'lucide-react';
import { NAV_ITEMS, type SectionId } from '../data/dashboardData.ts';
import {
  filterCommands,
  wrapHighlightIndex,
  type CommandCategory,
  type CommandPaletteItem,
  type ThemeMode,
} from '../utils/dashboardLogic.ts';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  waveEnabled: boolean;
  onToggleWave: () => void;
  onOpenModal: () => void;
}

const SECTION_ICON: Record<SectionId, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  all: Layers,
  typography: Type,
  forms: FormInput,
  controls: SlidersHorizontal,
  tables: Table2,
  commerce: ShoppingBag,
};

const THEME_ITEMS: Array<{ id: ThemeMode; label: string; description: string; keywords: string[] }> = [
  {
    id: 'dark',
    label: 'Obsidian Dark Theme',
    description: 'Default low-glare obsidian workspace palette',
    keywords: ['dark', 'obsidian', 'night', 'mode', 'theme'],
  },
  {
    id: 'light',
    label: 'Alabaster Light Theme',
    description: 'High-clarity daylight alabaster workspace palette',
    keywords: ['light', 'day', 'alabaster', 'white', 'mode', 'theme'],
  },
  {
    id: 'oled',
    label: 'OLED Black Theme',
    description: 'True #000000 pure black with cyan accents',
    keywords: ['oled', 'black', 'pure', 'cyan', 'mode', 'theme'],
  },
  {
    id: 'high-contrast',
    label: 'High Contrast Theme',
    description: 'WCAG AAA maximum contrast with safety yellow focus',
    keywords: ['contrast', 'accessibility', 'aaa', 'yellow', 'wcag', 'theme'],
  },
];

export function CommandPalette({
  open,
  onClose,
  activeSection,
  onSelectSection,
  theme,
  onThemeChange,
  waveEnabled,
  onToggleWave,
  onOpenModal,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const allCommands = useMemo<CommandPaletteItem[]>(() => {
    const navCommands: CommandPaletteItem[] = NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      category: 'Navigation',
      label: item.label,
      description: `Switch view to ${item.label}`,
      keywords: [item.id, item.shortLabel, 'section', 'navigate', 'go'],
      actionType: 'section',
      payload: item.id,
    }));

    const themeCommands: CommandPaletteItem[] = [
      {
        id: 'theme-toggle-light-dark',
        category: 'Theme',
        label: theme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode',
        description: `Quickly flip between Light and Dark theme (currently ${theme})`,
        keywords: ['toggle', 'switch', 'theme', 'dark', 'light', 'mode'],
        actionType: 'toggle-light-dark',
      },
      ...THEME_ITEMS.map((t) => ({
        id: `theme-${t.id}`,
        category: 'Theme' as const,
        label: t.label,
        description: t.description,
        keywords: t.keywords,
        actionType: 'theme' as const,
        payload: t.id,
      })),
    ];

    const actionCommands: CommandPaletteItem[] = [
      {
        id: 'action-wave',
        category: 'Actions',
        label: waveEnabled ? 'Disable Fluid Ripple FX' : 'Enable Fluid Ripple FX',
        description: 'Toggle Canvas wave ripple feedback on theme & UI triggers',
        keywords: ['wave', 'ripple', 'motion', 'animation', 'fx'],
        actionType: 'toggle-wave',
      },
      {
        id: 'action-dialog',
        category: 'Actions',
        label: 'Open Native <dialog> Modal',
        description: 'Inspect HTML5 showModal() focus-trapped dialog',
        keywords: ['dialog', 'modal', 'popup', 'inspect'],
        actionType: 'open-modal',
      },
    ];

    return [...navCommands, ...themeCommands, ...actionCommands];
  }, [theme, waveEnabled]);

  const filtered = useMemo(() => filterCommands(allCommands, query), [allCommands, query]);

  const grouped = useMemo(() => {
    const defaultOrder: CommandCategory[] = ['Navigation', 'Theme', 'Actions'];
    const trimmed = query.trim();
    const order = trimmed
      ? Array.from(new Set(filtered.map((item) => item.category)))
      : defaultOrder;
    return order
      .map((cat) => ({
        category: cat,
        items: filtered.filter((i) => i.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, query]);

  const orderedCommands = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlightIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setHighlightIndex((prev) => {
      if (orderedCommands.length === 0) return -1;
      if (prev < 0 || prev >= orderedCommands.length) return 0;
      return prev;
    });
  }, [orderedCommands.length]);

  useEffect(() => {
    if (!open || highlightIndex < 0) return;
    const activeEl = listRef.current?.querySelector<HTMLElement>(`[data-cmd-index="${highlightIndex}"]`);
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex, open]);

  if (!open) return null;

  const executeCommand = (cmd: CommandPaletteItem) => {
    switch (cmd.actionType) {
      case 'section':
        if (cmd.payload) onSelectSection(cmd.payload as SectionId);
        break;
      case 'theme':
        if (cmd.payload) onThemeChange(cmd.payload as ThemeMode);
        break;
      case 'toggle-light-dark':
        onThemeChange(theme === 'light' ? 'dark' : 'light');
        break;
      case 'toggle-wave':
        onToggleWave();
        break;
      case 'open-modal':
        onClose();
        onOpenModal();
        return;
    }
    onClose();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((idx) => wrapHighlightIndex(idx, 1, orderedCommands.length));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((idx) => wrapHighlightIndex(idx, -1, orderedCommands.length));
      return;
    }
    if (e.key === 'Enter' && highlightIndex >= 0 && orderedCommands[highlightIndex]) {
      e.preventDefault();
      executeCommand(orderedCommands[highlightIndex]);
    }
  };

  const renderIcon = (cmd: CommandPaletteItem) => {
    if (cmd.actionType === 'section' && cmd.payload) {
      const Icon = SECTION_ICON[cmd.payload as SectionId] ?? Blocks;
      return <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (cmd.actionType === 'toggle-light-dark') {
      return theme === 'light' ? (
        <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
      );
    }
    if (cmd.actionType === 'theme') {
      if (cmd.payload === 'light') return <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />;
      if (cmd.payload === 'dark') return <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />;
      return <Monitor className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (cmd.actionType === 'toggle-wave') {
      return <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    return <FileCode2 className="h-4 w-4 shrink-0" aria-hidden="true" />;
  };

  const isCurrentItem = (cmd: CommandPaletteItem) => {
    if (cmd.actionType === 'section') return cmd.payload === activeSection;
    if (cmd.actionType === 'theme') return cmd.payload === theme;
    return false;
  };

  let flatCounter = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global command palette"
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-4 pt-[12vh] backdrop-blur-xs"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <label htmlFor="command-palette-input" className="sr-only">
            Search sections, themes, and commands
          </label>
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-activedescendant={
              highlightIndex >= 0 && orderedCommands[highlightIndex]
                ? `cmd-opt-${orderedCommands[highlightIndex].id}`
                : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightIndex(0);
            }}
            placeholder="Switch section, change theme, or run action..."
            className="h-8 flex-1 bg-transparent text-sm text-main placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear command query"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-subtle hover:text-main"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-elevated text-muted hover:bg-subtle hover:text-main"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scrollable Command List */}
        <div
          ref={listRef}
          id="command-palette-listbox"
          role="listbox"
          aria-label="Available commands"
          className="max-h-[55vh] overflow-y-auto p-2"
        >
          {grouped.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold text-main">
                No commands matching &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted">
                Try searching for a section (Overview, Forms, Tables) or theme (Dark, Light, OLED).
              </p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} className="mb-2 last:mb-0">
                <p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase">
                  {group.category}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((cmd) => {
                    flatCounter += 1;
                    const idx = flatCounter;
                    const isHighlighted = idx === highlightIndex;
                    const isCurrent = isCurrentItem(cmd);
                    return (
                      <button
                        key={cmd.id}
                        id={`cmd-opt-${cmd.id}`}
                        data-cmd-index={idx}
                        type="button"
                        role="option"
                        aria-selected={isHighlighted}
                        onMouseEnter={() => setHighlightIndex(idx)}
                        onClick={() => executeCommand(cmd)}
                        className={[
                          'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                          isHighlighted
                            ? 'bg-accent/15 text-main'
                            : 'text-secondary hover:bg-elevated hover:text-main',
                        ].join(' ')}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={[
                              'grid h-8 w-8 shrink-0 place-items-center rounded-lg border',
                              isHighlighted
                                ? 'border-accent/40 bg-accent text-accent-contrast'
                                : 'border-line bg-elevated text-secondary',
                            ].join(' ')}
                          >
                            {renderIcon(cmd)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-main">{cmd.label}</p>
                            <p className="truncate text-xs text-muted">{cmd.description}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                              <Check className="h-3 w-3" aria-hidden="true" />
                              Active
                            </span>
                          )}
                          {isHighlighted && (
                            <kbd className="inline-flex items-center rounded-md border border-line bg-elevated px-1.5 py-0.5 font-mono text-[11px] font-semibold text-muted">
                              <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
                            </kbd>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-elevated px-4 py-2.5 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Command className="h-3 w-3 text-accent" aria-hidden="true" />
            <span>Global Command Palette</span>
          </span>
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-mono text-[10px] text-main">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-mono text-[10px] text-main">
                ↵
              </kbd>{' '}
              Select
            </span>
            <span>
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-mono text-[10px] text-main">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
