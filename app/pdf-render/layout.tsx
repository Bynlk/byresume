export default function PdfRenderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 纯净布局，不包含导航栏和其他UI元素
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
