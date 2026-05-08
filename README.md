# ByResume - AI 智能简历编辑器

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**现代化智能简历编辑器，结合拖拽排序、富文本编辑与 AI 优化，助你轻松创建专业简历。**

[在线演示](https://bynlk.cc/byresume) · [报告问题](https://github.com/Bynlk/ByResume/issues) · [功能建议](https://github.com/Bynlk/ByResume/issues)

</div>

---

## 核心功能

### 智能编辑体验

- **拖拽排序** — 基于 @dnd-kit 的直观拖拽，自由调整模块顺序
- **富文本编辑** — TipTap 编辑器，支持粗体、斜体、下划线、链接等格式
- **实时预览** — 左侧编辑、右侧预览，所见即所得
- **8 种专业模板** — Modern、Classic、Creative、Minimal、Tech、Elegant、Professional、Modern Minimal
- **主题色切换** — 蓝色、翡翠绿、紫色、石板灰四套主题色

### AI 智能助手

- **多提供商支持** — OpenAI、DeepSeek、Anthropic Claude、自定义端点
- **上下文感知** — AI 自动读取当前简历内容，提供针对性优化建议
- **流式响应** — SSE 实时流式输出，体验流畅
- **快捷指令** — 一键分析简历、优化工作经历、检查语法错误

### PDF 导出

- **Puppeteer 渲染** — 与预览 100% 一致的高质量 PDF 输出
- **中文字体支持** — 内置 Noto Sans SC 字体，自动下载机制
- **A4 标准** — 完美适配打印需求

### 数据管理

- **本地持久化** — Zustand + localStorage，刷新不丢失数据
- **JSON 导入/导出** — 支持简历数据备份与恢复
- **用户认证** — NextAuth v4 + JWT，支持注册登录
- **管理后台** — 统计面板、用户反馈管理

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/Bynlk/ByResume.git
cd ByResume

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，设置 DATABASE_URL、NEXTAUTH_SECRET 等

# 4. 初始化数据库
npx prisma migrate dev

# 5. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000/byresume](http://localhost:3000/byresume) 查看应用。

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (端口 3000) |
| `npm run build` | 构建生产版本（含字体下载） |
| `npm run start` | 启动生产服务器 (端口 3001) |
| `npm run lint` | ESLint 检查 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run format` | Prettier 格式化 |
| `npx prisma migrate dev` | 数据库迁移 |
| `npx prisma db seed` | 数据库种子数据 |

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 状态管理 | Zustand |
| 拖拽 | @dnd-kit |
| 富文本 | TipTap |
| PDF 导出 | Puppeteer |
| 认证 | NextAuth v4 |
| 数据库 | SQLite + Prisma ORM |
| UI 组件 | Radix UI, Lucide React |
| 动画 | Framer Motion |
| 图表 | Recharts |
| 通知 | Sonner |

---

## 项目结构

```
ByResume/
├── app/                        # Next.js App Router
│   ├── editor/                 # 简历编辑器
│   ├── pdf-render/             # PDF 渲染页面
│   ├── admin/                  # 管理后台
│   └── api/                    # API 路由
│       ├── export-pdf/         # PDF 导出
│       ├── ai/chat/            # AI 代理
│       ├── ai/test-connection/ # AI 连接测试
│       ├── auth/               # 认证
│       ├── feedback/           # 用户反馈
│       └── admin/              # 管理接口
├── components/
│   ├── editor/                 # 编辑器组件
│   ├── ui/                     # 基础 UI 组件
│   ├── admin/                  # 管理后台组件
│   └── providers/              # Context 提供者
├── lib/
│   ├── ai/aiService.ts         # AI 服务
│   ├── resume/                 # 模板引擎 + 8 套模板
│   ├── auth.ts                 # NextAuth 配置
│   └── db.ts                   # Prisma 单例
├── store/resumeStore.ts        # Zustand 状态管理
├── types/index.ts              # TypeScript 类型
├── prisma/schema.prisma        # 数据库 Schema
├── scripts/download-fonts.js   # 字体下载脚本
├── ecosystem.config.js         # PM2 配置
└── deploy.sh                   # 部署脚本
```

---

## 环境变量

参考 `.env.example`：

```env
# 数据库 (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# 管理后台密码（可选）
ADMIN_PASSWORD="your-admin-password"
```

> AI API Key 由用户在浏览器端自行配置，存储在 localStorage，不经过服务器。

---

## 部署

### PM2 部署

```bash
# 使用部署脚本
chmod +x deploy.sh
./deploy.sh

# 或手动部署
git pull origin main
npm install
npm run build
pm2 start ecosystem.config.js
```

PM2 配置：cluster 模式，端口 3001，最大内存限制 1G，日志输出到 `./logs/`。

---

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

<div align="center">

**如果这个项目对你有帮助，请给一个 Star 支持一下**

Made with ❤️ by [Bynlk](https://github.com/Bynlk)

</div>
