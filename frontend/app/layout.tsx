import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepoPilot — Understand Any Codebase. Navigate Every Line.',
  description:
    'RepoPilot is an AI-powered codebase intelligence platform that helps developers understand unfamiliar repositories, investigate bugs, and generate evidence-backed code explanations — privately, with open-source AI.',
  keywords: [
    'codebase intelligence', 'AI code explorer', 'repository analysis',
    'developer tools', 'open-source AI', 'local-first', 'code investigation',
  ],
  openGraph: {
    title: 'RepoPilot — Understand Any Codebase',
    description: 'Your AI copilot for exploring, understanding, and mastering codebases.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RepoPilot — Codebase Intelligence',
    description: 'Explore, understand, and master any codebase with AI-powered evidence trails.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
