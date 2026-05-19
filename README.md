<!-- README.md -->
# VStack

**The definitive high-performance boilerplate for FiveM NUI development.**

VStack is a production-ready, ultra-optimized starter template designed to bridge the gap between FiveM's Lua environment and the modern web. Built with **Solid.js**, **TypeScript**, and **Bun**, it provides a rock-solid foundation for creating premium user interfaces with zero unnecessary runtime overhead.

---

## Key Features

*   **Solid.js Core Engine:** Fine-grained reactivity that compiles down to clean, direct DOM operations. It ensures buttery-smooth 60fps UIs inside the FiveM Client.
*   **Tailwind CSS 4:** The latest in CSS-first utility design with lightning-fast `@tailwindcss/vite` integration, compiled static utilities, and zero runtime JavaScript footprint.
*   **Chromium NUI Simulator:** A high-fidelity development environment that downloads and launches a sandboxed Chromium v103 instance (exactly matching the native FiveM CEF version) via Puppeteer. Features console log piping and NUI state simulation.
*   **Production Pipeline:** Automated Vite-powered compiler that automatically strips away development-only mock assets (such as debug background images) and generates production-ready bundles.
*   **Automated Release Packaging:** Built-in release manager that handles clean-staging, asset compression, and automated ZIP packaging with Git revision hashes for both stable and pre-release builds.
*   **Elite Developer Tooling:** Integrated BiomeJS for near-instant formatting and linting, Vitest for rapid test runner cycles, TypeScript for strict type safety, and Knip for dead-code analysis.

---

## Quick Start

### Prerequisites

*   [Bun](https://bun.sh/) (Fast runtime and package manager)
*   [FiveM](https://fivem.net/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/five-stack-template.git
cd five-stack-template

# Install all workspace dependencies via Bun
bun install
```

### Development

Start the development pipeline with either a standard HMR server or the native Chromium simulator:

```bash
# Option A: Start the Vite dev server with hot module replacement (HMR)
bun run dev

# Option B: Run the premium Chromium NUI Simulator
bun run dev:chromium
```

---

## NUI Simulator

The Chromium NUI Simulator (`dev:chromium`) replicates the legacy FiveM CEF browser environment (v103) locally. This is highly recommended to test CSS/JS compatibility before loading assets inside the game client.

### Core Mechanisms

*   **Isolated CEF Emulation:** Boots a standalone Chromium instance running on local port `8337` with an isolated user profile.
*   **Console Logging Pipe:** Intercepts and formats all browser console output and errors directly into your system shell.
*   **Bootstrap Hydration Sequence:** Simulates native client event signals (such as `setVisible`) and hydrates your components dynamically on application mount.

---

## Project Scripts

All scripts are executed inside the `web` workspace directory or from the root workspace using your package runner.

| Command | Purpose |
| :--- | :--- |
| `bun run dev` | Starts the standard Vite development server on `localhost:5173`. |
| `bun run dev:chromium` | Starts the local dev server and launches the sandboxed Chromium CEF simulator. |
| `bun run build` | Compiles and optimizes assets into the production-ready `dist` folder. |
| `bun run release` | Builds and packages all files into a production ZIP archive ready for delivery. |
| `bun run prerelease` | Compiles and packages a pre-release version tagged with the current Git commit hash. |
| `bun run lint` | Runs BiomeJS for ultra-fast, correct static code checking. |
| `bun run fmt` | Formats all workspace files matching standard rules. |
| `bun run test` | Runs the test suites via Vitest. |
| `bun run typecheck` | Triggers a strict TypeScript compilation check to verify types. |
| `bun run knip` | Audits the codebase to find dead code, unused files, and redundant dependencies. |

---

## Project Structure

```text
.
├── client/          # Lua Client-side scripts
│   └── lua/         # Client-side core logic
├── server/          # Lua Server-side scripts
├── web/             # Solid.js Frontend (NUI Workspace)
│   ├── src/         # UI components, stores, and application logic
│   ├── public/      # Static web assets
│   └── scripts/     # Development, Chromium emulation, and release scripts
├── dist/            # Compiled static distribution (FiveM ready)
└── fxmanifest.lua   # FiveM Resource Manifest
```

---

## Production Deployment

To package the resource for your production server, execute:

```bash
bun run release
```

This will run the full compilation pipeline:
1. Bundles and compresses all frontend assets with Vite.
2. Creates a clean, temporary staging directory.
3. Obfuscates/filters development-only assets (e.g. `mock-bg.png`).
4. Generates a production ZIP file inside `temp/` containing your entire FiveM resource.

---

## License

This template is private and proprietary. Refer to `LICENSE.md` for full commercial usage terms.

---

Built for high-performance NUI applications.
