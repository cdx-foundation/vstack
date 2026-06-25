# FiveM SolidJS UI Architecture & Developer Guide

This project utilizes **Vite+** as the unified toolchain and **Bun** as the mandatory package manager and runtime environment. The UI layer is built exclusively with **SolidJS** and our custom **`cdx-solidjs-components`** design system.

Docs for the toolchain are available locally at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

---

## 🛠️ Toolchain & Commands

We use the global `vp` CLI wrapper for all development lifecycles. **Do not use npm, yarn, or pnpm.** Bun handles all dependency resolutions under the hood.

* **Install Dependencies:** `vp install` (Executes `bun install`)
* **Local Dev Server:** `vp dev` (Runs the UI in your browser with hot reloading)
* **Production Build:** `vp build` (Compiles optimized assets for the FiveM resource)
* **Lint & Format:** `vp check` (Runs Oxlint, Oxfmt, and TypeScript type checking)
* **Run Tests:** `vp test` (Executes unit testing via Vitest)

### Review Checklist
- [ ] Run `vp install` immediately after pulling remote changes to keep Bun lockfiles synchronized.
- [ ] Run `vp check` and `vp test` before opening a pull request to ensure zero linting or type errors.
- [ ] If package management or environment behaviors act up, run `vp env doctor` for an instant diagnostic report.

---

## 🎨 UI & Component Standards

### Custom Component Library (`cdx-solidjs-components`)
To maintain strict visual identity across our ecosystem, **always** leverage foundational elements from `cdx-solidjs-components`. Avoid writing raw HTML or custom Tailwind styles for components that already exist in the library.

```tsx
import { CdxPanel, CdxButton, CdxInput, CdxAlert } from 'cdx-solidjs-components';
import { createSignal } from 'solid-js';

export const CitizenSearch = () => {
  const [query, setQuery] = createSignal('');

  return (
    <CdxPanel title="MDT Navigation System" variant="sidebar">
      <CdxInput label="Search Citizen" onInput="{(e)" value="{query()}"> setQuery(e.currentTarget.value)} 
        placeholder="Enter name or CID..." 
      />
      <CdxButton intent="primary" onClick="{()"> console.log(query())}>
        Query Database
      </CdxButton>
    </CdxPanel>
  );
};
```