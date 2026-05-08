// 📁 ByResume/components/ui/Toaster.tsx
'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
      }}
    />
  )
}