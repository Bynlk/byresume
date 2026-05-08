// 测试PDF导出修复 - 包含项目经历
const http = require('http');

// 包含项目经历的测试数据
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
        experience: [{
            id: "1",
            company: "某科技公司",
            position: "前端开发实习生",
            startDate: "2024.07",
            endDate: "2024.10",
            description: "<p>负责公司官网的前端开发和维护</p><p>使用React和TypeScript重构旧代码</p>"
        }],
        education: [{
            id: "1",
            school: "东莞城市学院",
            degree: "本科",
            field: "计算机科学与技术",
            startDate: "2023.9",
            endDate: "2027.6",
            description: "<p><strong>主修课程</strong>：数据结构、计算机网络、Web前端开发技术</p>"
        }],
        skills: [{
            id: "core-1",
            name: "JavaScript (ES6+)",
            level: 4,
            category: "编程语言"
        }, {
            id: "core-2",
            name: "TypeScript",
            level: 4,
            category: "编程语言"
        }],
        projects: [{
            id: "1",
            name: "ByResume 智能简历编辑器",
            description: "<p>独立设计并开发基于 Next.js 14 的智能简历编辑器</p><p>• 实现实时预览、多模板切换、PDF导出等核心功能</p><p>• 集成TipTap富文本编辑器，支持拖拽排序</p>",
            technologies: ["Next.js 14", "React", "TypeScript", "Tailwind CSS"],
            startDate: "2025.11",
            endDate: "至今",
            link: "https://bynlk.cc/byresume"
        }, {
            id: "2",
            name: "个人技术作品集网站",
            description: "<p>展示个人技术能力与项目成果的现代化作品集网站</p><p>• 使用Three.js创建交互式3D粒子背景</p><p>• 构建完整的博客系统，支持Markdown渲染</p>",
            technologies: ["React 18", "TypeScript", "Vite", "Three.js"],
            startDate: "2025.11",
            endDate: "至今",
            link: "https://bynlk.cc"
        }],
        customSections: [],
        styles: { fontFamily: "Inter", fontSize: 14 },
        templateId: "tpl-1",
        sectionOrder: ["personal", "experience", "projects", "education", "skills"],
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

console.log('正在测试包含项目经历的PDF导出...');

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
            
            // 保存文件供检查
            const fs = require('fs');
            fs.writeFileSync('test_with_projects.pdf', buffer);
            console.log('📄 文件已保存为 test_with_projects.pdf');
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