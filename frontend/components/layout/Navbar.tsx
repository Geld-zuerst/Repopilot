'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Compass, Code2, GitBranch } from 'lucide-react'

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Open Source', href: '#open-source' },
  { label: 'Community', href: '#community' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(7,8,15,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(99,102,241,0.12)'
            : '1px solid transparent',
        }}
      >
        <div className="container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
            {/* Logo */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(139,92,246,0.4)',
              }}>
                <Compass size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#F1F5F9',
                fontFamily: 'Inter, sans-serif',
              }}>
                Repo<span style={{ background: 'linear-gradient(90deg,#8B5CF6,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pilot</span>
              </span>
            </a>

            {/* Center Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'rgba(241,245,249,0.75)',
                    textDecoration: 'none',
                    borderRadius: 8,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                    e.currentTarget.style.color = '#F1F5F9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(241,245,249,0.75)'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
              <button
                aria-label="Search"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'rgba(241,245,249,0.6)',
                  fontSize: '0.875rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.18)'
                  e.currentTarget.style.color = 'rgba(241,245,249,0.9)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                  e.currentTarget.style.color = 'rgba(241,245,249,0.6)'
                }}
              >
                <Search size={14} />
                <span>⌘K</span>
              </button>

              <a
                href="#signin"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'rgba(241,245,249,0.75)',
                  textDecoration: 'none',
                  padding: '8px 12px',
                }}
              >
                Sign In
              </a>

              <a
                href="#get-started"
                className="btn btn-primary btn-sm"
                style={{ boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}
              >
                Get Started Free
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="hide-desktop"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                color: '#F1F5F9',
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'rgba(7,8,15,0.97)',
                backdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(99,102,241,0.15)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: '12px 16px',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'rgba(241,245,249,0.8)',
                      textDecoration: 'none',
                      borderRadius: 8,
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <div style={{ height: 1, background: 'rgba(99,102,241,0.15)', margin: '8px 0' }} />
                <a href="#signin" style={{ padding: '12px 16px', fontSize: '0.95rem', color: 'rgba(241,245,249,0.7)', textDecoration: 'none' }}>Sign In</a>
                <a href="#get-started" className="btn btn-primary" style={{ marginTop: 8, textAlign: 'center' }}>Get Started Free</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
