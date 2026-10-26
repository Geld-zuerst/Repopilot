'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
import dynamic from 'next/dynamic'

const RepoScene = dynamic(() => import('./RepoScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 80, height: 80,
        borderRadius: '50%',
        border: '2px solid rgba(139,92,246,0.3)',
        borderTopColor: '#8B5CF6',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  ),
})

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] as const }
  }),
}

export default function HeroSection() {
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function analyzeRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = repositoryUrl.trim()
    if (!value) {
      setError('Paste a public GitHub repository URL to get started.')
      return
    }
    setError('')
    router.push(`/analyze?repo=${encodeURIComponent(value)}`)
  }

  return (
    <section
      id="product"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 68,
      }}
    >
      {/* Background grid */}
      <div className="grid-bg" style={{ opacity: 0.6 }} />

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '10%', left: '-10%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', right: '-5%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 40px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
        minHeight: 'calc(100vh - 68px)',
      }}
        className="hero-grid"
      >
        {/* LEFT — Content */}
        <div style={{ paddingTop: 40, paddingBottom: 40 }}>
          {/* Announcement badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 24 }}
          >
            <span className="badge badge-violet" style={{ padding: '6px 16px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A78BFA', display: 'inline-block', marginRight: 4 }} />
              PUBLIC GITHUB REPOSITORY ANALYZER
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 24, lineHeight: 1.1 }}
          >
            Understand any<br />repository.{' '}
            <span
              className="gradient-text"
              style={{ display: 'inline-block' }}
            >
              Before you dive in.
            </span>
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.75,
              color: 'rgba(148,163,184,0.9)',
              marginBottom: 36,
              maxWidth: 500,
            }}
          >
            Paste a GitHub link to explore the project details developers need:
            languages, source tree, README, dependencies, contributors, releases,
            and recent commits.
          </motion.p>

          <motion.form
            custom={0.27}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            onSubmit={analyzeRepository}
            className="repo-hero-form"
          >
            <div className="repo-hero-input">
              <GitHubIcon size={18} />
              <input
                aria-label="Public GitHub repository URL"
                type="text"
                inputMode="url"
                placeholder="https://github.com/owner/repository"
                value={repositoryUrl}
                onChange={(event) => setRepositoryUrl(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Analyze repository <ArrowRight size={18} />
            </button>
            {error && <span role="alert" className="rp-error">{error}</span>}
          </motion.form>
          <p className="rp-hero-hint">Public GitHub repositories · Read-only · No clone required</p>

          {/* CTAs */}
          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}
          >
            <Link
              href="#how-it-works"
              id="explore-repopilot-btn"
              className="btn btn-primary btn-lg"
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.45)' }}
            >
              See how it works
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/Geld-zuerst/Repopilot"
              target="_blank"
              rel="noopener noreferrer"
              id="view-github-btn"
              className="btn btn-secondary btn-lg"
            >
              <GitHubIcon size={18} />
              View on GitHub
            </a>
          </motion.div>

          {/* Trust statement */}
          <motion.div
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
          >
            {[
              { icon: <Shield size={14} />, text: 'Public repo data' },
              { icon: <Lock size={14} />, text: 'Read-only analysis' },
              { icon: <Zap size={14} />, text: 'No clone needed' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#22D3EE' }}>{icon}</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.8)', fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: 580,
            position: 'relative',
          }}
        >
          <RepoScene />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
