# Contributing to Aether Admin

Thank you for your interest in contributing to Aether Admin!

## Local Setup

1. Fork the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Quality Checks

Before opening a pull request, make sure all checks pass locally:

```bash
npm run lint
npm test
npm run build
```

## Coding Guidelines

- Write strict TypeScript with modular React functional components.
- Style components exclusively with Tailwind CSS utilities and CSS custom properties defined in `src/index.css`.
- Keep pure state, filtering, sorting, and formatting logic inside `src/utils/` with accompanying `node:test` coverage.
- Ensure semantic HTML5 landmarks, keyboard navigation, and accessible labels (`aria-label` / `<label>`) are preserved across all themes (`dark`, `light`, `oled`, `high-contrast`).
