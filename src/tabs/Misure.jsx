import { useRef, useState } from 'react'
import { Camera, Trash2, Ruler, Images } from 'lucide-react'
import { todayKey, formatItDate } from '../lib/dates.js'
import { Card, SectionTitle, NumberInput, PrimaryButton, GhostButton } from '../components/ui.jsx'
import { useToast } from '../components/Toast.jsx'
import Masthead from '../components/Masthead.jsx'
import SignatureMark from '../components/SignatureMark.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { success as hapticSuccess } from '../lib/haptics.js'

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
    hapticSuccess()
    show('Misure salvate', { kind: 'success' })
  }

  function removeRow(id) {
    setState((prev) => ({ ...prev, measurements: prev.measurements.filter((m) => m.id !== id) }))
  }

  function onPhotoSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_PHOTO_BYTES) {
      show(`Foto > 4MB (${(file.size / 1024 / 1024).toFixed(1)}MB) — quota a rischio`, { kind: 'warn', duration: 4000 })
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
    <div className="px-5 pt-5 pb-nav max-w-md mx-auto">
      <Masthead section="Misure" phase="Tracking" state={state} />

      <Card>
        <label className="label-editorial block mb-2">Data</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full min-h-[48px] rounded-glass-sm glass-clear px-4 text-base text-cream"
        />
        <div className="mt-4 space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="label-editorial block mb-1.5">{f.label}</label>
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
        <div className="mt-5">
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
            <Camera size={16} strokeWidth={1.8} /> Aggiungi foto progresso
          </span>
        </GhostButton>
        {state.photos.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {state.photos.map((p) => (
              <div key={p.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-glass-sm border border-white/10">
                  <img src={p.dataUrl} alt={`Progresso ${p.dateKey}`} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-cream glass-prominent rounded-full px-2 py-0.5 text-center tracking-wider">
                  {formatItDate(p.dateKey)}
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  aria-label="Elimina foto"
                  className="press absolute top-1.5 right-1.5 h-7 w-7 rounded-full glass-prominent flex items-center justify-center text-bad"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-faint text-center mt-3 tracking-wider uppercase">
            Nessuna foto · scatta in luce naturale, stesso angolo
          </p>
        )}
      </Card>

      <SectionTitle>Storico misurazioni</SectionTitle>
      {state.measurements.length === 0 ? (
        <EmptyState
          icon={Ruler}
          title="Archivio vuoto"
          hint="Le misurazioni mensili appariranno qui in ordine inverso."
        />
      ) : (
        <div className="glass-regular rounded-glass-lg overflow-x-auto">
          <table className="w-full text-[13px] tabular-nums">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left label-editorial !text-[9px]">Data</th>
                <th className="px-2 py-3 text-right label-editorial !text-[9px]">Peso</th>
                <th className="px-2 py-3 text-right label-editorial !text-[9px]">Petto</th>
                <th className="px-2 py-3 text-right label-editorial !text-[9px]">Bic</th>
                <th className="px-2 py-3 text-right label-editorial !text-[9px]">Vita</th>
                <th className="px-2 py-3 text-right label-editorial !text-[9px]">Cos</th>
                <th className="px-2 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {state.measurements.map((m) => (
                <tr key={m.id} className="border-t border-white/[0.05]">
                  <td className="px-4 py-3 text-cream font-medium">{formatItDate(m.date)}</td>
                  <td className="px-2 py-3 text-right text-cream">{m.weight_kg ?? '—'}</td>
                  <td className="px-2 py-3 text-right text-cream">{m.chest_cm ?? '—'}</td>
                  <td className="px-2 py-3 text-right text-cream">{m.biceps_cm ?? '—'}</td>
                  <td className="px-2 py-3 text-right text-cream">{m.waist_cm ?? '—'}</td>
                  <td className="px-2 py-3 text-right text-cream">{m.thigh_cm ?? '—'}</td>
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(m.id)}
                      aria-label="Elimina riga"
                      className="press text-faint hover:text-bad p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SignatureMark />
    </div>
  )
}
