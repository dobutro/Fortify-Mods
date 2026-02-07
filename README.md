# Fortify-Mods
Create Mods for Forts!

## How to run

This is a static frontend, so you can run it in two simple ways:

1) **Open directly**
   - Double‑click `index.html` (or open it from your browser).

2) **Serve locally (recommended)**
   - From the repo root, run:
     ```bash
     python -m http.server 8000 --directory .
     ```
   - Then open: `http://127.0.0.1:8000/index.html`

## Electron (.exe)

A packaged Windows `.exe` build is available via Electron.

1) Install dependencies:
   ```bash
   npm install
   ```

2) Start the desktop app locally:
   ```bash
   npm start
   ```

3) Build the Windows installer:
   ```bash
   npm run build:win
   ```

The installer will be generated in the `dist/` folder.
