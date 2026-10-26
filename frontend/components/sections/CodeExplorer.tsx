'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, BookOpen, Boxes, Code2, GitFork, Package, Users } from 'lucide-react'

const insights = [
  { icon: <Code2 size={19} />, title: 'Languages & codebase', detail: 'Language breakdown, default branch, and a searchable file tree.' },
  { icon: <BookOpen size={19} />, title: 'Documentation', detail: 'Read the repository README alongside its source and project metadata.' },
  { icon: <Package size={19} />, title: 'Dependencies', detail: 'Inspect package manifests for npm, Python, Cargo, and Go dependencies.' },
  { icon: <Activity size={19} />, title: 'Project activity', detail: 'See recent commits, contributors, releases, stars, forks, and open issues.' },
]

export default function CodeExplorer() {
  return (
    <section id="how-it-works" className="repo-capabilities">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="repo-capabilities-heading"
      >
        <p className="section-label">Repository overview</p>
        <h2>Everything important,<br /><span className="gradient-text">in one place.</span></h2>
        <p>One public GitHub URL gives you a practical map of the project—without cloning it or clicking through dozens of GitHub tabs.</p>
      </motion.div>
      <div className="repo-capabilities-grid">
        {insights.map((insight, index) => (
          <motion.article
            key={insight.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className="rp-card repo-capability-card"
          >
            <span className="repo-capability-icon">{insight.icon}</span>
            <h3>{insight.title}</h3>
            <p>{insight.detail}</p>
          </motion.article>
        ))}
      </div>
      <div className="repo-capabilities-bottom">
        <span><GitFork size={16} /> Read-only. Your repository isn’t cloned or modified.</span>
        <span><Boxes size={16} /> Browse source files directly from GitHub.</span>
        <span><Users size={16} /> Public repository data, attributed to GitHub.</span>
      </div>
      <Link className="rp-button rp-button-primary" href="/analyze">Analyze a repository <Code2 size={16} /></Link>
    </section>
  )
}
