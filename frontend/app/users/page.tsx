'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import PageShell from '../../components/layout/PageShell'
import { api, type Page, type User } from '../../lib/api'
import { useSession } from '../providers'

export default function UsersPage() {
  const { user } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    api<Page<User> | User[]>(`/api/auth/users/${params.size ? `?${params}` : ''}`)
      .then((result) => { if (active) setUsers(Array.isArray(result) ? result : result.results) })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'Could not load developers.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query])

  async function toggleFollow(target: User) {
    if (!user) return
    try {
      const result = await api<{ action: string; followers_count: number }>(`/api/auth/users/${encodeURIComponent(target.username)}/follow/`, { method: 'POST' })
      setUsers((items) => items.map((item) => item.id === target.id ? {
        ...item,
        is_following: result.action === 'followed',
        followers_count: result.followers_count,
      } : item))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update follow.')
    }
  }

  function searchUsers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const nextQuery = search.trim()
    if (nextQuery === query) {
      setLoading(true)
      const params = new URLSearchParams()
      if (nextQuery) params.set('search', nextQuery)
      api<Page<User> | User[]>(`/api/auth/users/${params.size ? `?${params}` : ''}`)
        .then((result) => setUsers(Array.isArray(result) ? result : result.results))
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load developers.'))
        .finally(() => setLoading(false))
      return
    }
    setLoading(true)
    setQuery(nextQuery)
  }

  return (
    <PageShell title="Developers" description="Discover people building interesting things and follow their work.">
      <form className="rp-search" onSubmit={searchUsers}>
        <input aria-label="Search developers" placeholder="Search usernames…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button className="rp-button rp-button-secondary">Search</button>
      </form>
      {error && <p className="rp-error rp-notice" role="alert">{error}</p>}
      {loading ? <p className="rp-muted">Loading developers…</p> : users.length ? (
        <div className="rp-grid">
          {users.filter((person) => person.id !== user?.id).map((person) => (
            <article key={person.id} className="rp-card rp-user-card">
              <span className="rp-avatar">{person.username.slice(0, 1).toUpperCase()}</span>
              <h2><Link href={`/users/${person.username}`}>@{person.username}</Link></h2>
              <p>{person.bio || 'Developer on RepoPilot.'}</p>
              <p className="rp-muted">{person.followers_count} followers · {person.following_count} following</p>
              {person.skills.length > 0 && <div className="rp-tags">{person.skills.map((skill) => <span className="rp-tag" key={skill}>{skill}</span>)}</div>}
              {user && <button className={`rp-button ${person.is_following ? 'rp-button-secondary' : 'rp-button-primary'}`} onClick={() => void toggleFollow(person)}>{person.is_following ? 'Following' : 'Follow'}</button>}
            </article>
          ))}
        </div>
      ) : <div className="rp-card rp-empty"><h2>No developers found</h2><p>Try another username.</p></div>}
    </PageShell>
  )
}
