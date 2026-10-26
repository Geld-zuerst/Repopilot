'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Compass } from 'lucide-react'
import { useSession } from '../../app/providers'

export default function AppHeader() {
  const { user, loading, signOut } = useSession()
  const router = useRouter()

  return (
    <header className="rp-header">
      <Link href="/" className="rp-brand">
        <span className="rp-brand-mark"><Compass size={19} /></span>
        <span>Repo<span className="gradient-text">Pilot</span></span>
      </Link>
      <nav className="rp-nav" aria-label="Main navigation">
        <Link href="/analyze">Analyze a repo</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/community">Community</Link>
        <Link href="/users">Developers</Link>
      </nav>
      <div className="rp-header-actions">
        {loading ? <span className="rp-muted">Loading…</span> : user ? (
          <>
            <Link className="rp-user-link" href="/profile">@{user.username}</Link>
            <button className="rp-button rp-button-quiet" onClick={() => { signOut(); router.push('/') }}>Sign out</button>
          </>
        ) : (
          <>
            <Link className="rp-button rp-button-quiet" href="/login">Sign in</Link>
            <Link className="rp-button rp-button-primary" href="/register">Create account</Link>
          </>
        )}
      </div>
    </header>
  )
}
