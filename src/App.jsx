import { useEffect, useState } from 'react'
import { loadState, saveState } from './lib/storage.js'
import BottomNav from './components/BottomNav.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Dashboard from './tabs/Dashboard.jsx'
import Giornata from './tabs/Giornata.jsx'
import Misure from './tabs/Misure.jsx'
import Esporta from './tabs/Esporta.jsx'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [state, setState] = useState(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <ToastProvider>
      <div className="min-h-full bg-bg text-text font-sans pt-safe">
        {tab === 'dashboard' && <Dashboard state={state} onGoToGiornata={() => setTab('giornata')} />}
        {tab === 'giornata' && <Giornata state={state} setState={setState} />}
        {tab === 'misure' && <Misure state={state} setState={setState} />}
        {tab === 'esporta' && <Esporta state={state} setState={setState} />}
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </ToastProvider>
  )
}
