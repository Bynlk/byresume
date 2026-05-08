import ResumeEditor from '@/components/ResumeEditor'
import { getResumeData } from '@/lib/resume/actions'

export const dynamic = 'force-dynamic'

export default async function EditorPage() {
  const initialData = await getResumeData()

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ResumeEditor initialData={initialData} />
    </div>
  )
}