import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, metadata } = body;

        if (!type) {
            return NextResponse.json(
                { success: false, message: 'Missing event type' },
                { status: 400 }
            );
        }

        // Save event to database based on type
        if (type === 'pdf_export') {
            await db.exportEvent.create({
                data: {
                    resumeId: metadata?.resumeId || 'unknown',
                    format: metadata?.format || 'pdf',
                },
            });
        } else if (type === 'ai_usage') {
            await db.aIUsageEvent.create({
                data: {
                    action: metadata?.action || 'unknown',
                    model: metadata?.model || null,
                },
            });
        } else if (type === 'template_usage') {
            await db.templateUsage.create({
                data: {
                    templateId: metadata?.templateId || 'unknown',
                },
            });
        }

        return NextResponse.json({ success: true, message: 'Event recorded' });
    } catch (error) {
        console.error('Error recording event:', error);
        return NextResponse.json(
            { success: false, message: 'Invalid request' },
            { status: 400 }
        );
    }
}