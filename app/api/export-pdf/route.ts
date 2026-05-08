import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/types';
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    let browser = null;
    
    try {
        // 解析请求数据
        const body = await request.json();
        const resumeData = body.resumeData as ResumeData;
        
        if (!resumeData) {
            return NextResponse.json(
                { error: '缺少简历数据' },
                { status: 400 }
            );
        }

        // 获取基础URL
        const host = request.headers.get('host') || 'localhost:3001';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;

        // 启动Puppeteer浏览器 - Windows兼容配置
        console.log('正在启动Puppeteer浏览器...');
        
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            // Windows下的兼容性设置
            ignoreDefaultArgs: ['--disable-extensions'],
            defaultViewport: {
                width: 794,  // A4 width in pixels at 96 DPI
                height: 1123, // A4 height in pixels at 96 DPI
            }
        });

        console.log('浏览器启动成功');
        const page = await browser.newPage();

        // 构建渲染URL
        const dataParam = encodeURIComponent(JSON.stringify(resumeData));
        const renderUrl = `${baseUrl}/byresume/pdf-render?data=${dataParam}`;

        console.log('正在渲染PDF页面:', renderUrl.substring(0, 100) + '...');

        // 导航到渲染页面，等待网络空闲
        await page.goto(renderUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // 等待简历容器加载
        await page.waitForSelector('#resume-preview', { timeout: 10000 });

        // 等待所有字体加载完成
        await page.evaluate(() => document.fonts.ready);

        // 额外等待确保所有资源完全加载
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('页面渲染完成，开始生成PDF...');

        // 生成PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: false,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });

        console.log('PDF生成成功，大小:', pdfBuffer.length, 'bytes');

        // 关闭浏览器
        await browser.close();
        browser = null;

        // 返回PDF
        const fileName = `${resumeData.personalInfo.fullName || '简历'}_${new Date().toISOString().split('T')[0]}.pdf`;
        const encodedFileName = encodeURIComponent(fileName);
        
        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`
            }
        });

    } catch (error) {
        console.error('PDF生成失败:', error);
        
        // 确保浏览器被关闭
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('关闭浏览器失败:', closeError);
            }
        }
        
        return NextResponse.json(
            { 
                error: 'PDF生成失败',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}