'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '../../components/layout/AppHeader'
import { useSession } from '../providers'

export default function LoginPage() {
  const { signIn } = useSession()
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      await signIn(String(data.get('email')), String(data.get('password')))
      router.push('/projects')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <AppHeader />
      <main className="rp-auth-wrap">
        <section className="rp-card rp-auth-card">
          <p className="section-label">Welcome back</p>
          <h1>Sign in to RepoPilot</h1>
          <p className="rp-page-description">Pick up where you left off with your projects and community.</p>
          <form className="rp-form" onSubmit={submit}>
            <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
            {error && <p className="rp-error" role="alert">{error}</p>}
            <button className="rp-button rp-button-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
          <p className="rp-form-foot">New to RepoPilot? <Link href="/register">Create an account</Link></p>
        </section>
      </main>
    </>
  )
}
