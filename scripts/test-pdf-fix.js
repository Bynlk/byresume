// 测试PDF导出修复
const https = require('https');
const http = require('http');

// 简单的测试数据
const testData = {
    resumeData: {
        personalInfo: {
            name: "陈晓杭",
            title: "前端开发实习生",
            email: "bynlkcc@gmail.com",
            phone: "17827504875",
            location: "东莞",
            summary: "对现代前端开发充满热情，具备扎实的HTML、CSS、JavaScript/TypeScript基础和良好的工程化思维。",
            links: [{ platform: "github", url: "Github/bynlk" }],
            fullName: "陈晓杭"
        },
        experience: [],
        education: [{
            id: "1",
            school: "东莞城市学院",
            degree: "本科",
            field: "计算机科学与技术",
            startDate: "2023.9",
            endDate: "2027.6",
            description: "<p><strong>主修课程</strong>：数据结构、计算机网络、Web前端开发技术、操作系统、数据库系统、计算机组成原理</p>"
        }],
        skills: [{
            id: "core-1",
            name: "JavaScript (ES6+)",
            level: 4,
            category: "编程语言"
        }],
        projects: [{
            id: "1",
            name: "ByResume 智能简历编辑器",
            description: "<p>独立设计并开发基于 Next.js 14 的智能简历编辑器</p>",
            technologies: ["Next.js 14", "React", "TypeScript"],
            startDate: "2025.11",
            endDate: "至今",
            link: "https://bynlk.cc/byresume"
        }],
        customSections: [],
        styles: { fontFamily: "Inter", fontSize: 14 },
        templateId: "tpl-1",
        sectionOrder: ["personal", "projects", "education", "skills"],
        themeColor: "blue"
    }
};

const options = {
    hostname: 'localhost',
    port: 3005,
    path: '/byresume/api/export-pdf',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testData))
    }
};

console.log('正在测试PDF导出修复...');

const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    
    let data = [];
    
    res.on('data', (chunk) => {
        data.push(chunk);
    });
    
    res.on('end', () => {
        const buffer = Buffer.concat(data);
        console.log(`接收到 ${buffer.length} 字节的数据`);
        
        if (buffer.length > 1000) {
            console.log('✅ PDF生成成功！文件大小:', buffer.length, '字节');
            
            // 检查PDF头部
            const header = buffer.slice(0, 10).toString();
            if (header.includes('%PDF')) {
                console.log('✅ PDF文件格式正确');
            } else {
                console.log('❌ PDF文件格式不正确');
            }
        } else {
            console.log('❌ PDF文件太小，可能生成失败');
            console.log('响应内容:', buffer.toString());
        }
    });
});

req.on('error', (e) => {
    console.error(`请求错误: ${e.message}`);
});

req.write(JSON.stringify(testData));
req.end();