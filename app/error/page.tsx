import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
  title: "错误 - SmartResume",
  description: "发生了一个错误",
}

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            出错了
          </h1>
          <p className="text-sm text-muted-foreground">
            抱歉，处理您的请求时出现错误。
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/login">
              返回登录
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
