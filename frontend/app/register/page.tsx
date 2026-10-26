'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '../../components/layout/AppHeader'
import { useSession } from '../providers'

export default function RegisterPage() {
  const { signUp } = useSession()
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      await signUp(
        String(data.get('username')),
        String(data.get('email')),
        String(data.get('password')),
        String(data.get('password2')),
      )
      router.push('/projects')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <AppHeader />
      <main className="rp-auth-wrap">
        <section className="rp-card rp-auth-card">
          <p className="section-label">Get started</p>
          <h1>Create your account</h1>
          <p className="rp-page-description">Join developers sharing projects and learning together.</p>
          <form className="rp-form" onSubmit={submit}>
            <label>Username<input name="username" autoComplete="username" minLength={3} required /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
            <label>Confirm password<input name="password2" type="password" autoComplete="new-password" minLength={8} required /></label>
            {error && <p className="rp-error" role="alert">{error}</p>}
            <button className="rp-button rp-button-primary" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          </form>
          <p className="rp-form-foot">Already have an account? <Link href="/login">Sign in</Link></p>
        </section>
      </main>
    </>
  )
}
