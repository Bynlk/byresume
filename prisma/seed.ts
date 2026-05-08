import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建测试用户
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
    },
  });

  // 创建简历
  const resume = await prisma.resume.upsert({
    where: { id: 'test-resume-1' },
    update: {},
    create: {
      id: 'test-resume-1',
      userId: user.id,
      title: '测试简历',
      content: JSON.stringify({ name: '测试' }),
    },
  });

  // 创建导出事件
  await prisma.exportEvent.create({
    data: { resumeId: resume.id, userId: user.id, format: 'pdf' },
  });
  await prisma.exportEvent.create({
    data: { resumeId: resume.id, userId: user.id, format: 'pdf' },
  });
  await prisma.exportEvent.create({
    data: { resumeId: resume.id, userId: user.id, format: 'png' },
  });

  // 创建AI使用事件
  await prisma.aIUsageEvent.create({
    data: { userId: user.id, action: 'generate', input: '写一段工作经历', output: '生成的文本' },
  });
  await prisma.aIUsageEvent.create({
    data: { userId: user.id, action: 'optimize', input: '优化描述', output: '优化后的文本' },
  });

  // 创建会话事件
  await prisma.sessionEvent.create({
    data: {
      userId: user.id,
      sessionId: 'session-1',
      startedAt: new Date(),
    },
  });

  // 创建模板使用
  await prisma.templateUsage.create({
    data: { templateId: 'tpl-1', userId: user.id, resumeId: resume.id },
  });
  await prisma.templateUsage.create({
    data: { templateId: 'tpl-2', userId: user.id },
  });
  await prisma.templateUsage.create({
    data: { templateId: 'tpl-1', userId: user.id },
  });

  console.log('种子数据已插入');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });