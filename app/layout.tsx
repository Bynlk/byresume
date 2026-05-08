import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { MainNav } from '@/components/layout/MainNav'
import { ClientPrintStylesheet } from '@/components/ClientPrintStylesheet'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ByResume - AI 智能简历编辑器',
  description: '基于 AI 的现代化简历生成工具，支持实时预览、智能优化和多种模板',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📄</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Optimize Font Awesome Loading */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          as="style"
        />
        <ClientPrintStylesheet href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
        </noscript>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            storageKey="smartresume-theme"
            enableSystem={false}
          >
            <MainNav />
            <main className="flex-1 flex flex-col min-h-screen">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}