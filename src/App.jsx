import { useEffect, useState } from 'react'
import { loadState, saveState } from './lib/storage.js'
import { useScrollParallax } from './lib/useScrollParallax.js'
import BottomNav from './components/BottomNav.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Dashboard from './tabs/Dashboard.jsx'
import Giornata from './tabs/Giornata.jsx'
import Misure from './tabs/Misure.jsx'
import Esporta from './tabs/Esporta.jsx'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [state, setState] = useState(() => loadState())
  useScrollParallax()

  useEffect(() => {
    saveState(state)
  }, [state])

  // Scroll to top on tab change so the entrance animation reads cleanly
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab])

  return (
    <ToastProvider>
      <div className="min-h-full text-cream font-sans pt-safe">
        {/* key=tab forces remount → re-runs `animate-tab-enter` */}
        <div key={tab} className="animate-tab-enter">
          {tab === 'dashboard' && <Dashboard state={state} onGoToGiornata={() => setTab('giornata')} />}
          {tab === 'giornata' && <Giornata state={state} setState={setState} />}
          {tab === 'misure' && <Misure state={state} setState={setState} />}
          {tab === 'esporta' && <Esporta state={state} setState={setState} />}
        </div>
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </ToastProvider>
  )
}
