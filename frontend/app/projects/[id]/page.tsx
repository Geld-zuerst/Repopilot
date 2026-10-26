'use client'

import Link from 'next/link'
import { FormEvent, Suspense, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageShell from '../../../components/layout/PageShell'
import { api, formatDate, type Project } from '../../../lib/api'
import { useSession } from '../../providers'

function ProjectDetailContent() {
  const { id } = useParams<{ id: string }>()
  const { user } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<Project>(`/api/projects/${id}/`)
      .then(setProject)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load project.'))
      .finally(() => setLoading(false))
  }, [id])

  async function updateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!project) return
    const data = new FormData(event.currentTarget)
    setError('')
    try {
      const response = await api<{ project: Project }>(`/api/projects/${id}/update/`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: data.get('title'),
          description: data.get('description'),
          language: data.get('language'),
          github_url: data.get('github_url'),
          tags: String(data.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      })
      setProject(response.project)
      setEditing(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update project.')
    }
  }

  async function deleteProject() {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await api(`/api/projects/${id}/delete/`, { method: 'DELETE' })
      router.push('/projects')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete project.')
    }
  }

  if (loading) return <PageShell title="Project" description="Loading project details…"><p className="rp-muted">Loading…</p></PageShell>
  if (!project) return <PageShell title="Project not found" description="This project may have been removed."><p className="rp-error">{error || 'Project not found.'}</p><Link href="/projects">Back to projects</Link></PageShell>

  const isOwner = user?.id === project.owner.id
  return (
    <PageShell title={project.title} description={`Shared by @${project.owner.username}`}>
      {error && <p className="rp-error rp-notice" role="alert">{error}</p>}
      <article className="rp-card rp-detail-card">
        <div className="rp-card-top"><span className="rp-pill">{project.language || 'Repository'}</span><span className="rp-muted">Added {formatDate(project.created_at)}</span></div>
        {editing ? (
          <form className="rp-form rp-project-form" onSubmit={updateProject}>
            <label>Project name<input name="title" required defaultValue={project.title} /></label>
            <label>Description<textarea name="description" rows={5} defaultValue={project.description} /></label>
            <label>Primary language<input name="language" defaultValue={project.language} /></label>
            <label>GitHub URL<input name="github_url" type="url" defaultValue={project.github_url} /></label>
            <label>Tags <span className="rp-muted">(comma-separated)</span><input name="tags" defaultValue={project.tags.join(', ')} /></label>
            <div className="rp-inline-actions"><button className="rp-button rp-button-primary">Save changes</button><button type="button" className="rp-button rp-button-secondary" onClick={() => setEditing(false)}>Cancel</button></div>
          </form>
        ) : (
          <>
            <p className="rp-detail-description">{project.description || 'No description provided yet.'}</p>
            <div className="rp-project-stats"><span>★ {project.stars} stars</span><span>{project.forks} forks</span><span>{project.watchers} watchers</span></div>
            <div className="rp-tags">{project.tags.map((tag) => <span className="rp-tag" key={tag}>#{tag}</span>)}</div>
            {project.languages_list.length > 0 && <p className="rp-muted">Languages: {project.languages_list.join(', ')}</p>}
            <div className="rp-inline-actions">
              {project.github_url && <a className="rp-button rp-button-secondary" href={project.github_url} target="_blank" rel="noreferrer">Open repository ↗</a>}
              <Link className="rp-button rp-button-secondary" href={`/users/${project.owner.username}`}>View @{project.owner.username}</Link>
              {isOwner && <button className="rp-button rp-button-secondary" onClick={() => setEditing(true)}>Edit</button>}
              {isOwner && <button className="rp-button rp-button-danger" onClick={() => void deleteProject()}>Delete</button>}
            </div>
          </>
        )}
      </article>
    </PageShell>
  )
}

export default function ProjectDetailPage() {
  return <Suspense fallback={<PageShell title="Project" description="Loading project details…"><p className="rp-muted">Loading…</p></PageShell>}><ProjectDetailContent /></Suspense>
}
