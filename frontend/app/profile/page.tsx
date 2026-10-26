'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageShell from '../../components/layout/PageShell'
import { api, type User } from '../../lib/api'
import { useSession } from '../providers'

export default function ProfilePage() {
  const { user, loading, reloadUser } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      api<User>('/api/auth/profile/').then(setProfile).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load your profile.'))
    }
  }, [user])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const data = new FormData(event.currentTarget)
    try {
      const result = await api<{ user: User }>('/api/auth/profile/', {
        method: 'PATCH',
        body: JSON.stringify({
          bio: data.get('bio'),
          github_url: data.get('github_url'),
          website: data.get('website'),
          skills: String(data.get('skills')).split(',').map((skill) => skill.trim()).filter(Boolean),
        }),
      })
      setProfile(result.user)
      setMessage('Profile saved.')
      await reloadUser()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell title="Your profile" description="Update the information other developers see about you.">
      {!profile ? <p className="rp-muted">{loading ? 'Loading…' : 'Loading profile…'}</p> : (
        <form className="rp-card rp-form rp-profile-form" onSubmit={saveProfile}>
          <p className="rp-muted">Signed in as @{profile.username} · {profile.followers_count} followers</p>
          <label>Bio<textarea name="bio" rows={4} maxLength={500} defaultValue={profile.bio} /></label>
          <label>GitHub URL<input name="github_url" type="url" defaultValue={profile.github_url} /></label>
          <label>Website<input name="website" type="url" defaultValue={profile.website} /></label>
          <label>Skills <span className="rp-muted">(comma-separated)</span><input name="skills" defaultValue={profile.skills.join(', ')} /></label>
          {message && <p className="rp-success" role="status">{message}</p>}
          {error && <p className="rp-error" role="alert">{error}</p>}
          <button className="rp-button rp-button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
        </form>
      )}
    </PageShell>
  )
}
