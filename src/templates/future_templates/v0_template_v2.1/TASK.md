## 🔴 Critical Priority
- [ ] **[SECURITY]** Sanitize markdown rendering in `v0_template_1.3/components/ui/github-repo-view.tsx:788-801,838-849`; replace naive `renderMarkdown` + `dangerouslySetInnerHTML` with a well-maintained markdown parser (e.g. `marked`) and sanitize output using `DOMPurify`.
- [ ] **[SECURITY]** Validate & escape dynamic CSS values injected via `dangerouslySetInnerHTML` in `v0_template_v2.1/components/ui/chart.tsx:80-104`.
- [ ] **[SECURITY]** Enable CSP headers in `v0_template_v2.1/next.config.mjs:12-61` (currently commented) to mitigate inline-script attacks.
- [ ] **[SECURITY]** Audit external navigation & fetch calls in `v0_template_1.3/components/ui/github-repo-view.tsx`:
  - `window.open` → lines 775-783, 818-821
  - GitHub API `fetchRepo` → lines 177-220
  - Directory/file fetches → lines 257-269, 339-370

## 🟠 High Priority
- [ ] **[REFACTOR]** Split the monolithic component `v0_template_1.3/components/ui/github-repo-view.tsx:1-861` into smaller components (`RepoHeader`, `FileTree`, `FileViewer`, etc.).
- [ ] **[ARCHITECTURE]** Deduplicate shared hooks/components:
  - `hooks/use-mobile.tsx` → `v0_template_v2.1:1-20`, `v0_template_1.3:1-20`
  - `components/ui/chart.tsx` → duplicated logic `v0_template_v2.1:1-376`, `v0_template_1.3:1-366`
- [ ] **[PERFORMANCE]** Virtualise large directory listings rendered in `v0_template_1.3/components/ui/github-repo-view.tsx:585-610,724-750` using `react-window`.
- [ ] **[ARCHITECTURE]** Consolidate theme logic:
  - Keep `v0_template_v2.1/contexts/theme-context.tsx:1-75`
  - Remove duplicate `v0_template_1.3/contexts/theme-context.tsx:1-75` and update imports.
- [ ] **[TYPE-SAFETY]** Replace `any` types in key data-flow files:
  - `v0_template_v2.1/lib/cv-data-adapter.tsx:90-120,290-320`
  - `v0_template_v2.1/app/page.tsx:320-340`
  - `v0_template_v2.1/components/section-controls.tsx:10-40`

## 🟡 Medium Priority
- [ ] **[TESTING]** Add unit tests for:
  1. Markdown sanitisation (`github-repo-view.tsx`)
  2. Chart theming (`chart.tsx` lines above)
  3. Theme toggle persistence (`theme-context.tsx`)
- [ ] **[STYLE]** Standardise async error handling (wrap `fetch*` calls listed above) & surface errors via toaster.
- [ ] **[OPTIMISATION]** Replace external `<img>` with Next `<Image>` in `github-repo-view.tsx:789-794`.
- [ ] **[QA]** Add React Error Boundary to `v0_template_v2.1/app/layout.tsx` (wrap `children`).

## 🟢 Low Priority
- [ ] **[DOCS]** Document exported hooks (`use-mobile.tsx`, `use-toast.ts`) and UI primitives.
- [ ] **[CLEANUP]** Enable `noImplicitAny` + `strictNullChecks` in `v0_template_v2.1/tsconfig.json` and resolve resulting errors.
- [ ] **[LINT]** Extend ESLint rules (`react/no-danger`, `@typescript-eslint/explicit-module-boundary-types`).
