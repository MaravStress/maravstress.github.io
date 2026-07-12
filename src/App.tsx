import { useEffect, useState } from 'react'
import Frontend from './Layer/Frontend'
import Backend from './Layer/Backend'

function App() {
  const [view, setView] = useState<'landing' | 'backend'>('landing')

  useEffect(() => {
    // Scroll to top on view change
    window.scrollTo(0, 0);
  }, [view]);

  if (view === 'backend') {
    return <Backend onBack={() => setView('landing')} />
  }

  return <Frontend onEnterBackend={() => setView('backend')} />
}

export default App
