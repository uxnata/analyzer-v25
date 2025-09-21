import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UX Analyzer V25.0 - OpenRouter Edition',
  description: 'AI-powered UX Research Analysis with Claude 3.5 Sonnet',
  keywords: ['UX Research', 'AI Analysis', 'User Experience', 'Claude', 'OpenRouter'],
  authors: [{ name: 'UX Research Team' }],
  creator: 'UX Analyzer',
  publisher: 'UX Research Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ux-analyzer.vercel.app'),
  openGraph: {
    title: 'UX Analyzer V25.0 - OpenRouter Edition',
    description: 'AI-powered UX Research Analysis with Claude 3.5 Sonnet',
    url: 'https://ux-analyzer.vercel.app',
    siteName: 'UX Analyzer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UX Analyzer V25.0',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UX Analyzer V25.0 - OpenRouter Edition',
    description: 'AI-powered UX Research Analysis with Claude 3.5 Sonnet',
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
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}
