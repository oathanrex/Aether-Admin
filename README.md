# Aether Admin

A modern, responsive administration dashboard and complete semantic HTML5 UI showcase built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

Designed around a clean 12-column Bento grid layout, Aether Admin pairs production-ready admin workflows—collapsible navigation, live cluster filtering, sortable data tables, shopping cart & currency switching, and a global `Cmd+K` command palette—with an interactive reference library covering 65+ native HTML5 elements.

---

## Features

- **Responsive Dashboard Shell**: Collapsible desktop sidebar, mobile slide-over drawer, sticky single-row header with breadcrumbs, notifications popover, and provisioning cart drawer.
- **Global Command Palette (`Cmd+K` / `Ctrl+K`)**: Searchable keyboard-first modal (`ArrowUp` / `ArrowDown` / `Enter` / `Escape`) to jump between dashboard sections, toggle theme modes, or trigger UI actions.
- **Multi-Theme System**: Switch seamlessly across four built-in themes synced to `data-theme` and Tailwind's `.dark` selector:
  - **Obsidian Dark** (default)
  - **Alabaster Light**
  - **OLED Black**
  - **High Contrast** (WCAG AAA focus & contrast)
- **Complete Semantic HTML5 Showcase (65+ Elements)**:
  - **Overview Grid**: KPI telemetry cards, live request throughput chart, deployment release pipeline (`<progress>`, `<meter>`), cluster summary table, and governance toggles.
  - **Typography & Prose**: Headings (`h1`–`h6`), `<blockquote cite>`, `<q>`, `<abbr>`, `<mark>`, `<kbd>`, `<samp>`, `<var>`, `<time>`, `<sub>`/`<sup>`, `<details>`/`<summary>`, and description lists (`<dl>`, `<dt>`, `<dd>`).
  - **Forms & Inputs**: `<fieldset>`, `<legend>`, text/email/password/URL/tel/date/time/color/range/number/file inputs, `<select>` with `<optgroup>`, `<datalist>` autocomplete, indeterminate parent checkboxes, accessible radio groups, and live validation.
  - **Controls & Widgets**: Multi-variant buttons, segmented controls, tabs, accordions, switches, inline alerts, skeleton loaders, toast notifications, and native `<dialog>` modals.
  - **Data, Tables & Modals**: Searchable, filterable, sortable, and paginated cluster management table with `showModal()` inspection.
  - **Commerce, Media & Chat**: Multi-currency (`USD`, `EUR`, `JPY`) product catalog with cart management, interactive `<canvas>` telemetry, SVG visuals, `<figure>`/`<figcaption>`, and live chat composer.
- **Fluid Ripple FX**: Optional Canvas ripple feedback on theme transitions and primary interactions, respecting `prefers-reduced-motion`.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Build Tool**: Vite 8
- **Icons**: Lucide React
- **Motion**: Motion (`motion/react`)
- **Testing**: Node.js built-in test runner (`node:test`) via `tsx`

---

## Project Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   ├── workflows/
│   │   └── ci.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── ControlsSection.tsx
│   │   │   ├── DataTablesSection.tsx
│   │   │   ├── FormsSection.tsx
│   │   │   ├── MediaCommerceSection.tsx
│   │   │   ├── OverviewSection.tsx
│   │   │   └── TypographySection.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── WaveOverlay.tsx
│   ├── data/
│   │   └── dashboardData.ts
│   ├── utils/
│   │   ├── dashboardLogic.ts
│   │   └── dashboardLogic.test.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20` (Node 22 recommended)
- **npm** `>= 10`

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### Development

Start the local development server on port `3000`:

```bash
npm run dev
```

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server (`http://localhost:3000`) |
| `npm run build` | Builds the production bundle into `dist/` |
| `npm run preview` | Previews the built `dist/` bundle locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm test` | Runs pure-logic unit tests (`src/utils/dashboardLogic.test.ts`) |
| `npm run clean` | Removes build output directories |

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Cmd + K` / `Ctrl + K` | Toggle the global Command Palette |
| `↑` / `↓` | Navigate results in the Command Palette |
| `Enter` | Execute the highlighted command |
| `Esc` | Dismiss Command Palette, popovers, or `<dialog>` modals |

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under the [MIT License](LICENSE).
