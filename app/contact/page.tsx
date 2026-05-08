import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">联系我们</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            我们非常重视您的反馈。无论您遇到问题、有合作意向，还是想提出建议，都欢迎通过以下方式与我们取得联系。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>电子邮件</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                一般咨询、技术支持、合作邀请
              </p>
              <a
                href="mailto:support@bynlk.cc"
                className="text-primary font-semibold hover:underline"
              >
                bynlkcc@gmail.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                我们将在24小时内回复
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>社交媒体</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                目前仅有Github
              </p>
              <div className="space-y-2">
                <a
                  href="https://github.com/277188/Byresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:underline"
                >
                  GitHub: 277188
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            <Card>
              <CardHeader>
                <CardTitle>常见问题</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">我的简历数据安全吗？</h3>
                  <p className="text-sm text-muted-foreground">
                    是的，我们采用浏览器本地储存，不会上传到服务器，详细政策请参阅<strong>隐私政策</strong>。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">如何导出高质量的PDF？</h3>
                  <p className="text-sm text-muted-foreground">
                    在编辑器中点击右上角的“导出”按钮，选择PDF格式即可。我们使用矢量渲染技术，确保打印效果清晰。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">能否自定义模板？</h3>
                  <p className="text-sm text-muted-foreground">
                    目前提供20+模板，您可以通过主题颜色、字体大小等设置进行个性化调整，若您有更好的模板，请邮箱联系我。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center leading-normal">
              <CardHeader>
                <CardTitle className="text-center leading-10">其 他 资 源</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-center">
                <a
                  href="/byresume/privacy"
                  className="block text-primary hover:underline"
                >
                  隐私政策
                </a>
                <a
                  href="/byresume/terms"
                  className="block text-primary hover:underline"
                >
                  服务条款
                </a>
                <a
                  href="/byresume/about"
                  className="block text-primary hover:underline"
                >
                  关于我们
                </a>
                <a
                  href="/byresume/templates"
                  className="block text-primary hover:underline"
                >
                  模板库
                </a>
              </CardContent>
            </Card>
          
        </div>
      </div>
    </div>
  );
}