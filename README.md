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

## C# desktop build (.exe)

This project now includes a C# Windows desktop project (WinForms) targeting `net6.0-windows`.
It uses WebView2 to display the HTML UI, so the WebView2 runtime must be available on the system.

1) Restore dependencies:
   ```bash
   dotnet restore
   ```

2) Build the app:
   ```bash
   dotnet build
   ```

The executable will be available in `bin/Debug/net6.0-windows/` (or `bin/Release/net6.0-windows/`).
