import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Analyzer V25.0 - OpenRouter Edition',
  description: 'AI-powered UX Research Analysis with AI',
  keywords: ['UX Research', 'AI Analysis', 'User Experience', 'AI', 'OpenRouter'],
  authors: [{ name: 'UX Research Team' }],
  creator: 'Analyzer',
  publisher: 'UX Research Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://analyzer-v25.railway.app'),
  openGraph: {
    title: 'Analyzer V25.0 - OpenRouter Edition',
    description: 'AI-powered UX Research Analysis with AI',
    url: 'https://analyzer-v25.railway.app',
    siteName: 'Analyzer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Analyzer V25.0',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Analyzer V25.0 - OpenRouter Edition',
    description: 'AI-powered UX Research Analysis with AI',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#030213" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
