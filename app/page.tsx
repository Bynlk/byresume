import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, FileText, Palette, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-y-auto page-scroll">
      <main className="container mx-auto px-4 pt-16 flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            打造专业简历，
            <span className="text-primary">AI 来助力</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            现代化智能简历编辑器，结合拖拽排序、富文本编辑与 AI 优化，助你轻松创建令人印象深刻的简历。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/editor">
                立即开始 →
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">了解功能</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">我们有以下功能：</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">拖拽排序</h3>
              <p className="text-muted-foreground">
                直观拖拽调整模块顺序，轻松组织简历内容，体验流畅的交互设计。
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 智能优化</h3>
              <p className="text-muted-foreground">
                内置 AI 助手，根据上下文生成内容建议，提供优化指导。<span className="text-gray-500">（需自备api）</span>
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">精美模板</h3>
              <p className="text-muted-foreground">
                多种专业设计模板，一键切换，导出高质量 PDF，适配 A4 打印。
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30 rounded-3xl mb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">三步轻松创建简历</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">填写信息</h3>
                <p className="text-muted-foreground">输入个人信息、工作经历、教育背景等。</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">AI 优化</h3>
                <p className="text-muted-foreground">使用 AI 助手润色描述，提升表达专业性。</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">导出分享</h3>
                <p className="text-muted-foreground">导出 PDF 和 JSON，方便指导老师在此网站更改您的简历。</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">立即开始，无需注册</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            本网站为公益项目，请多多分享并支持
          </p>
          <Button size="lg" asChild className="gap-2">
            <Link href="/editor">
              开始制作简历 →
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ByResume简历编辑器. 保留所有权利.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-primary transition-colors">隐私政策</Link>
            {" · "}
            <Link href="/terms" className="hover:text-primary transition-colors">服务条款</Link>
            {" · "}
            <Link href="/contact" className="hover:text-primary transition-colors">联系我们</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}