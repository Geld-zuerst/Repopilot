'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Shield, Zap, Lock } from 'lucide-react'
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
    transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }
  }),
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

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
              OPEN-SOURCE AI • LOCAL-FIRST
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
            Your Codebase<br />Has a Story.{' '}
            <span
              className="gradient-text"
              style={{ display: 'inline-block' }}
            >
              Let&apos;s Uncover It.
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
            RepoPilot maps repositories, traces code relationships, and answers your
            developer questions with verifiable source citations — using a local AI
            model that never sends your code to the cloud.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}
          >
            <a
              href="#get-started"
              id="explore-repopilot-btn"
              className="btn btn-primary btn-lg"
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.45)' }}
            >
              Explore RepoPilot
              <ArrowRight size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              id="view-github-btn"
              className="btn btn-secondary btn-lg"
            >
              <Github size={18} />
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
              { icon: <Shield size={14} />, text: 'Open-source intelligence' },
              { icon: <Lock size={14} />, text: 'Your code stays yours' },
              { icon: <Zap size={14} />, text: 'No API key required' },
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
          {mounted && <RepoScene />}
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
