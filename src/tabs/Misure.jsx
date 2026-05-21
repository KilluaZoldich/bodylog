import { useRef, useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { todayKey, formatItDate } from '../lib/dates.js'
import { Card, SectionTitle, NumberInput, PrimaryButton, GhostButton } from '../components/ui.jsx'
import { useToast } from '../components/Toast.jsx'

const FIELDS = [
  { key: 'weight_kg', label: 'Peso', suffix: 'kg', step: 0.1 },
  { key: 'chest_cm', label: 'Petto', suffix: 'cm', step: 0.5 },
  { key: 'biceps_cm', label: 'Bicipite (contratto)', suffix: 'cm', step: 0.5 },
  { key: 'waist_cm', label: 'Vita', suffix: 'cm', step: 0.5 },
  { key: 'thigh_cm', label: 'Coscia', suffix: 'cm', step: 0.5 },
]

const MAX_PHOTO_BYTES = 4 * 1024 * 1024

export default function Misure({ state, setState }) {
  const { show } = useToast()
  const [form, setForm] = useState(() => ({
    date: todayKey(),
    weight_kg: null,
    chest_cm: null,
    biceps_cm: null,
    waist_cm: null,
    thigh_cm: null,
  }))
  const fileRef = useRef(null)

  function save() {
    const hasAny = FIELDS.some((f) => form[f.key] != null)
    if (!hasAny) {
      show('Inserisci almeno una misura', { kind: 'warn' })
      return
    }
    setState((prev) => ({
      ...prev,
      measurements: [...prev.measurements, { id: Date.now(), ...form }].sort((a, b) => b.date.localeCompare(a.date)),
    }))
    setForm({ date: todayKey(), weight_kg: null, chest_cm: null, biceps_cm: null, waist_cm: null, thigh_cm: null })
    show('Misure salvate', { kind: 'success' })
  }

  function removeRow(id) {
    setState((prev) => ({ ...prev, measurements: prev.measurements.filter((m) => m.id !== id) }))
  }

  function onPhotoSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_PHOTO_BYTES) {
      show(`Foto > 4MB (${(file.size / 1024 / 1024).toFixed(1)}MB). LocalStorage potrebbe riempirsi.`, { kind: 'warn', duration: 4000 })
    }
    const reader = new FileReader()
    reader.onload = () => {
      setState((prev) => ({
        ...prev,
        photos: [
          { id: Date.now(), dateKey: todayKey(), dataUrl: reader.result, sizeBytes: file.size, note: '' },
          ...prev.photos,
        ],
      }))
      show('Foto aggiunta', { kind: 'success' })
    }
    reader.onerror = () => show('Errore lettura foto', { kind: 'error' })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function removePhoto(id) {
    setState((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.id !== id) }))
  }

  return (
    <div className="px-4 pt-4 pb-28 max-w-md mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-text">Misure</h1>
        <p className="text-sm text-muted mt-0.5">Aggiorna 1x al mese</p>
      </header>

      <Card>
        <label className="block text-xs uppercase tracking-wider text-muted mb-2">Data</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full min-h-[44px] rounded-xl bg-surface2 border border-border px-3 text-base text-text"
        />
        <div className="mt-3 space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">{f.label}</label>
              <NumberInput
                value={form[f.key]}
                onChange={(v) => setForm({ ...form, [f.key]: v })}
                step={String(f.step)}
                suffix={f.suffix}
                ariaLabel={f.label}
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={save}>Salva misure</PrimaryButton>
        </div>
      </Card>

      <SectionTitle>Foto progresso</SectionTitle>
      <Card>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPhotoSelected}
          className="hidden"
        />
        <GhostButton onClick={() => fileRef.current?.click()}>
          <span className="inline-flex items-center justify-center gap-2">
            <Camera size={18} /> Aggiungi foto progresso
          </span>
        </GhostButton>
        {state.photos.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {state.photos.map((p) => (
              <div key={p.id} className="relative">
                <img src={p.dataUrl} alt={`Progresso ${p.dateKey}`} className="w-full aspect-square object-cover rounded-xl border border-border" />
                <div className="absolute bottom-1 left-1 right-1 text-[10px] text-text bg-bg/70 rounded px-1 py-0.5 text-center">
                  {formatItDate(p.dateKey)}
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  aria-label="Elimina foto"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full bg-bg/80 border border-border flex items-center justify-center text-bad"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <SectionTitle>Storico misurazioni</SectionTitle>
      {state.measurements.length === 0 ? (
        <Card>
          <p className="text-sm text-muted text-center">Nessuna misurazione ancora.</p>
        </Card>
      ) : (
        <div className="rounded-2xl bg-surface border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-[11px] uppercase tracking-wider">
                <th className="px-3 py-2 text-left">Data</th>
                <th className="px-2 py-2 text-right">Peso</th>
                <th className="px-2 py-2 text-right">Petto</th>
                <th className="px-2 py-2 text-right">Bicipite</th>
                <th className="px-2 py-2 text-right">Vita</th>
                <th className="px-2 py-2 text-right">Coscia</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {state.measurements.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-3 py-2 text-text">{formatItDate(m.date)}</td>
                  <td className="px-2 py-2 text-right text-text">{m.weight_kg ?? '—'}</td>
                  <td className="px-2 py-2 text-right text-text">{m.chest_cm ?? '—'}</td>
                  <td className="px-2 py-2 text-right text-text">{m.biceps_cm ?? '—'}</td>
                  <td className="px-2 py-2 text-right text-text">{m.waist_cm ?? '—'}</td>
                  <td className="px-2 py-2 text-right text-text">{m.thigh_cm ?? '—'}</td>
                  <td className="px-2 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(m.id)}
                      aria-label="Elimina riga"
                      className="text-muted hover:text-bad"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
