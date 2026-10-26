import { Suspense } from 'react'
import RepositoryAnalyzer from '../../components/repository/RepositoryAnalyzer'

async function AnalyzePageContent({
  searchParams,
}: {
  searchParams: Promise<{ repo?: string }>
}) {
  const { repo = '' } = await searchParams
  return <RepositoryAnalyzer initialRepo={repo} />
}

export default function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ repo?: string }>
}) {
  return <Suspense fallback={<main className="repo-page"><p className="rp-muted">Preparing repository analyzer…</p></main>}><AnalyzePageContent searchParams={searchParams} /></Suspense>
}
