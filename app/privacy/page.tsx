import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">隐私政策</h1>
          <p className="text-xl text-muted-foreground">
            最后更新日期：2025年12月10日
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>简介</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              欢迎使用智能简历编辑器（以下简称“本产品”）。我们高度重视您的隐私保护，并致力于透明地说明我们如何收集、使用、存储和保护您的个人信息。
            </p>
            <p>
              本隐私政策适用于您通过 bynlk.cc 以及相关子域名访问我们的服务时所产生的个人信息处理。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>数据存储与安全</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              我们没有用户登录系统，也不会读取您简历的任何内容。
            </p>
            <p>
              为了隐私安全与成本，我们不提供api服务，需要使用ai助手请自行购买api使用。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>政策更新</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              我们可能会不时更新本隐私政策。更新后的版本将在本页面发布，并更新“最后更新日期”。我们鼓励您定期查阅本政策以了解最新变化。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>联系我们</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              如果您对本隐私政策或我们的数据处理有任何疑问、意见或投诉，请通过以下方式与我们联系：
            </p>
            <p className="mt-2">
              邮箱：<strong>bynlkcc@gmail.com</strong>
            </p>
            <p>
              Github：<a href="https://github.com/277188" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://github.com/277188</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}