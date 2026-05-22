# BodyLog

Webapp mobile-first per tracciare lean bulk. Hostata su **GitHub Pages** (HTTPS,
gratis), accessibile da qualunque dispositivo. Zero backend, zero account: i
dati vivono in `localStorage` del browser su cui apri l'app.

🌐 **Live:** https://killuazoldich.github.io/bodylog/

## Stack

- Vite + React 19 + JavaScript
- Tailwind CSS v3 (utility classes)
- Recharts (grafico peso) · lucide-react (icone)
- Persistenza: `localStorage` (per-origine, per-browser)
- Deploy: GitHub Actions → GitHub Pages

## Uso quotidiano

Apri `https://killuazoldich.github.io/bodylog/` in Safari sull'iPhone, tap
"Condividi" → "Aggiungi a Home". L'icona finisce sulla home screen e si apre
come app a tutto schermo (safe-area + status bar nera traslucida).

**localStorage è per-browser:** se apri l'app in Safari iPhone, i dati restano
lì. Apri lo stesso URL in Chrome desktop e troverai un'app vuota. Per
spostare dati: tab **Esporta → backup JSON**, poi **Importa** sull'altro device.

## Sviluppo locale

```bash
cd ~/dev/bodylog
npm run dev      # localhost:5173
npm run dev:lan  # esposto in LAN per testare da iPhone via Wi-Fi
```

Per trovare l'IP del Mac in LAN: `ipconfig getifaddr en0`.

## Deploy

Ogni push su `main` triggera il workflow `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run build` (Vite genera `dist/` con `base: /bodylog/`)
3. Upload artefatto → `actions/deploy-pages` → live

Tempo medio: ~30–60 secondi. Vedere stato:

```bash
gh run list --limit 5
gh run watch        # follow the latest run
```

Trigger manuale senza push:

```bash
gh workflow run "Deploy to GitHub Pages"
```

## Backup

- **Tab Esporta → "Esporta tutto (JSON backup)"**: scarica `bodylog-backup-YYYY-MM-DD.json` con _tutti_ i dati (giornate, misure, foto in base64).
- **Ripristino**: tab Esporta, sezione "Ripristino", carica il `.json`. Sovrascrive lo stato locale (chiede conferma).
- Foto progresso in base64 → quota Safari ~5–10 MB. L'app ti avvisa oltre i 4 MB.
- **Fai backup periodici.** Se cancelli i dati del sito da Safari, tutto sparisce.

## Esporta per Claude

Tab **Esporta → "Esporta ultima settimana per Claude"** genera un Markdown
pre-formattato (profilo + 7 giorni + macro medi + richiesta di analisi) e lo
copia automaticamente negli appunti. Incollalo in una chat con Claude per
ricevere ottimizzazioni della dieta settimana per settimana.

> Nota: la clipboard API funziona solo in **contesti sicuri** (HTTPS o
> `localhost`). Su GitHub Pages è HTTPS quindi tutto ok. Su `http://192.168.x.x`
> Safari potrebbe bloccarla — in quel caso usa il testo dell'anteprima sotto.

## Struttura

```
src/
  App.jsx                 # shell + state-based tabs (no router)
  main.jsx                # entry
  index.css               # tailwind + base styles
  components/
    BottomNav.jsx         # navigazione iOS-style
    Toast.jsx             # notifiche non-bloccanti
    ui.jsx                # Card, NumberInput, Stepper, Toggle, ProgressBar, …
  tabs/
    Dashboard.jsx
    Giornata.jsx
    Misure.jsx
    Esporta.jsx
  lib/
    profile.js            # dati utente + target (hardcoded)
    dates.js
    storage.js
    aggregate.js
    exporter.js
.github/workflows/deploy.yml   # auto-deploy on push to main
```

## Workflow tipico

1. Modifica codice in locale (`npm run dev`)
2. `git add . && git commit -m "..." && git push`
3. GitHub Actions builda e deploya in ~1 min
4. Ricarica la PWA sull'iPhone (Safari → AA → ricarica senza cache, o chiudi e riapri)
