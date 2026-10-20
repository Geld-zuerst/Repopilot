'use client'
import { motion } from 'framer-motion'
import { Brain, FileCheck, Shield, Bug, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: <Brain size={24} />,
    title: 'Codebase Intelligence',
    description: 'Understand the architecture of an unfamiliar repository in minutes. RepoPilot builds a navigable map of your modules, imports, and dependencies.',
    color: '#8B5CF6',
    bgColor: 'rgba(139,92,246,0.1)',
    illustration: <CodebaseIllustration />,
    tag: 'Architecture',
  },
  {
    icon: <FileCheck size={24} />,
    title: 'Evidence-Backed Answers',
    description: 'Every explanation points to the exact code that supports it. No hallucinations — only answers grounded in your actual source files.',
    color: '#22D3EE',
    bgColor: 'rgba(34,211,238,0.08)',
    illustration: <EvidenceIllustration />,
    tag: 'Accuracy',
  },
  {
    icon: <Shield size={24} />,
    title: 'Local-First AI',
    description: 'Investigate private code using a compatible local model. Your repository never leaves your machine — not even a single line.',
    color: '#34D399',
    bgColor: 'rgba(52,211,153,0.08)',
    illustration: <LocalIllustration />,
    tag: 'Privacy',
  },
  {
    icon: <Bug size={24} />,
    title: 'Smart Bug Investigation',
    description: 'Follow relevant functions and dependencies to investigate issues faster. Trace the path of a bug across modules with evidence at every step.',
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.08)',
    illustration: <BugIllustration />,
    tag: 'Debugging',
  },
]

function CodebaseIllustration() {
  const nodes = [
    { x: 80, y: 40, label: 'auth.py', color: '#8B5CF6' },
    { x: 20, y: 100, label: 'user.py', color: '#A78BFA' },
    { x: 140, y: 100, label: 'api.py', color: '#6366F1' },
    { x: 50, y: 155, label: 'db.py', color: '#818CF8' },
    { x: 110, y: 155, label: 'utils.py', color: '#C4B5FD' },
  ]
  const lines = [[0,1],[0,2],[1,3],[2,4],[1,4]]
  return (
    <svg width="100%" height="190" viewBox="0 0 160 190" fill="none">
      {lines.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(139,92,246,0.3)" strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 0 ? 18 : 13} fill={n.color} opacity={i === 0 ? 0.2 : 0.12} />
          <circle cx={n.x} cy={n.y} r={i === 0 ? 10 : 7} fill={n.color} opacity={0.8} />
          <text x={n.x} y={n.y + (i === 0 ? 26 : 22)} textAnchor="middle" fill="rgba(196,181,253,0.8)" fontSize={8} fontFamily="JetBrains Mono">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

function EvidenceIllustration() {
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{
        background: 'rgba(7,8,15,0.8)',
        border: '1px solid rgba(34,211,238,0.2)',
        borderRadius: 8,
        padding: '10px 12px',
        marginBottom: 8,
        fontFamily: 'JetBrains Mono',
        fontSize: '0.72rem',
      }}>
        <div style={{ color: '#67E8F9', marginBottom: 4 }}>def authenticate(token):</div>
        <div style={{ color: '#94A3B8', paddingLeft: 12 }}><span style={{ color: '#C084FC' }}>return</span> jwt.decode(token)</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 6, padding: '6px 10px' }}>
        <FileCheck size={11} color="#22D3EE" />
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#22D3EE' }}>src/auth.py:24–31</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.62rem', color: '#34D399' }}>✓ verified</span>
      </div>
    </div>
  )
}

function LocalIllustration() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
      <div style={{ position: 'relative' }}>
        {/* Shield rings */}
        {[60, 48, 36].map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: r * 2, height: r * 2,
            borderRadius: '50%',
            border: `1px solid rgba(52,211,153,${0.1 + i * 0.08})`,
            top: 80 - r, left: 80 - r,
          }} />
        ))}
        <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={40} color="#34D399" opacity={0.9} />
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#34D399', whiteSpace: 'nowrap' }}>
              LOCAL · PRIVATE · SAFE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BugIllustration() {
  const steps = ['app.py', 'routes.py', 'auth.py', 'db.py']
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {steps.map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === 2 ? '#F59E0B' : 'rgba(245,158,11,0.3)',
              boxShadow: i === 2 ? '0 0 8px #F59E0B' : 'none',
              flexShrink: 0,
            }} />
            <div style={{
              flex: 1, height: 28,
              background: i === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.05)',
              border: `1px solid rgba(245,158,11,${i === 2 ? 0.35 : 0.1})`,
              borderRadius: 6,
              display: 'flex', alignItems: 'center', padding: '0 8px',
            }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: i === 2 ? '#FCD34D' : '#78716C' }}>
                {step}
              </span>
              {i === 2 && (
                <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>← BUG</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Features() {
  return (
    <section id="features" style={{ padding: '96px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>02 — FEATURES</div>
          <h2 style={{ marginBottom: 16 }}>
            Intelligence Without<br />
            <span className="gradient-text">Compromise</span>
          </h2>
          <p style={{ maxWidth: 500, margin: '0 auto', fontSize: '1.125rem' }}>
            Every feature is designed to give you depth and precision — never vague summaries or hallucinated paths.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
        }}
          className="features-grid"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="card"
              style={{ padding: 32 }}
            >
              {/* Icon + tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 14,
                  background: feature.bgColor,
                  border: `1px solid ${feature.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: feature.color,
                }}>
                  {feature.icon}
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.68rem',
                  color: feature.color,
                  background: feature.bgColor,
                  border: `1px solid ${feature.color}33`,
                  borderRadius: 20,
                  padding: '3px 10px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}>
                  {feature.tag}
                </span>
              </div>

              {/* Illustration */}
              <div style={{
                background: 'rgba(7,8,15,0.5)',
                border: '1px solid rgba(99,102,241,0.12)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                minHeight: 120,
              }}>
                {feature.illustration}
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: 10, color: '#F1F5F9' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#64748B' }}>
                {feature.description}
              </p>

              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: feature.color, cursor: 'pointer' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Learn more</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
