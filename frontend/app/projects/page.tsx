'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { api, formatDate, type Page, type Project } from '../../lib/api'
import PageShell from '../../components/layout/PageShell'
import { useSession } from '../providers'

type ProjectForm = {
  title: string
  description: string
  language: string
  github_url: string
  tags: string
}

const emptyForm: ProjectForm = { title: '', description: '', language: '', github_url: '', tags: '' }

export default function ProjectsPage() {
  const { user } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [language, setLanguage] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [featured, setFeatured] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProjects = useCallback(async () => {
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (tagFilter) params.set('tag', tagFilter)
    if (language) params.set('language', language)
    if (ordering !== '-created_at') params.set('ordering', ordering)
    if (featured) params.set('featured', 'true')
    const result = await api<Page<Project> | Project[]>(`/api/projects/${params.size ? `?${params}` : ''}`)
    setProjects(Array.isArray(result) ? result : result.results)
  }, [featured, language, ordering, query, tagFilter])

  useEffect(() => {
    let active = true
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (tagFilter) params.set('tag', tagFilter)
    if (language) params.set('language', language)
    if (ordering !== '-created_at') params.set('ordering', ordering)
    if (featured) params.set('featured', 'true')
    api<Page<Project> | Project[]>(`/api/projects/${params.size ? `?${params}` : ''}`)
      .then((result) => { if (active) setProjects(Array.isArray(result) ? result : result.results) })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'Could not load projects.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [featured, language, ordering, query, tagFilter])

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api('/api/projects/create/', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          language: form.language,
          github_url: form.github_url,
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      })
      setForm(emptyForm)
      setFormOpen(false)
      await loadProjects()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create project.')
    } finally {
      setLoading(false)
    }
  }

  function searchProjects(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const nextQuery = search.trim()
    const nextTag = tag.trim()
    if (nextQuery === query && nextTag === tagFilter) {
      setLoading(true)
      loadProjects()
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load projects.'))
        .finally(() => setLoading(false))
      return
    }
    setLoading(true)
    setQuery(nextQuery)
    setTagFilter(nextTag)
  }

  async function deleteProject(id: number) {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await api(`/api/projects/${id}/delete/`, { method: 'DELETE' })
      setProjects((items) => items.filter((project) => project.id !== id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete project.')
    }
  }

  return (
    <PageShell
      title="Projects"
      description="Find repositories shared by the community or add one of your own."
      actions={user ? <button className="rp-button rp-button-primary" onClick={() => setFormOpen((open) => !open)}>{formOpen ? 'Cancel' : '＋ Add project'}</button> : <Link className="rp-button rp-button-primary" href="/login">Sign in to add a project</Link>}
    >
      <form className="rp-search" onSubmit={searchProjects}>
        <input aria-label="Search projects" placeholder="Search by project, language, or description…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <input aria-label="Filter by tag" placeholder="Tag" value={tag} onChange={(event) => setTag(event.target.value)} />
        <select aria-label="Filter by language" value={language} onChange={(event) => { setLoading(true); setLanguage(event.target.value) }}>
          <option value="">All languages</option>
          {['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'C++'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Sort projects" value={ordering} onChange={(event) => { setLoading(true); setOrdering(event.target.value) }}>
          <option value="-created_at">Newest</option><option value="-stars">Most stars</option><option value="-forks">Most forks</option><option value="title">Name A–Z</option>
        </select>
        <label className="rp-featured-filter"><input type="checkbox" checked={featured} onChange={(event) => { setLoading(true); setFeatured(event.target.checked) }} /> Featured</label>
        <button className="rp-button rp-button-secondary">Search</button>
      </form>
      {formOpen && user && (
        <form className="rp-card rp-form rp-project-form" onSubmit={createProject}>
          <h2>Add a project</h2>
          <label>Project name<input required maxLength={255} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label>Description<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <div className="rp-form-row">
            <label>Primary language<input value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })} /></label>
            <label>GitHub URL<input type="url" placeholder="https://github.com/…" value={form.github_url} onChange={(event) => setForm({ ...form, github_url: event.target.value })} /></label>
          </div>
          <label>Tags <span className="rp-muted">(comma-separated)</span><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} /></label>
          <button className="rp-button rp-button-primary">Publish project</button>
        </form>
      )}
      {error && <p className="rp-error rp-notice" role="alert">{error}</p>}
      {loading ? <p className="rp-muted">Loading projects…</p> : projects.length ? (
        <div className="rp-grid">
          {projects.map((project) => (
            <article key={project.id} className="rp-card rp-project-card">
              <div className="rp-card-top"><span className="rp-pill">{project.language || 'Repository'}</span><span className="rp-muted">{formatDate(project.created_at)}</span></div>
              <h2><Link href={`/projects/${project.id}`}>{project.title}</Link></h2>
              <p>{project.description || 'No description provided yet.'}</p>
              <div className="rp-tags">{project.tags.map((tag) => <span className="rp-tag" key={tag}>#{tag}</span>)}</div>
              <div className="rp-card-footer">
                <Link href={`/users/${project.owner.username}`}>@{project.owner.username}</Link>
                <span>★ {project.stars} · Forks {project.forks}</span>
              </div>
              {user?.id === project.owner.id && <button className="rp-button rp-button-quiet rp-delete" onClick={() => void deleteProject(project.id)}>Delete</button>}
            </article>
          ))}
        </div>
      ) : <div className="rp-card rp-empty"><h2>No projects found</h2><p>Be the first to share a repository with the community.</p></div>}
    </PageShell>
  )
}
