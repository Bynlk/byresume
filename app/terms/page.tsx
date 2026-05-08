import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">服务条款</h1>
          <p className="text-xl text-muted-foreground">
            最后更新日期：2025年12月10日
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>接受条款</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              欢迎使用智能简历编辑器（以下简称“本服务”）。本服务由 ByResume 团队（以下简称“我们”）提供。您访问或使用本服务即表示您同意受本服务条款（以下简称“条款”）的约束。如果您不同意这些条款，请勿使用本服务。
            </p>
            <p>
              我们保留随时修改这些条款的权利。修改后的条款将在本页面发布，并自发布之日起生效。您继续使用本服务即表示接受更新后的条款。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>服务描述</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本服务是一个在线简历编辑平台，提供以下核心功能：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>创建、编辑、保存个人简历。</li>
              <li>使用预置模板美化简历。</li>
              <li>通过 AI 助手优化简历内容。</li>
              <li>导出简历为 PDF、Word 等格式。</li>
              <li>分享简历链接（如选择公开分享）。</li>
            </ul>
            <p>
              我们保留随时修改、暂停或终止任何功能的权利，且无需提前通知。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>用户账户</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              部分功能可能需要您注册账户。您同意：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>提供真实、准确、完整的注册信息，并及时更新。</li>
              <li>对您的账户和密码承担保密责任，并对账户下发生的所有活动负责。</li>
              <li>立即通知我们任何未经授权使用账户的行为。</li>
            </ul>
            <p>
              我们有权暂停或终止提供重复注册、虚假信息或违反本条款的账户。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>用户内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>您保留所有权</strong>：您上传、输入或通过本服务生成的简历内容（以下简称“用户内容”）的知识产权归您所有。我们不会主张对您的内容的任何所有权。
            </p>
            <p>
              <strong>使用许可</strong>：为了提供本服务，您授予我们一项全球性、免版税、非独占的许可，以存储、处理、展示用户内容，并仅在必要时与第三方服务提供商共享（例如云存储、AI 模型接口）。该许可仅用于运营、改进和保护本服务。
            </p>
            <p>
              <strong>内容责任</strong>：您保证用户内容不侵犯任何第三方的权利（包括版权、商标、隐私权等），且不包含非法、诽谤、骚扰、淫秽或有害信息。我们有权移除任何我们认为违反本条款或适用法律的内容。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>知识产权</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本服务及其原始内容（不包括用户内容）、功能、设计、模板、标识、源代码等，均受著作权、商标和其他知识产权法保护。未经我们明确书面许可，您不得复制、修改、分发、出售或利用任何部分。
            </p>
            <p>
              您可以使用我们提供的模板来创建您的简历，但不得将模板本身用于商业再分发或作为竞争产品的基础。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>免责声明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本服务按“现状”和“可用”提供，不附带任何明示或暗示的保证，包括但不限于对适销性、特定用途适用性、不侵权的保证。我们不保证本服务不间断、安全、无错误或符合您的期望。
            </p>
            <p>
              对于因使用或无法使用本服务而导致的任何直接、间接、附带、特殊、后果性或惩罚性损害，我们概不负责，即使已被告知可能发生此类损害。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>责任限制</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              在法律允许的最大范围内，我们对您的全部责任不超过您在过去12个月内为使用本服务而支付的费用（如适用）。如果您是免费用户，我们的责任上限为10美元。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>终止</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              您可随时停止使用本服务。我们可因任何理由或无故终止或暂停您的访问，包括但不限于违反本条款。终止后，您访问本服务的权利将立即停止，我们可能删除与您账户相关的用户内容（法律要求保留的除外）。
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>适用法律与争议解决</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本条款受中华人民共和国法律管辖。因本条款引起的或与之相关的任何争议，双方应首先通过友好协商解决；协商不成的，任何一方均可将争议提交至我们所在地有管辖权的人民法院诉讼解决。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>联系我们</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              如果您对本服务条款有任何疑问，请通过以下方式与我们联系：
            </p>
            <p className="mt-2">
              邮箱：<strong>legal@bynlk.cc</strong>
            </p>
            <p>
              地址：<strong>上海市浦东新区某某路123号</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}