import { useState } from 'react'
import { Copy, Download, FileText, Upload, AlertTriangle } from 'lucide-react'
import { buildWeeklyMarkdown, downloadJsonBackup } from '../lib/exporter.js'
import { Card, SectionTitle, PrimaryButton, GhostButton } from '../components/ui.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Esporta({ state, setState }) {
  const { show } = useToast()
  const [preview, setPreview] = useState('')

  async function copyWeekly() {
    const md = buildWeeklyMarkdown(state)
    setPreview(md)
    try {
      await navigator.clipboard.writeText(md)
      show('Report copiato negli appunti', { kind: 'success' })
    } catch {
      show('Clipboard non disponibile — usa il testo qui sotto', { kind: 'warn', duration: 3500 })
    }
  }

  function downloadAll() {
    downloadJsonBackup(state)
    show('Backup JSON scaricato', { kind: 'success' })
  }

  async function importBackup(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const incoming = parsed.state ?? parsed
      if (!incoming || typeof incoming !== 'object' || !('days' in incoming)) {
        throw new Error('Formato non valido')
      }
      if (!confirm('Sostituire TUTTI i dati locali con il backup importato?')) {
        e.target.value = ''
        return
      }
      setState(incoming)
      show('Backup importato', { kind: 'success' })
    } catch (err) {
      show('Import fallito: ' + err.message, { kind: 'error', duration: 4000 })
    }
    e.target.value = ''
  }

  return (
    <div className="px-4 pt-4 pb-28 max-w-md mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-text">Esporta</h1>
        <p className="text-sm text-muted mt-0.5">Condividi i dati con Claude per ottimizzare</p>
      </header>

      <Card>
        <div className="flex items-start gap-3">
          <FileText className="text-accent flex-shrink-0 mt-0.5" size={22} />
          <div>
            <h2 className="text-base font-semibold text-text">Report settimanale per Claude</h2>
            <p className="text-sm text-muted mt-1">
              Genera un Markdown pre-formattato con gli ultimi 7 giorni + profilo + richiesta di analisi.
              Lo copia automaticamente negli appunti.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={copyWeekly}>
            <span className="inline-flex items-center justify-center gap-2">
              <Copy size={18} /> Esporta ultima settimana per Claude
            </span>
          </PrimaryButton>
        </div>
      </Card>

      <div className="mt-3">
        <Card>
          <div className="flex items-start gap-3">
            <Download className="text-accent flex-shrink-0 mt-0.5" size={22} />
            <div>
              <h2 className="text-base font-semibold text-text">Backup JSON completo</h2>
              <p className="text-sm text-muted mt-1">
                Scarica tutto lo stato dell'app (giornate, misure, foto in base64) come file <code className="text-accent">.json</code>.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <GhostButton onClick={downloadAll}>
              <span className="inline-flex items-center justify-center gap-2">
                <Download size={18} /> Esporta tutto (JSON backup)
              </span>
            </GhostButton>
          </div>
        </Card>
      </div>

      <SectionTitle>Ripristino</SectionTitle>
      <Card>
        <div className="flex items-start gap-2 mb-3">
          <AlertTriangle className="text-warn flex-shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-muted">
            Importare un backup <strong>sovrascrive</strong> tutti i dati locali. Verrà chiesta conferma.
          </p>
        </div>
        <label className="block">
          <input type="file" accept="application/json" onChange={importBackup} className="hidden" />
          <span className="block w-full min-h-[48px] rounded-2xl bg-surface2 border border-border text-text font-medium text-center leading-[48px] cursor-pointer">
            <span className="inline-flex items-center justify-center gap-2">
              <Upload size={18} /> Importa backup JSON
            </span>
          </span>
        </label>
      </Card>

      {preview && (
        <>
          <SectionTitle>Anteprima report</SectionTitle>
          <Card>
            <pre className="whitespace-pre-wrap break-words text-[11px] text-muted leading-relaxed max-h-96 overflow-auto">
              {preview}
            </pre>
          </Card>
        </>
      )}
    </div>
  )
}
