import { useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { SettingsProvider } from './contexts/SettingsContext'
import SEOHead from './components/SEOHead'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function AppContent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SEOHead />
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    </>
  )
}

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </HelmetProvider>
  )
}

export default App

