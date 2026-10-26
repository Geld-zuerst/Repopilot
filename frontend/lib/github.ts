export type GitHubOwner = {
  login: string
  avatar_url: string
  html_url: string
  type: string
}

export type GitHubRepository = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  subscribers_count: number
  open_issues_count: number
  language: string | null
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string | null
  size: number
  topics: string[]
  visibility: string
  license: { name: string; spdx_id: string | null } | null
  owner: GitHubOwner
}

export type GitTreeEntry = {
  path: string
  mode: string
  type: 'blob' | 'tree' | 'commit'
  size?: number
  sha: string
  url: string
}

export type GitHubCommit = {
  sha: string
  html_url: string
  commit: {
    message: string
    author: { name: string; date: string } | null
  }
  author: { login: string; avatar_url: string; html_url: string } | null
}

export type GitHubContributor = {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export type GitHubRelease = {
  tag_name: string
  name: string | null
  html_url: string
  published_at: string | null
  prerelease: boolean
}

export type Dependency = {
  name: string
  version: string
  ecosystem: string
  file: string
}

export type RepositoryAnalysis = {
  repository: GitHubRepository
  languages: Record<string, number>
  tree: GitTreeEntry[]
  treeTruncated: boolean
  readme: string | null
  commits: GitHubCommit[]
  contributors: GitHubContributor[]
  releases: GitHubRelease[]
  dependencies: Dependency[]
  warnings: string[]
}

const API = 'https://api.github.com'
const API_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

export function parseGitHubRepository(input: string) {
  let url: URL
  try {
    url = new URL(input.trim().startsWith('github.com') ? `https://${input.trim()}` : input.trim())
  } catch {
    throw new Error('GitHub URL sahi format mein enter karein, jaise https://github.com/owner/repo.')
  }
  if (url.hostname.toLowerCase() !== 'github.com' && url.hostname.toLowerCase() !== 'www.github.com') {
    throw new Error('Abhi sirf github.com repositories supported hain.')
  }

  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length < 2 || parts[0] === 'orgs' || parts[0] === 'users') {
    throw new Error('Repository URL mein owner aur repository dono hone chahiye.')
  }
  const owner = parts[0]
  const repo = parts[1].replace(/\.git$/i, '')
  if (!/^[A-Za-z0-9-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new Error('GitHub repository URL mein invalid owner ya repository name hai.')
  }
  return { owner, repo }
}

async function githubRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { headers: API_HEADERS })
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      throw new Error('GitHub API ki public rate limit poori ho gayi hai. Thodi der baad dobara try karein.')
    }
    if (response.status === 404) throw new Error('Repository public nahi hai ya URL sahi nahi hai.')
    const message = payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
      ? payload.message
      : response.statusText
    throw new Error(`GitHub API error (${response.status}): ${message}`)
  }
  return payload as T
}

async function optionalRequest<T>(path: string, label: string, warnings: string[]): Promise<T | null> {
  try {
    return await githubRequest<T>(path)
  } catch (cause) {
    warnings.push(`${label}: ${cause instanceof Error ? cause.message : 'data unavailable'}`)
    return null
  }
}

function decodeBase64(content: string) {
  const binary = atob(content.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function readmeFor(owner: string, repo: string, warnings: string[]) {
  const result = await optionalRequest<{ content: string; encoding: string }>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
    'README',
    warnings,
  )
  if (!result) return null
  if (result.encoding !== 'base64') {
    warnings.push('README: GitHub returned an unsupported file encoding.')
    return null
  }
  return decodeBase64(result.content)
}

function dependenciesFrom(file: string, content: string): Dependency[] {
  const dependencies: Dependency[] = []
  const add = (name: string, version: string, ecosystem: string) => {
    if (name && !name.startsWith('#')) dependencies.push({ name, version: version || 'unspecified', ecosystem, file })
  }

  if (file.endsWith('package.json')) {
    try {
      const manifest = JSON.parse(content) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
      for (const [name, version] of Object.entries({ ...manifest.dependencies, ...manifest.devDependencies })) add(name, version, 'npm')
    } catch {
      return []
    }
  } else if (file.endsWith('requirements.txt')) {
    for (const line of content.split(/\r?\n/)) {
      const match = line.trim().match(/^([A-Za-z0-9_.-]+)\s*(?:==|~=|>=|<=|>|<)\s*([^\s;#]+)/)
      if (match) add(match[1], match[2], 'PyPI')
    }
  } else if (file.endsWith('pyproject.toml')) {
    const dependencyList = content.match(/(?:^|\n)\s*dependencies\s*=\s*\[([\s\S]*?)\]/m)?.[1]
    if (dependencyList) {
      for (const match of dependencyList.matchAll(/["']([A-Za-z0-9_.-]+)\s*(?:==|~=|>=|<=|>|<|!=)\s*([^"';\s]+)["']/g)) {
        add(match[1], match[2], 'PyPI')
      }
    }
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      const stringDependency = trimmed.match(/^["']?([A-Za-z0-9_.-]+)["']?\s*=\s*["']([^"']+)["']/)
      const tableDependency = trimmed.match(/^["']?([A-Za-z0-9_.-]+)["']?\s*=\s*\{[^}]*version\s*=\s*["']([^"']+)["']/)
      const match = stringDependency || tableDependency
      if (match && !['name', 'version', 'description', 'requires-python', 'build-backend', 'python'].includes(match[1].toLowerCase())) {
        add(match[1], match[2], 'PyPI')
      }
    }
  } else if (file.endsWith('Cargo.toml')) {
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      const match = trimmed.match(/^([A-Za-z0-9_-]+)\s*=\s*["']([^"']+)["']/)
        || trimmed.match(/^([A-Za-z0-9_-]+)\s*=\s*\{[^}]*version\s*=\s*["']([^"']+)["']/)
      if (match && !['name', 'version', 'edition', 'description'].includes(match[1])) add(match[1], match[2], 'Cargo')
    }
  } else if (file.endsWith('go.mod')) {
    for (const line of content.split(/\r?\n/)) {
      const match = line.trim().match(/^([A-Za-z0-9./_-]+)\s+(v[^\s]+)/)
      if (match) add(match[1], match[2], 'Go')
    }
  }
  return dependencies
}

async function loadDependencies(
  owner: string,
  repo: string,
  branch: string,
  tree: GitTreeEntry[],
  warnings: string[],
) {
  const supportedFiles = ['package.json', 'requirements.txt', 'pyproject.toml', 'Cargo.toml', 'go.mod']
  const manifests = supportedFiles
    .map((name) => tree.find((entry) => entry.type === 'blob' && entry.path === name))
    .filter((entry): entry is GitTreeEntry => Boolean(entry && (entry.size ?? 0) <= 250_000))

  const results = await Promise.all(manifests.map(async (manifest) => {
    const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${manifest.path.split('/').map(encodeURIComponent).join('/')}`
    try {
      const response = await fetch(rawUrl)
      if (!response.ok) {
        warnings.push(`${manifest.path}: dependency manifest could not be read.`)
        return []
      }
      return dependenciesFrom(manifest.path, await response.text())
    } catch (cause) {
      warnings.push(`${manifest.path}: ${cause instanceof Error ? cause.message : 'dependency manifest could not be read.'}`)
      return []
    }
  }))
  return results.flat()
}

export async function analyzeGitHubRepository(input: string): Promise<RepositoryAnalysis> {
  const { owner, repo } = parseGitHubRepository(input)
  const repositoryPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`

  const repository = await githubRequest<GitHubRepository>(repositoryPath)
  const warnings: string[] = []
  const [languages, gitTree, readme, commits, contributors, releases] = await Promise.all([
    optionalRequest<Record<string, number>>(`${repositoryPath}/languages`, 'Languages', warnings),
    optionalRequest<{ tree: GitTreeEntry[]; truncated: boolean }>(`${repositoryPath}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`, 'File tree', warnings),
    readmeFor(owner, repo, warnings),
    optionalRequest<GitHubCommit[]>(`${repositoryPath}/commits?per_page=8`, 'Recent commits', warnings),
    optionalRequest<GitHubContributor[]>(`${repositoryPath}/contributors?per_page=8`, 'Contributors', warnings),
    optionalRequest<GitHubRelease[]>(`${repositoryPath}/releases?per_page=5`, 'Releases', warnings),
  ])
  const dependencies = await loadDependencies(owner, repo, repository.default_branch, gitTree?.tree || [], warnings)

  return {
    repository,
    languages: languages || {},
    tree: gitTree?.tree || [],
    treeTruncated: gitTree?.truncated || false,
    readme,
    commits: commits || [],
    contributors: contributors || [],
    releases: releases || [],
    dependencies,
    warnings,
  }
}

export async function fetchRepositoryFile(repository: GitHubRepository, path: string, size = 0) {
  if (size > 250_000) throw new Error('This file is larger than the 250 KB preview limit.')
  const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}/${encodeURIComponent(repository.default_branch)}/${path.split('/').map(encodeURIComponent).join('/')}`
  const response = await fetch(rawUrl)
  if (!response.ok) throw new Error(`Could not load this file (${response.status}).`)
  return response.text()
}
