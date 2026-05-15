import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sion Émergence',
  description: 'Tiers-lieu éducatif et communautaire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
