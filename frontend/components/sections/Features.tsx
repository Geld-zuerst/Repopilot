'use client'
import { motion } from 'framer-motion'
import { Code2, FileText, Package, Activity, ArrowRight, FileCheck } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: <Code2 size={24} />,
    title: 'Understand the codebase',
    description: 'See repository languages, default branch, directory structure, file counts, and a searchable tree of source files.',
    color: '#8B5CF6',
    bgColor: 'rgba(139,92,246,0.1)',
    illustration: <CodebaseIllustration />,
    tag: 'Structure',
  },
  {
    icon: <FileText size={24} />,
    title: 'Read project documentation',
    description: 'Keep the repository description and README close by, then open individual source files directly in the file browser.',
    color: '#22D3EE',
    bgColor: 'rgba(34,211,238,0.08)',
    illustration: <EvidenceIllustration />,
    tag: 'Documentation',
  },
  {
    icon: <Package size={24} />,
    title: 'Check dependencies',
    description: 'See declared packages from common npm, Python, Cargo, and Go manifests with their versions and source files.',
    color: '#34D399',
    bgColor: 'rgba(52,211,153,0.08)',
    illustration: <LocalIllustration />,
    tag: 'Packages',
  },
  {
    icon: <Activity size={24} />,
    title: 'Assess project activity',
    description: 'Review recent commits, contributors, published releases, repository size, stars, forks, and open issues.',
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.08)',
    illustration: <ActivityIllustration />,
    tag: 'Activity',
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
    <div style={{ display: 'grid', gap: 8, padding: '10px 0', fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
      {['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md'].map((file, index) => (
        <div key={file} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 7, background: 'rgba(7,8,15,0.65)', color: index === 0 ? '#67E8F9' : '#94A3B8' }}>
          <FileCheck size={13} color="#22D3EE" />{file}<span style={{ marginLeft: 'auto', color: '#64748B' }}>{index === 0 ? 'default branch' : 'when available'}</span>
        </div>
      ))}
    </div>
  )
}

function LocalIllustration() {
  return (
    <div style={{ display: 'grid', gap: 8, padding: '8px 0', fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
      {[
        ['package.json', 'npm'],
        ['requirements.txt', 'PyPI'],
        ['Cargo.toml', 'Cargo'],
      ].map(([file, ecosystem]) => (
        <div key={file} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', border: '1px solid rgba(52,211,153,0.16)', borderRadius: 7, background: 'rgba(7,8,15,0.65)' }}>
          <Package size={14} color="#34D399" /><span style={{ color: '#CBD5E1' }}>{file}</span><span style={{ marginLeft: 'auto', color: '#34D399' }}>{ecosystem}</span>
        </div>
      ))}
    </div>
  )
}

function ActivityIllustration() {
  const steps = ['Recent commits', 'Contributors', 'Releases']
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
                <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>← LATEST</span>
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
            Get the context<br />
            <span className="gradient-text">before you contribute.</span>
          </h2>
          <p style={{ maxWidth: 500, margin: '0 auto', fontSize: '1.125rem' }}>
            Quickly evaluate what a repository does, what it uses, how it’s organized, and how actively it’s maintained.
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

              <Link href="/analyze" style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: feature.color, textDecoration: 'none' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analyze a repository</span>
                <ArrowRight size={14} />
              </Link>
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
