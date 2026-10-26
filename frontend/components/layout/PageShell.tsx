import AppHeader from './AppHeader'

export default function PageShell({
  children,
  title,
  description,
  actions,
}: {
  children: React.ReactNode
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <>
      <AppHeader />
      <main className="rp-page">
        <div className="rp-page-heading">
          <div>
            <p className="section-label">RepoPilot workspace</p>
            <h1>{title}</h1>
            <p className="rp-page-description">{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </main>
    </>
  )
}
