import { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from '../components/Frontend/Hero'
import Reviews from '../components/Frontend/Reviews'
import Experience from '../components/Frontend/Experience'
import Features from '../components/Frontend/Features'
import Skills from '../components/Frontend/Skills'
import Contact from '../components/Frontend/Contact'
import FloatingNavbar from '../components/Frontend/FloatingNavbar'

interface FrontendProps {
  onEnterBackend: () => void;
}

export default function Frontend({ onEnterBackend }: FrontendProps) {
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

  return (
    <main className="w-full min-h-screen selection:bg-brand-primary/30 selection:text-brand-primary-light relative">
      <FloatingNavbar />
      <Hero />
      <Reviews />
      <Experience />
      <Features />
      <Skills />
      <Contact onEnterBackend={onEnterBackend} />
    </main>
  )
}
