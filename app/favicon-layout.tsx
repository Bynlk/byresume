import type { Metadata } from 'next'

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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
