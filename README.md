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

## удобный запуск / .exe

Сейчас приложение — это обычная статическая HTML‑страница. Для полноценного `.exe` (один файл, запуск в отдельном окне) нужен desktop‑обёртка:

- **Electron** — самый популярный вариант. Можно собрать Windows‑.exe через `electron-builder`.
- **Tauri** — более лёгкий вариант (Rust + WebView2).

Если хотите, я добавлю сборку под Windows (Electron или Tauri) и кнопку/скрипт `npm run build:win`, чтобы получать `.exe` одним действием.
