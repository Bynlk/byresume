import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Target, Heart, Code, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">关于智能简历编辑器</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            我们致力于让每个人都能轻松创建专业、美观且高效的简历，借助 AI 技术提升求职竞争力。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">我们的使命</h2>
            <p className="text-lg text-muted-foreground mb-4">
              在当今竞争激烈的就业市场中，一份出色的简历是打开机会之门的钥匙。然而，许多人，特别是应届大学生因缺乏设计经验或写作技巧而难以制作出令人印象深刻的简历。
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              智能简历编辑器应运而生——我们结合现代化的设计工具与 AI 智能优化，为用户提供从内容撰写、格式排版到一键导出的全流程解决方案。
            </p>
            <p className="text-lg text-muted-foreground">
              我们的目标不仅是帮助用户制作简历，更是帮助他们展示最优秀的自己。
            </p>
          </div>
          <div className="bg-muted rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold">100+</h3>
                <p className="text-muted-foreground">用户信任</p>
              </div>
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold">400+</h3>
                <p className="text-muted-foreground">简历生成</p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold">95%</h3>
                <p className="text-muted-foreground">用户满意度</p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold">中文</h3>
                <p className="text-muted-foreground">语言支持</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-10">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI 智能优化</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                自动读取简历的信息，为您的简历内容提供语法修正、表达优化、关键词建议，让您的简历更符合招聘者期待。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>隐私安全</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                我们采用浏览器本地储存，服务器不储存任何数据，绝对安全。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>多平台支持</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                支持导出 PDF、Word、纯文本等多种格式，适配 A4 打印、在线分享、招聘平台上传等场景。
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">开始您的专业简历之旅</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            无需设计经验，无需付费模板。智能简历编辑器免费为您提供最专业的简历制作体验。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/editor">立即开始制作</Link>
            </Button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">联系我们</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              如果您有任何问题、建议或合作意向，欢迎通过以下方式与我们联系：
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>邮箱：bynlkcc@gmail.com</li>
              <li>GitHub：github.com/bynlk/ByResume</li>
              <li>如果您有其他合适的模板，请联系我，我来为您免费添加模板</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}