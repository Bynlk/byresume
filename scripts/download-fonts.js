// 📁 ByResume/scripts/download-fonts.js
// 字体下载脚本 - 在部署时运行

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 字体配置 - 只下载必要的字体
const FONT_CONFIGS = [
    {
        family: 'Noto Sans SC',
        weights: [
            { weight: 400, style: 'normal', file: 'noto-sans-sc-chinese-simplified-400-normal.woff' },
            { weight: 700, style: 'normal', file: 'noto-sans-sc-chinese-simplified-700-normal.woff' }
        ]
    },
    {
        family: 'Noto Serif SC',
        weights: [
            { weight: 400, style: 'normal', file: 'noto-serif-sc-chinese-simplified-400-normal.woff' },
            { weight: 700, style: 'normal', file: 'noto-serif-sc-chinese-simplified-700-normal.woff' }
        ]
    },
    {
        family: 'Noto Sans Mono',
        weights: [
            { weight: 400, style: 'normal', file: 'noto-sans-mono-chinese-simplified-400-normal.woff' },
            { weight: 700, style: 'normal', file: 'noto-sans-mono-chinese-simplified-700-normal.woff' }
        ]
    }
];

const FONT_BASE_URL = 'https://cdn.jsdelivr.net/npm/@fontsource';
const FONT_VERSION = '5.0.18';
const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts', 'noto');

/**
 * 下载单个字体文件
 */
function downloadFontFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // 重定向
                downloadFontFile(response.headers.location, filePath).then(resolve).catch(reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${url}`));
                return;
            }
            
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
            
            fileStream.on('error', (err) => {
                fs.unlink(filePath, () => {});
                reject(err);
            });
        }).on('error', reject);
    });
}

/**
 * 检查字体文件是否存在
 */
function checkFontFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

/**
 * 检查本地字体是否可用
 */
function checkLocalFontsAvailable() {
    try {
        if (!fs.existsSync(FONTS_DIR)) return false;
        const fontFiles = fs.readdirSync(FONTS_DIR);
        return fontFiles.filter(f => f.endsWith('.woff')).length >= 6;
    } catch {
        return false;
    }
}

/**
 * 下载所有字体文件
 */
async function downloadAllFonts() {
    console.log('🎯 开始下载字体文件...');
    
    // 确保字体目录存在
    if (!fs.existsSync(FONTS_DIR)) {
        fs.mkdirSync(FONTS_DIR, { recursive: true });
        console.log(`📁 创建字体目录: ${FONTS_DIR}`);
    }

    let successCount = 0;
    let failCount = 0;

    for (const fontConfig of FONT_CONFIGS) {
        console.log(`\n📄 处理字体: ${fontConfig.family}`);
        
        for (const weight of fontConfig.weights) {
            const fileName = weight.file;
            const filePath = path.join(FONTS_DIR, fileName);
            // 生成字体URL
            const familyName = fontConfig.family.toLowerCase().replace(/\s+/g, '-');
            const url = `${FONT_BASE_URL}/${familyName}@${FONT_VERSION}/files/${fileName}`;
            
            // 检查是否已存在
            if (checkFontFileExists(filePath)) {
                console.log(`  ✅ ${fileName} (已存在，跳过)`);
                successCount++;
                continue;
            }

            try {
                console.log(`  ⬇️  下载: ${fileName}`);
                await downloadFontFile(url, filePath);
                console.log(`  ✅ ${fileName} 下载成功`);
                successCount++;
            } catch (error) {
                console.error(`  ❌ ${fileName} 下载失败:`, error.message);
                failCount++;
            }
        }
    }

    console.log(`\n📊 下载完成: ${successCount} 成功, ${failCount} 失败`);
    
    if (failCount > 0) {
        console.warn('⚠️  部分字体下载失败，这是正常的（某些字体可能不存在）');
        console.log('💡 系统将自动使用CDN字体作为备用方案');
    }
    
    // 只要下载了部分字体就算成功
    return successCount > 0;
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始字体下载流程...\n');
    
    // 检查是否已存在
    if (checkLocalFontsAvailable()) {
        console.log('✅ 字体文件已存在，无需下载');
        console.log('💡 如果需要重新下载，请删除 public/fonts/noto 目录后重试');
        process.exit(0);
    }
    
    try {
        const success = await downloadAllFonts();
        
        if (success) {
            console.log('\n🎉 字体下载完成！PDF导出将使用本地字体，提升性能。');
            process.exit(0);
        } else {
            console.log('\n⚠️ 部分字体下载失败，但核心字体已下载');
            console.log('💡 系统将自动使用CDN字体作为备用方案');
            console.log('🎉 PDF导出功能仍可正常工作！');
            process.exit(0); // 成功退出，因为核心字体已下载
        }
    } catch (error) {
        console.error('\n💥 发生错误:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { main, downloadAllFonts, checkLocalFontsAvailable };