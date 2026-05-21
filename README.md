# BodyLog

Webapp locale mobile-first per tracciare lean bulk. Gira sul tuo Mac, si apre
dall'iPhone in LAN, salva tutto in `localStorage`. Zero backend, zero account.

## Stack

- Vite + React 19 + JavaScript
- Tailwind CSS v3 (utility classes)
- Recharts (grafico peso) · lucide-react (icone)
- Persistenza: `localStorage` browser

## Avvio

```bash
cd ~/dev/bodylog
npm run dev:lan
```

Lo script `dev:lan` lancia Vite con `--host`, esponendolo su tutte le
interfacce di rete (porta `5173`).

## Aprire dall'iPhone

1. Mac e iPhone sulla **stessa rete Wi-Fi**.
2. Trova l'IP locale del Mac:

   ```bash
   ipconfig getifaddr en0          # Wi-Fi
   # oppure, se sei via Ethernet:
   ipconfig getifaddr en1
   ```

3. Sull'iPhone, in Safari, vai a:

   ```
   http://<IP_DEL_MAC>:5173
   ```

4. Per averla come icona su home screen: tap → "Condividi" → "Aggiungi a Home".
   La PWA usa status bar nera traslucida e safe-area su iPhone con notch.

## Comandi del mattino

Tre comandi per essere pronto in 10 secondi:

```bash
cd ~/dev/bodylog
npm run dev:lan
ipconfig getifaddr en0   # leggi l'IP, aprilo in Safari su iPhone
```

## Backup

- **Tab Esporta → "Esporta tutto (JSON backup)"**: scarica `bodylog-backup-YYYY-MM-DD.json` con _tutti_ i dati (giornate, misure, foto in base64).
- **Ripristino**: stessa tab, sezione "Ripristino", carica il `.json`. Sovrascrive lo stato locale (chiede conferma).
- I dati vivono in `localStorage` del browser. Se cancelli i dati del sito da Safari → i dati spariscono. **Fai backup periodici.**
- Foto progresso: salvate in base64 nel localStorage. Quota Safari ≈ 5–10 MB → l'app ti avvisa se una foto supera 4 MB.

## Esporta per Claude

**Tab Esporta → "Esporta ultima settimana per Claude"** genera un Markdown
pre-formattato (profilo + 7 giorni + macro medi + richiesta di analisi) e
lo copia automaticamente negli appunti. Incollalo in una chat con Claude per
ricevere suggerimenti sulla dieta della settimana successiva.

## Struttura

```
src/
  App.jsx                 # shell + state-based tabs
  main.jsx                # entry
  index.css               # tailwind + base styles
  components/
    BottomNav.jsx         # navigazione iOS-style
    Toast.jsx             # notifiche non-bloccanti
    ui.jsx                # Card, NumberInput, Stepper, Toggle, ProgressBar, …
  tabs/
    Dashboard.jsx         # peso + chart 30gg + 3 stat
    Giornata.jsx          # input principale (peso, pasti, allenamento, sonno, note)
    Misure.jsx            # misure mensili + foto progresso
    Esporta.jsx           # report markdown + JSON backup/restore
  lib/
    profile.js            # dati utente + target (hardcoded)
    dates.js              # date helpers (YYYY-MM-DD locale)
    storage.js            # localStorage CRUD + emptyDay
    aggregate.js          # weekly stats, currentWeight, delta band
    exporter.js           # buildWeeklyMarkdown + downloadJsonBackup
```

## Note sviluppo

- iPhone deve ricaricare con cache pulita dopo modifiche grosse: in Safari → "AA" → ricarica senza cache, oppure chiudi/riapri la PWA.
- HMR funziona anche sull'iPhone via LAN, ma se la connessione cade chiudi e riapri Safari.
- Se cambi rete o l'IP del Mac cambia, devi rigenerare l'URL con `ipconfig getifaddr en0`.
- **Niente sync**: lavora su un solo dispositivo alla volta. Per spostare i dati, usa il backup JSON.
