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
    <div className="px-5 pt-5 pb-nav max-w-md mx-auto">
      <header className="mb-6">
        <div className="label-editorial mb-1">Share</div>
        <h1 className="text-2xl font-display font-light text-cream">Esporta</h1>
        <p className="text-[13px] text-muted mt-1 tracking-wide">Condividi i dati con Claude per ottimizzare</p>
      </header>

      <Card>
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-glass-sm glass-inset flex items-center justify-center flex-shrink-0">
            <FileText className="text-accent" size={18} strokeWidth={1.6} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-cream tracking-wide">Report settimanale</h2>
            <p className="text-[12px] text-muted mt-1 leading-relaxed">
              Markdown formattato con profilo + ultimi 7 giorni + macro medi + richiesta di analisi. Copiato automaticamente in clipboard.
            </p>
          </div>
        </div>
        <PrimaryButton onClick={copyWeekly}>
          <span className="inline-flex items-center justify-center gap-2">
            <Copy size={16} strokeWidth={2} /> Esporta per Claude
          </span>
        </PrimaryButton>
      </Card>

      <div className="mt-3">
        <Card>
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-glass-sm glass-inset flex items-center justify-center flex-shrink-0">
              <Download className="text-accent" size={18} strokeWidth={1.6} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-cream tracking-wide">Backup JSON</h2>
              <p className="text-[12px] text-muted mt-1 leading-relaxed">
                Scarica tutto lo stato (giornate, misure, foto base64) come <code className="text-accent font-mono text-[11px]">.json</code>.
              </p>
            </div>
          </div>
          <GhostButton onClick={downloadAll}>
            <span className="inline-flex items-center justify-center gap-2">
              <Download size={16} strokeWidth={1.8} /> Scarica backup
            </span>
          </GhostButton>
        </Card>
      </div>

      <SectionTitle>Ripristino</SectionTitle>
      <Card>
        <div className="flex items-start gap-2.5 mb-4">
          <AlertTriangle className="text-warn flex-shrink-0 mt-0.5" size={14} strokeWidth={2} />
          <p className="text-[11px] text-muted leading-relaxed tracking-wide">
            Importare un backup <span className="text-cream font-semibold">sovrascrive</span> tutti i dati locali. Verrà chiesta conferma.
          </p>
        </div>
        <label className="block">
          <input type="file" accept="application/json" onChange={importBackup} className="hidden" />
          <span className="press block w-full min-h-[52px] rounded-glass glass text-cream font-medium text-[15px] tracking-wide text-center leading-[52px] cursor-pointer">
            <span className="inline-flex items-center justify-center gap-2">
              <Upload size={16} strokeWidth={1.8} /> Importa JSON
            </span>
          </span>
        </label>
      </Card>

      {preview && (
        <>
          <SectionTitle>Anteprima</SectionTitle>
          <Card className="!p-4">
            <pre className="whitespace-pre-wrap break-words text-[11px] text-muted leading-relaxed max-h-96 overflow-auto font-mono">
              {preview}
            </pre>
          </Card>
        </>
      )}
    </div>
  )
}
