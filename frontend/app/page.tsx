import HeroSection from '../components/hero/HeroSection'
import Navbar from '../components/layout/Navbar'
import CodeExplorer from '../components/sections/CodeExplorer'
import Features from '../components/sections/Features'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CodeExplorer />
        <Features />
        <section id="get-started" className="rp-home-cta">
          <p className="section-label">Start exploring</p>
          <h2>One repo link.<br /><span className="gradient-text">The whole picture.</span></h2>
          <p>Understand the project structure, packages, documentation, and activity before you clone or contribute.</p>
          <div className="rp-inline-actions">
            <Link className="rp-button rp-button-primary" href="/analyze">Analyze a repository</Link>
            <Link className="rp-button rp-button-secondary" href="/projects">Browse shared projects</Link>
          </div>
        </section>
      </main>
      <footer className="rp-footer">
        <span>RepoPilot · Open-source developer community</span>
        <div><Link href="/projects">Projects</Link><Link href="/community">Community</Link><Link href="/users">Developers</Link><a href="https://github.com/Geld-zuerst/Repopilot" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </footer>
    </>
  )
}
