'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import PageShell from '../../../components/layout/PageShell'
import { api, type User } from '../../../lib/api'
import { useSession } from '../../providers'

function PublicProfileContent() {
  const { username } = useParams<{ username: string }>()
  const { user } = useSession()
  const [profile, setProfile] = useState<User | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<User>(`/api/auth/users/${encodeURIComponent(username)}/`)
      .then(setProfile)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load profile.'))
  }, [username])

  async function toggleFollow() {
    if (!profile) return
    try {
      const result = await api<{ action: string; followers_count: number }>(`/api/auth/users/${encodeURIComponent(profile.username)}/follow/`, { method: 'POST' })
      setProfile({ ...profile, is_following: result.action === 'followed', followers_count: result.followers_count })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update follow.')
    }
  }

  return (
    <PageShell title={profile ? `@${profile.username}` : 'Developer profile'} description="A developer in the RepoPilot community.">
      {error && <p className="rp-error rp-notice" role="alert">{error}</p>}
      {!profile ? <p className="rp-muted">Loading profile…</p> : (
        <section className="rp-card rp-profile-card">
          <span className="rp-avatar rp-avatar-large">{profile.username.slice(0, 1).toUpperCase()}</span>
          <h2>@{profile.username}</h2>
          <p>{profile.bio || 'This developer has not added a bio yet.'}</p>
          <div className="rp-project-stats"><span>{profile.followers_count} followers</span><span>{profile.following_count} following</span></div>
          {profile.skills.length > 0 && <div className="rp-tags">{profile.skills.map((skill) => <span className="rp-tag" key={skill}>{skill}</span>)}</div>}
          <div className="rp-inline-actions">
            {profile.github_url && <a className="rp-button rp-button-secondary" href={profile.github_url} target="_blank" rel="noreferrer">GitHub ↗</a>}
            {profile.website && <a className="rp-button rp-button-secondary" href={profile.website} target="_blank" rel="noreferrer">Website ↗</a>}
            {user?.id === profile.id ? <Link className="rp-button rp-button-primary" href="/profile">Edit profile</Link> : user && <button className="rp-button rp-button-primary" onClick={() => void toggleFollow()}>{profile.is_following ? 'Unfollow' : 'Follow'}</button>}
          </div>
        </section>
      )}
    </PageShell>
  )
}

export default function PublicProfilePage() {
  return <Suspense fallback={<PageShell title="Developer profile" description="Loading profile details…"><p className="rp-muted">Loading…</p></PageShell>}><PublicProfileContent /></Suspense>
}
