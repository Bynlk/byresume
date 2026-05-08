// 📁 ByResume/components/ui/Skeleton.tsx
'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton rounded-md bg-slate-200 dark:bg-slate-700', className)} />
  )
}

export function ResumeSkeleton() {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-8 mx-auto">
      {/* 头部 */}
      <div className="text-center mb-6">
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-32 mx-auto mb-4" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* 个人简介 */}
      <div className="mb-6">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* 工作经历 */}
      <div className="mb-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* 教育背景 */}
      <div className="mb-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-40 mt-2" />
      </div>

      {/* 技能 */}
      <div>
        <Skeleton className="h-6 w-16 mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function EditorSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* 标签 */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      {/* 折叠区块 */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
