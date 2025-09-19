import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AWS RMM Hackathon - Intelligent Remote Monitoring',
  description: 'AI-powered Remote Monitoring & Management with AWS Bedrock and Netdata',
  keywords: ['AWS', 'RMM', 'Monitoring', 'AI', 'Bedrock', 'Netdata', 'Hackathon'],
  authors: [{ name: 'AWS RMM Hackathon Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
