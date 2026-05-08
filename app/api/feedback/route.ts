import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 提交反馈
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      userId, 
      email, 
      type, 
      title, 
      content, 
      rating, 
      metadata 
    } = body;

    // 验证必填字段
    if (!type || !title || !content) {
      return NextResponse.json(
        { error: '缺少必填字段：type、title、content' },
        { status: 400 }
      );
    }

    // 验证类型
    const validTypes = ['bug', 'feature', 'suggestion', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type必须是以下值之一：${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // 验证评分范围
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'rating必须在1-5之间' },
        { status: 400 }
      );
    }

    // 创建反馈
    const feedback = await db.feedback.create({
      data: {
        userId: userId || null,
        email: email || null,
        type,
        title,
        content,
        rating: rating || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        status: 'pending'
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: '反馈提交成功',
        feedbackId: feedback.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('提交反馈时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取反馈列表（仅限管理员）
export async function GET(request: NextRequest) {
  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "czh666nb";
    const authHeader = request.headers.get("x-admin-password");
    if (authHeader !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const feedbacks = await db.feedback.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    const total = await db.feedback.count();

    return NextResponse.json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('获取反馈列表时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}