import type { Metadata } from 'next'
import { AuthProvider } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepoPilot — Understand a GitHub Repository Before You Dive In',
  description:
    'Paste a public GitHub repository URL to explore its README, languages, source tree, dependencies, contributors, releases, and recent commits.',
  keywords: [
    'GitHub repository analyzer', 'repository overview', 'dependency analysis',
    'source tree', 'repository activity', 'developer tools',
  ],
  openGraph: {
    title: 'RepoPilot — GitHub Repository Overview',
    description: 'Explore repository structure, dependencies, documentation, and activity from one link.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RepoPilot — Repository Intelligence',
    description: 'Get a practical overview of any public GitHub repository.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
