# md-reader

A single self-contained HTML file — no installs, no build step, no internet required. Open `index.html` in a browser and it works.

## Features

- Open `.md` files via file picker or drag & drop
- Read / Edit / Split views with a resizable divider
- Auto-generated table of contents (click to jump)
- Text highlighting while reading (4 colors, click to recolor/remove)
- Dark mode
- Multiple tabs — rename inline with double-click
- Find in document (Ctrl+F)
- Auto-saved drafts (localStorage), so a refresh won't lose work
- Save back to the same file on disk (Chrome/Edge/Brave via the File System Access API), or downloads a copy on browsers without it
- Export as standalone HTML, or print to PDF
- Zen/focus mode, font family + size controls
- Keyboard shortcuts: `Ctrl+O` open, `Ctrl+S` save, `Ctrl+Shift+S` save as, `Ctrl+E` toggle edit, `Ctrl+F` find, `Esc` exits zen/find

## Usage

Just open `index.html` directly in a browser, or double-click the file.

For in-place saving (writing straight back to the opened file instead of downloading a copy), use Chrome, Edge, or Brave.
