# AI Recruitment Poster Generator

An interactive web app that lets recruitment teams configure their company settings once and then craft on-brand hiring posters for each campaign in seconds.

## Features

- **Company settings locker** – Enter footer details and logo placeholders one time; the app stores them locally so every new campaign starts with your branding.
- **Dynamic campaign builder** – Update urgent headlines, interview statuses, job listings, benefit callouts, and more for each recruitment drive.
- **Poster preview** – The right-hand panel always shows a poster that mirrors the shared sample layout, updating in real time as you edit.
- **Color combination generator** – Experiment with curated color palettes to refresh the entire theme with a single click.
- **Local persistence** – Company settings, campaign content, and the last used color palette are remembered via `localStorage`.

## Getting Started

No build step is required. Open `index.html` in any modern browser.

```bash
# from the repository root
cd recruitment-poster-generator
python -m http.server 8000
```

Then browse to <http://localhost:8000> to use the app with live reloads.

## Usage Tips

1. Fill out the **Company Settings** panel with your brand details. These values populate the poster footer and remain saved for future sessions.
2. Head to **Campaign Content** to add or remove roles, adjust call-to-actions, and tweak highlights for the current recruitment drive.
3. Tap **Generate Poster** to ensure the preview is current (the UI also updates automatically as you type).
4. Click **Generate Color Combination** to try out a new themed palette instantly.
5. Use the poster preview to review layout accuracy before exporting or screenshotting for your recruitment channels.

> Logos are saved only in your browser storage; clearing the site data resets them.
