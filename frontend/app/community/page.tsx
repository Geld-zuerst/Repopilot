'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import PageShell from '../../components/layout/PageShell'
import { api, formatDateTime, type Comment, type Page, type Post, type Project } from '../../lib/api'
import { useSession } from '../providers'

export default function CommunityPage() {
  const { user } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [followingOnly, setFollowingOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [commentsFor, setCommentsFor] = useState<number | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [editingPost, setEditingPost] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      api<Page<Project> | Project[]>('/api/projects/mine/')
        .then((result) => setMyProjects(Array.isArray(result) ? result : result.results))
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load your projects.'))
    }
  }, [user])

  const loadFeed = useCallback(async () => {
    const params = new URLSearchParams()
    if (followingOnly) params.set('following', 'true')
    if (query) params.set('search', query)
    const result = await api<Page<Post> | Post[]>(`/api/community/feed/${params.size ? `?${params}` : ''}`)
    setPosts(Array.isArray(result) ? result : result.results)
  }, [followingOnly, query])

  useEffect(() => {
    let active = true
    const params = new URLSearchParams()
    if (followingOnly) params.set('following', 'true')
    if (query) params.set('search', query)
    api<Page<Post> | Post[]>(`/api/community/feed/${params.size ? `?${params}` : ''}`)
      .then((result) => { if (active) setPosts(Array.isArray(result) ? result : result.results) })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'Could not load the feed.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [followingOnly, query])

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setLoading(true)
    setError('')
    try {
      await api('/api/community/posts/create/', {
        method: 'POST',
        body: JSON.stringify({
          title: data.get('title'),
          content: data.get('content'),
          tags: String(data.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean),
          project: data.get('project') ? Number(data.get('project')) : null,
        }),
      })
      form.reset()
      setCreating(false)
      await loadFeed()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not publish your post.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleLike(post: Post) {
    if (!user) return
    setError('')
    try {
      const response = await api<{ action: string; likes: number }>(`/api/community/posts/${post.id}/like/`, { method: 'POST' })
      setPosts((items) => items.map((item) => item.id === post.id
        ? { ...item, likes: response.likes, is_liked: response.action === 'liked' }
        : item))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update like.')
    }
  }

  async function showComments(postId: number) {
    if (commentsFor === postId) {
      setCommentsFor(null)
      return
    }
    setCommentsFor(postId)
    setError('')
    try {
      const post = await api<Post>(`/api/community/posts/${postId}/`)
      setComments(post.comments || [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load comments.')
    }
  }

  async function addComment(event: FormEvent<HTMLFormElement>, postId: number) {
    event.preventDefault()
    if (!commentText.trim()) return
    try {
      const result = await api<{ comment: Comment }>(`/api/community/posts/${postId}/comments/create/`, {
        method: 'POST',
        body: JSON.stringify({ content: commentText.trim() }),
      })
      setComments((items) => [...items, result.comment])
      setCommentText('')
      setPosts((items) => items.map((post) => post.id === postId ? { ...post, comment_count: post.comment_count + 1 } : post))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not add comment.')
    }
  }

  async function updatePost(event: FormEvent<HTMLFormElement>, postId: number) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      const response = await api<{ post: Post }>(`/api/community/posts/${postId}/update/`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: data.get('title'),
          content: data.get('content'),
          tags: String(data.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean),
          project: data.get('project') ? Number(data.get('project')) : null,
        }),
      })
      setPosts((items) => items.map((post) => post.id === postId ? { ...post, ...response.post } : post))
      setEditingPost(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update post.')
    }
  }

  async function deletePost(postId: number) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    try {
      await api(`/api/community/posts/${postId}/delete/`, { method: 'DELETE' })
      setPosts((items) => items.filter((post) => post.id !== postId))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete post.')
    }
  }

  async function deleteComment(postId: number, commentId: number) {
    try {
      await api(`/api/community/posts/${postId}/comments/${commentId}/delete/`, { method: 'DELETE' })
      setComments((items) => items.filter((comment) => comment.id !== commentId))
      setPosts((items) => items.map((post) => post.id === postId ? { ...post, comment_count: Math.max(0, post.comment_count - 1) } : post))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete comment.')
    }
  }

  function searchPosts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = search.trim()
    if (nextQuery === query) {
      setLoading(true)
      loadFeed()
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not search posts.'))
        .finally(() => setLoading(false))
      return
    }
    setLoading(true)
    setError('')
    setQuery(nextQuery)
  }

  return (
    <PageShell
      title="Community"
      description="Share what you’re building, ask questions, and learn from other developers."
      actions={user ? <button className="rp-button rp-button-primary" onClick={() => setCreating((open) => !open)}>{creating ? 'Cancel' : '＋ Write a post'}</button> : <Link className="rp-button rp-button-primary" href="/login">Sign in to post</Link>}
    >
      <form className="rp-search" onSubmit={searchPosts}>
        <input aria-label="Search community posts" placeholder="Search posts…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button className="rp-button rp-button-secondary">Search posts</button>
      </form>
      <div className="rp-feed-controls">
        <button className={`rp-button ${followingOnly ? 'rp-button-primary' : 'rp-button-secondary'}`} disabled={!user || followingOnly} onClick={() => { setLoading(true); setFollowingOnly(true) }}>Following</button>
        <button className={`rp-button ${!followingOnly ? 'rp-button-primary' : 'rp-button-secondary'}`} disabled={!followingOnly} onClick={() => { setLoading(true); setFollowingOnly(false) }}>Everyone</button>
        {followingOnly && !user && <span className="rp-muted">Sign in to see posts from developers you follow.</span>}
      </div>
      {creating && user && (
        <form className="rp-card rp-form rp-project-form" onSubmit={createPost}>
          <h2>Share with the community</h2>
          <label>Title<input name="title" maxLength={300} required /></label>
          <label>Your post<textarea name="content" rows={5} required /></label>
          <label>Tags <span className="rp-muted">(comma-separated)</span><input name="tags" /></label>
          <label>Link a project <span className="rp-muted">(optional)</span><select name="project" defaultValue=""><option value="">No project</option>{myProjects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
          <button className="rp-button rp-button-primary">Publish post</button>
        </form>
      )}
      {error && <p className="rp-error rp-notice" role="alert">{error}</p>}
      {loading ? <p className="rp-muted">Loading community…</p> : posts.length ? (
        <div className="rp-feed">
          {posts.map((post) => (
            <article key={post.id} className="rp-card rp-post">
              <div className="rp-post-author">
                <span className="rp-avatar">{post.author.username.slice(0, 1).toUpperCase()}</span>
                <div><Link href={`/users/${post.author.username}`}>@{post.author.username}</Link><span className="rp-muted">{formatDateTime(post.created_at)}</span></div>
              </div>
              {editingPost === post.id && user?.id === post.author.id ? (
                <form className="rp-form rp-project-form" onSubmit={(event) => void updatePost(event, post.id)}>
                  <label>Title<input name="title" maxLength={300} required defaultValue={post.title} /></label>
                  <label>Post<textarea name="content" rows={5} required defaultValue={post.content} /></label>
                  <label>Tags <span className="rp-muted">(comma-separated)</span><input name="tags" defaultValue={post.tags.join(', ')} /></label>
                  <label>Link a project <span className="rp-muted">(optional)</span><select name="project" defaultValue={post.project || ''}><option value="">No project</option>{myProjects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
                  <div className="rp-inline-actions"><button className="rp-button rp-button-primary">Save post</button><button type="button" className="rp-button rp-button-secondary" onClick={() => setEditingPost(null)}>Cancel</button></div>
                </form>
              ) : (
                <>
                  <h2>{post.title}</h2>
                  <p className="rp-post-content">{post.content}</p>
                  <div className="rp-tags">{post.tags.map((tag) => <span className="rp-tag" key={tag}>#{tag}</span>)}</div>
                  {post.project && <Link className="rp-tag" href={`/projects/${post.project}`}>View linked project ↗</Link>}
                </>
              )}
              <div className="rp-inline-actions">
                <button className={`rp-button ${post.is_liked ? 'rp-button-liked' : 'rp-button-secondary'}`} onClick={() => void toggleLike(post)} disabled={!user}>♥ {post.likes}</button>
                <button className="rp-button rp-button-secondary" onClick={() => void showComments(post.id)}>Comments ({post.comment_count})</button>
                {user?.id === post.author.id && <button className="rp-button rp-button-secondary" onClick={() => setEditingPost(post.id)}>Edit</button>}
                {user?.id === post.author.id && <button className="rp-button rp-button-danger" onClick={() => void deletePost(post.id)}>Delete</button>}
              </div>
              {commentsFor === post.id && (
                <div className="rp-comments">
                  {comments.length ? comments.map((comment) => <p key={comment.id}><Link href={`/users/${comment.author.username}`}>@{comment.author.username}</Link> {comment.content} {user?.id === comment.author.id && <button className="rp-button rp-button-quiet" onClick={() => void deleteComment(post.id, comment.id)}>Delete</button>}</p>) : <p className="rp-muted">No comments yet. Start the conversation.</p>}
                  {user ? <form className="rp-comment-form" onSubmit={(event) => void addComment(event, post.id)}><input aria-label="Write a comment" placeholder="Write a comment…" value={commentText} onChange={(event) => setCommentText(event.target.value)} /><button className="rp-button rp-button-primary">Reply</button></form> : <Link href="/login">Sign in to comment</Link>}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : <div className="rp-card rp-empty"><h2>It’s quiet here</h2><p>Share the first post or check back later.</p></div>}
    </PageShell>
  )
}
