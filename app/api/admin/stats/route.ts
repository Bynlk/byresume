import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // 简单身份验证（可选）：检查管理员密钥
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 并行获取所有统计数据
    const [
      totalUsers,
      pdfExports,
      aiUsage,
      activeSessions,
      templateUsage,
      recentExports,
      recentAIUsage,
    ] = await Promise.all([
      db.user.count(),
      db.exportEvent.count(),
      db.aIUsageEvent.count(),
      db.sessionEvent.count({ where: { endedAt: null } }),
      db.templateUsage.groupBy({
        by: ["templateId"],
        _count: { templateId: true },
      }),
      db.exportEvent.findMany({
        take: 10,
        orderBy: { exportedAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
      db.aIUsageEvent.findMany({
        take: 10,
        orderBy: { usedAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
    ]);

    // 计算模板使用分布
    const templateDistribution = templateUsage.map((t: { templateId: string; _count: { templateId: number } }) => ({
      templateId: t.templateId,
      count: t._count.templateId,
    }));

    // 计算过去30天的趋势（简化）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const exportsLast30Days = await db.exportEvent.count({
      where: { exportedAt: { gte: thirtyDaysAgo } },
    });
    const aiUsageLast30Days = await db.aIUsageEvent.count({
      where: { usedAt: { gte: thirtyDaysAgo } },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        pdfExports,
        aiUsage,
        activeSessions,
        exportsLast30Days,
        aiUsageLast30Days,
      },
      templateDistribution,
      recentExports: recentExports.map((e: any) => ({
        id: e.id,
        exportedAt: e.exportedAt,
        format: e.format,
        userEmail: e.user?.email,
      })),
      recentAIUsage: recentAIUsage.map((a: any) => ({
        id: a.id,
        action: a.action,
        usedAt: a.usedAt,
        userEmail: a.user?.email,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}