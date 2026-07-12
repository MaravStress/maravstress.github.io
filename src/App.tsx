import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero'
import Reviews from './components/Reviews'
import Experience from './components/Experience'
import Features from './components/Features'
import Skills from './components/Skills'
import Contact from './components/Contact'
import FloatingNavbar from './components/FloatingNavbar'
import BackendPanel from './components/BackendPanel'

function App() {
  const [view, setView] = useState<'landing' | 'backend'>('landing')

  useEffect(() => {
    // Scroll to top on view change
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  if (view === 'backend') {
    return <BackendPanel onBack={() => setView('landing')} />
  }

  return (
    <main className="w-full min-h-screen selection:bg-brand-primary/30 selection:text-brand-primary-light relative">
      <FloatingNavbar />
      <Hero />
      <Reviews />
      <Experience />
      <Features />
      <Skills />
      <Contact onEnterBackend={() => setView('backend')} />
    </main>
  )
}

export default App
