export type User = {
  id: number
  username: string
  email: string
  bio: string
  avatar_url: string | null
  github_url: string
  website: string
  skills: string[]
  followers_count: number
  following_count: number
  is_following?: boolean
  created_at: string
}

export type Project = {
  id: number
  title: string
  description: string
  owner: User
  language: string
  languages_list: string[]
  github_url: string
  stars: number
  forks: number
  watchers: number
  tags: string[]
  is_featured: boolean
  created_at: string
}

export type Comment = {
  id: number
  author: User
  content: string
  created_at: string
}

export type Post = {
  id: number
  author: User
  title: string
  content: string
  tags: string[]
  project: number | null
  project_detail?: Project | null
  likes: number
  is_liked: boolean
  comments?: Comment[]
  comment_count: number
  created_at: string
}

export type Page<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value))
}

type AuthResponse = {
  message: string
  user: User
  tokens: { access: string; refresh: string }
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const ACCESS_KEY = 'repopilot_access'
const REFRESH_KEY = 'repopilot_refresh'

export function getAccessToken() {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(ACCESS_KEY)
}

export function saveTokens(tokens: { access: string; refresh: string }) {
  window.localStorage.setItem(ACCESS_KEY, tokens.access)
  window.localStorage.setItem(REFRESH_KEY, tokens.refresh)
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
}

function errorMessage(payload: unknown) {
  if (typeof payload === 'string') return payload
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>
    if (typeof data.detail === 'string') return data.detail
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
      .join(' · ')
  }
  return 'The request failed. Please try again.'
}

async function readPayload<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new Error(errorMessage(payload))
  return payload as T
}

async function refreshAccessToken() {
  const refresh = window.localStorage.getItem(REFRESH_KEY)
  if (!refresh) return null

  const response = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (!response.ok) {
    clearTokens()
    return null
  }

  const payload = await readPayload<{ access: string; refresh?: string }>(response)
  const tokens = { access: payload.access, refresh: payload.refresh || refresh }
  saveTokens(tokens)
  return tokens.access
}

export async function api<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' })
  if (response.status === 401 && retry && typeof window !== 'undefined') {
    const renewed = await refreshAccessToken()
    if (renewed) return api<T>(path, init, false)
    clearTokens()
  }
  return readPayload<T>(response)
}

export function login(email: string, password: string) {
  return api<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false)
}

export function register(username: string, email: string, password: string, password2: string) {
  return api<AuthResponse>('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, password2 }),
  }, false)
}

export const apiUrl = API_URL
