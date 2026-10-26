'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Activity, ArrowUpRight, BookOpen, Boxes, ExternalLink, FileCode2,
  GitBranch, GitCommitHorizontal, GitFork, Globe2, LoaderCircle,
  Search, ShieldCheck, Star, Users,
} from 'lucide-react'
import {
  analyzeGitHubRepository,
  fetchRepositoryFile,
  type RepositoryAnalysis,
} from '../../lib/github'
import AppHeader from '../layout/AppHeader'

type Tab = 'overview' | 'files' | 'dependencies' | 'activity' | 'readme'

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'files', label: 'Files' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'activity', label: 'Activity' },
  { id: 'readme', label: 'README' },
]

const formatCount = (value: number) => new Intl.NumberFormat('en', { notation: value > 9999 ? 'compact' : 'standard' }).format(value)
const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
  : 'Not available'

function repositorySize(size: number) {
  if (size < 1024) return `${size} KB`
  return `${(size / 1024).toFixed(1)} MB`
}

function ErrorNotice({ children }: { children: React.ReactNode }) {
  return <p className="rp-error rp-notice" role="alert">{children}</p>
}

function Overview({ analysis, onOpenTab }: { analysis: RepositoryAnalysis; onOpenTab: (tab: Tab) => void }) {
  const { repository, languages, tree, dependencies, contributors, commits } = analysis
  const totalBytes = Object.values(languages).reduce((total, bytes) => total + bytes, 0)
  const sortedLanguages = Object.entries(languages).sort((first, second) => second[1] - first[1])
  const directories = tree.filter((entry) => entry.type === 'tree').length
  const sourceFiles = tree.filter((entry) => entry.type === 'blob').length
  const metrics = [
    { label: 'Files', value: formatCount(sourceFiles), icon: <FileCode2 size={18} /> },
    { label: 'Directories', value: formatCount(directories), icon: <Boxes size={18} /> },
    { label: 'Dependencies', value: formatCount(dependencies.length), icon: <GitFork size={18} /> },
    { label: 'Top contributors', value: formatCount(contributors.length), icon: <Users size={18} /> },
  ]

  return (
    <div className="repo-overview">
      <section className="repo-metrics">
        {metrics.map((metric) => <article className="rp-card repo-metric" key={metric.label}>
          <span className="repo-metric-icon">{metric.icon}</span>
          <span className="repo-metric-value">{metric.value}</span>
          <span className="rp-muted">{metric.label}</span>
        </article>)}
      </section>

      <div className="repo-overview-grid">
        <section className="rp-card repo-panel">
          <div className="repo-panel-heading"><h2>Languages</h2><span className="rp-muted">{sortedLanguages.length} detected</span></div>
          {sortedLanguages.length ? <>
            <div className="repo-language-bar" aria-label="Repository languages">
              {sortedLanguages.map(([language, bytes]) => <span key={language} title={`${language}: ${((bytes / totalBytes) * 100).toFixed(1)}%`} style={{ width: `${Math.max((bytes / totalBytes) * 100, 1)}%`, background: `hsl(${(language.charCodeAt(0) * 41) % 360} 72% 62%)` }} />)}
            </div>
            <div className="repo-language-list">
              {sortedLanguages.slice(0, 8).map(([language, bytes]) => <div key={language}><span><i style={{ background: `hsl(${(language.charCodeAt(0) * 41) % 360} 72% 62%)` }} />{language}</span><span>{((bytes / totalBytes) * 100).toFixed(1)}%</span></div>)}
            </div>
          </> : <p className="rp-muted">GitHub has not detected any programming languages.</p>}
        </section>

        <section className="rp-card repo-panel">
          <div className="repo-panel-heading"><h2>Repository details</h2><ShieldCheck size={17} color="#34D399" /></div>
          <dl className="repo-details">
            <div><dt>Primary language</dt><dd>{repository.language || 'Not detected'}</dd></div>
            <div><dt>Default branch</dt><dd>{repository.default_branch}</dd></div>
            <div><dt>License</dt><dd>{repository.license?.name || 'Not specified'}</dd></div>
            <div><dt>Visibility</dt><dd>{repository.visibility}</dd></div>
            <div><dt>Repository size</dt><dd>{repositorySize(repository.size)}</dd></div>
            <div><dt>Last pushed</dt><dd>{formatDate(repository.pushed_at)}</dd></div>
          </dl>
        </section>

        <section className="rp-card repo-panel repo-panel-wide">
          <div className="repo-panel-heading"><h2>What’s inside</h2><button className="rp-button rp-button-quiet" onClick={() => onOpenTab('files')}>Browse files <ArrowUpRight size={15} /></button></div>
          <div className="repo-structure">
            {tree.filter((entry) => entry.type === 'tree' && entry.path.split('/').length === 1).slice(0, 12).map((entry) =>
              <button key={entry.path} onClick={() => onOpenTab('files')}><Boxes size={16} /><span>{entry.path}</span></button>)}
            {tree.filter((entry) => entry.type === 'blob' && entry.path.split('/').length === 1).slice(0, 12).map((entry) =>
              <button key={entry.path} onClick={() => onOpenTab('files')}><FileCode2 size={16} /><span>{entry.path}</span></button>)}
          </div>
          {analysis.treeTruncated && <p className="rp-muted repo-note">GitHub truncated this very large repository’s file tree.</p>}
        </section>

        <section className="rp-card repo-panel">
          <div className="repo-panel-heading"><h2>Latest commit</h2><button className="rp-button rp-button-quiet" onClick={() => onOpenTab('activity')}>Activity <ArrowUpRight size={15} /></button></div>
          {commits[0] ? <>
            <p className="repo-commit-message">{commits[0].commit.message.split('\n')[0]}</p>
            <p className="rp-muted">{commits[0].author?.login || commits[0].commit.author?.name || 'Unknown author'} · {formatDate(commits[0].commit.author?.date || null)}</p>
          </> : <p className="rp-muted">Commit activity is unavailable.</p>}
        </section>
      </div>
    </div>
  )
}

function FileBrowser({ analysis }: { analysis: RepositoryAnalysis }) {
  const [query, setQuery] = useState('')
  const [selectedPath, setSelectedPath] = useState('')
  const [content, setContent] = useState('')
  const [loadingFile, setLoadingFile] = useState(false)
  const [error, setError] = useState('')
  const sourceEntries = useMemo(() => analysis.tree.filter((entry) =>
    entry.type === 'blob' && /\.(c|cc|cpp|cs|css|go|h|html|java|js|jsx|json|md|php|py|rb|rs|sh|sql|toml|ts|tsx|txt|vue|xml|yaml|yml)$/i.test(entry.path)
  ).sort((left, right) =>
    left.path.split('/').length - right.path.split('/').length || left.path.localeCompare(right.path)
  ), [analysis.tree])
  const shownEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matchingEntries = sourceEntries.filter((entry) =>
      entry.path.toLowerCase().includes(normalizedQuery)
    )
    const exactMatchIndex = matchingEntries.findIndex((entry) =>
      entry.path.toLowerCase() === normalizedQuery
    )
    if (exactMatchIndex > 0) {
      const [exactMatch] = matchingEntries.splice(exactMatchIndex, 1)
      if (exactMatch) matchingEntries.unshift(exactMatch)
    }
    return { files: matchingEntries.slice(0, 500), hasMore: matchingEntries.length > 500 }
  }, [sourceEntries, query])

  async function openFile(path: string, size: number) {
    setSelectedPath(path)
    setContent('')
    setError('')
    setLoadingFile(true)
    try {
      setContent(await fetchRepositoryFile(analysis.repository, path, size))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not open file.')
    } finally {
      setLoadingFile(false)
    }
  }

  return (
    <div className="repo-file-browser">
      <aside className="rp-card repo-tree">
        <label className="repo-file-search"><Search size={15} /><input aria-label="Filter repository files" placeholder="Filter files…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <p className="rp-muted">{formatCount(sourceEntries.length)} source and text files</p>
        <div className="repo-tree-list">
          {shownEntries.files.map((entry) => <button key={entry.path} className={entry.path === selectedPath ? 'active' : ''} onClick={() => void openFile(entry.path, entry.size || 0)}>
            <FileCode2 size={14} /><span>{entry.path}</span>
          </button>)}
          {shownEntries.hasMore && <p className="rp-muted repo-note">Showing the first 500 matching files. Filter to narrow the results.</p>}
          {!shownEntries.files.length && <p className="rp-muted">No matching text files.</p>}
        </div>
      </aside>
      <section className="rp-card repo-code-view">
        <div className="repo-code-heading"><FileCode2 size={15} /><span>{selectedPath || 'Choose a file to preview'}</span><a href={selectedPath ? `${analysis.repository.html_url}/blob/${encodeURIComponent(analysis.repository.default_branch)}/${selectedPath.split('/').map(encodeURIComponent).join('/')}` : analysis.repository.html_url} target="_blank" rel="noreferrer" aria-label="Open on GitHub"><ExternalLink size={15} /></a></div>
        {loadingFile ? <p className="rp-muted">Loading file…</p> : error ? <ErrorNotice>{error}</ErrorNotice> : content ? (
          <pre className="repo-code"><code>{content.split(/\r?\n/).map((line, index) => <span className="rp-source-line" key={index}><i>{index + 1}</i>{line || ' '}{'\n'}</span>)}</code></pre>
        ) : <div className="rp-empty"><FileCode2 size={30} /><p>Select a file to preview its source.</p><p className="rp-muted">File contents are fetched from GitHub only when you open a file.</p></div>}
      </section>
    </div>
  )
}

function Dependencies({ analysis }: { analysis: RepositoryAnalysis }) {
  const groups = analysis.dependencies.reduce<Record<string, typeof analysis.dependencies>>((result, dependency) => {
    result[dependency.ecosystem] ||= []
    result[dependency.ecosystem].push(dependency)
    return result
  }, {})
  return <section className="rp-card repo-panel">
    <div className="repo-panel-heading"><h2>Dependencies</h2><span className="rp-muted">{analysis.dependencies.length} detected</span></div>
    {Object.entries(groups).length ? <div className="repo-dependency-groups">
      {Object.entries(groups).map(([ecosystem, dependencies]) => <section key={ecosystem}>
        <h3>{ecosystem} <span className="rp-muted">{dependencies.length}</span></h3>
        <div className="repo-dependency-list">{dependencies.map((dependency) => <div key={`${dependency.file}:${dependency.name}`}><span>{dependency.name}<small>{dependency.file}</small></span><code>{dependency.version}</code></div>)}</div>
      </section>)}
    </div> : <div className="rp-empty"><Boxes size={28} /><h2>No supported dependency manifest found</h2><p>Supported formats include package.json, requirements.txt, pyproject.toml, Cargo.toml, and go.mod.</p></div>}
  </section>
}

function ActivityDetails({ analysis }: { analysis: RepositoryAnalysis }) {
  return <div className="repo-overview-grid">
    <section className="rp-card repo-panel">
      <div className="repo-panel-heading"><h2>Recent commits</h2><GitCommitHorizontal size={18} /></div>
      {analysis.commits.length ? <div className="repo-activity-list">{analysis.commits.map((commit) => <article key={commit.sha}>
        <a href={commit.html_url} target="_blank" rel="noreferrer" className="repo-activity-title">{commit.commit.message.split('\n')[0]} <ExternalLink size={13} /></a>
        <p className="rp-muted">{commit.author?.login || commit.commit.author?.name || 'Unknown author'} · {formatDate(commit.commit.author?.date || null)} · {commit.sha.slice(0, 7)}</p>
      </article>)}</div> : <p className="rp-muted">No recent commit activity available.</p>}
    </section>
    <section className="rp-card repo-panel">
      <div className="repo-panel-heading"><h2>Top contributors</h2><Users size={18} /></div>
      {analysis.contributors.length ? <div className="repo-contributors">{analysis.contributors.map((contributor) => <a key={contributor.login} href={contributor.html_url} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={contributor.avatar_url} alt="" /><span>{contributor.login}<small>{formatCount(contributor.contributions)} contributions</small></span><ExternalLink size={13} />
      </a>)}</div> : <p className="rp-muted">Contributor data is unavailable.</p>}
    </section>
    <section className="rp-card repo-panel repo-panel-wide">
      <div className="repo-panel-heading"><h2>Releases</h2><GitBranch size={18} /></div>
      {analysis.releases.length ? <div className="repo-releases">{analysis.releases.map((release) => <a key={release.tag_name} href={release.html_url} target="_blank" rel="noreferrer">
        <span className="rp-pill">{release.tag_name}</span><strong>{release.name || release.tag_name}</strong><span className="rp-muted">{formatDate(release.published_at)}</span><ExternalLink size={14} />
      </a>)}</div> : <p className="rp-muted">No published releases found.</p>}
    </section>
  </div>
}

export default function RepositoryAnalyzer({ initialRepo = '' }: { initialRepo?: string }) {
  const router = useRouter()
  const [input, setInput] = useState(initialRepo)
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const runAnalysis = useCallback(async (value: string) => {
    setLoading(true)
    setError('')
    setAnalysis(null)
    setActiveTab('overview')
    try {
      setAnalysis(await analyzeGitHubRepository(value))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Repository details could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialRepo) {
      Promise.resolve().then(() => {
        setInput(initialRepo)
        void runAnalysis(initialRepo)
      })
    }
  }, [initialRepo, runAnalysis])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = input.trim()
    if (!value) {
      setError('Pehle GitHub repository ka URL enter karein.')
      return
    }
    router.replace(`/analyze?repo=${encodeURIComponent(value)}`, { scroll: false })
    void runAnalysis(value)
  }

  function openTab(tab: Tab) {
    setActiveTab(tab)
  }

  return (
    <>
      <AppHeader />
      <main className="repo-page">
        <section className={`repo-search-hero ${analysis ? 'has-analysis' : ''}`}>
          <p className="section-label">Repository intelligence</p>
          <h1>Know a repository<br /><span className="gradient-text">before you dive in.</span></h1>
          <p className="repo-search-description">Paste a public GitHub URL to explore its README, languages, file structure, dependencies, commits, contributors, and releases.</p>
          <form className="repo-url-form" onSubmit={submit}>
            <GitBranch size={19} />
            <input aria-label="GitHub repository URL" type="url" placeholder="https://github.com/owner/repository" value={input} onChange={(event) => setInput(event.target.value)} />
            <button className="rp-button rp-button-primary" disabled={loading}>{loading ? <><LoaderCircle className="repo-spinner" size={17} /> Analyzing…</> : <><Activity size={16} /> Analyze repository</>}</button>
          </form>
          <div className="repo-privacy-note"><ShieldCheck size={15} /> Public GitHub repositories only. Analysis is read-only; repository contents are not stored.</div>
          {error && <ErrorNotice>{error}</ErrorNotice>}
        </section>

        {loading && <div className="rp-card repo-loading"><LoaderCircle className="repo-spinner" size={25} /><div><strong>Fetching repository details</strong><p className="rp-muted">Reading metadata, README, file tree, languages, and activity from GitHub…</p></div></div>}

        {!loading && !analysis && !error && <section className="rp-card repo-empty-state">
          <div className="repo-empty-icon"><GitBranch size={22} /></div>
          <h2>Start with any public GitHub repository</h2>
          <p>Try a repository you know, then browse its structure, dependencies, documentation, and recent activity in one place.</p>
          <button className="rp-button rp-button-secondary" onClick={() => { setInput('https://github.com/vercel/next.js'); router.replace('/analyze?repo=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js', { scroll: false }); void runAnalysis('https://github.com/vercel/next.js') }}>Try vercel/next.js</button>
        </section>}

        {!loading && analysis && <RepositoryDashboard analysis={analysis} activeTab={activeTab} onOpenTab={openTab} />}
        <footer className="rp-footer repo-footer"><span>Repository data provided by GitHub’s public API.</span><Link href="/">Back to RepoPilot</Link></footer>
      </main>
    </>
  )
}

function RepositoryDashboard({
  analysis,
  activeTab,
  onOpenTab,
}: {
  analysis: RepositoryAnalysis
  activeTab: Tab
  onOpenTab: (tab: Tab) => void
}) {
  const { repository } = analysis
  const tabContent = activeTab === 'overview'
    ? <Overview analysis={analysis} onOpenTab={onOpenTab} />
    : activeTab === 'files'
      ? <FileBrowser analysis={analysis} />
      : activeTab === 'dependencies'
        ? <Dependencies analysis={analysis} />
        : activeTab === 'activity'
          ? <ActivityDetails analysis={analysis} />
          : <section className="rp-card repo-readme">{analysis.readme ? <pre>{analysis.readme}</pre> : <div className="rp-empty"><BookOpen size={28} /><h2>No README found</h2><p>This repository does not have a README file on its default branch.</p></div>}</section>

  return (
    <section className="repo-dashboard">
      <div className="rp-card repo-identity">
        <div className="repo-identity-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="repo-owner-avatar" src={repository.owner.avatar_url} alt={`${repository.owner.login} avatar`} />
          <div className="repo-title-block">
            <p className="rp-muted"><a href={repository.owner.html_url} target="_blank" rel="noreferrer">{repository.owner.login}</a> /</p>
            <h2>{repository.name}</h2>
            <p>{repository.description || 'No repository description has been provided.'}</p>
          </div>
        </div>
        <div className="repo-identity-actions">
          <span className="rp-pill">{repository.visibility}</span>
          <a className="rp-button rp-button-secondary" href={repository.html_url} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open on GitHub</a>
        </div>
        <div className="repo-stat-row">
          <span><Star size={16} /> {formatCount(repository.stargazers_count)} stars</span>
          <span><GitFork size={16} /> {formatCount(repository.forks_count)} forks</span>
          <span><Users size={16} /> {formatCount(repository.subscribers_count)} watchers</span>
          <span><Activity size={16} /> {formatCount(repository.open_issues_count)} open issues & PRs</span>
          {repository.homepage && <a href={repository.homepage} target="_blank" rel="noreferrer"><Globe2 size={16} /> Website <ExternalLink size={12} /></a>}
        </div>
        {repository.topics.length > 0 && <div className="rp-tags">{repository.topics.map((topic) => <span className="rp-tag" key={topic}>{topic}</span>)}</div>}
      </div>

      {analysis.warnings.length > 0 && <div className="repo-warnings"><strong>Some optional details could not be loaded.</strong><ul>{analysis.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}

      <nav className="repo-tabs" aria-label="Repository details">
        {tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => onOpenTab(tab.id)}>{tab.label}{tab.id === 'dependencies' && <span>{analysis.dependencies.length}</span>}</button>)}
      </nav>

      <div className="repo-tab-content">{tabContent}</div>
    </section>
  )
}
