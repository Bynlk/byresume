# PDF 导出系统改进

## 概述

此目录包含改进的PDF导出系统，旨在解决预览与PDF导出之间的样式、布局和分页差异问题。

## 主要改进

### 1. 像素级一致性
- **增强的html2canvas配置**：使用更高的缩放比例（scale: 3）和DPI（300）以获得更清晰的图像
- **样式修复工具**：自动修复CSS样式问题，确保Tailwind CSS类、渐变、阴影等正确渲染
- **字体预加载**：确保所有字体在PDF生成前已加载完成

### 2. 智能分页系统
- **基于内容的分页**：不再简单分割图像，而是基于DOM元素高度进行智能分页
- **避免不良分页**：自动避免在标题、表格、简历项目等元素中间分页
- **多页支持**：当内容超过单页时，自动创建多个A4页面

### 3. 样式和布局修复
- **Flexbox修复**：解决html2canvas中flex布局的渲染问题
- **渐变和阴影增强**：确保CSS渐变和阴影在PDF中正确显示
- **边框和圆角修复**：增强边框和圆角的可见性
- **字体渲染优化**：应用字体平滑和抗锯齿

## 文件结构

- `exportPdf.ts` - 主导出文件（向后兼容）
- `exportPdfEnhanced.ts` - 增强的PDF导出函数
- `styleFixer.ts` - 样式修复工具

## 使用方法

### 基本用法（向后兼容）
```typescript
import { exportToPdf } from '@/lib/pdf/exportPdf'

// 与之前相同的API
await exportToPdf('resume-preview', 'my-resume.pdf')
```

### 高级用法
```typescript
import { exportToPdfEnhanced } from '@/lib/pdf/exportPdf'

await exportToPdfEnhanced('resume-preview', {
  fileName: 'my-resume.pdf',
  scale: 3, // 更高的缩放比例以获得更好的质量
  dpi: 300, // 更高的DPI
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  pageBreakAvoid: ['h1', 'h2', 'table', '.resume-item']
})
```

### 样式修复
```typescript
import { applyPdfStyleFixes, preloadFonts, waitForImages } from '@/lib/pdf/exportPdf'

// 在导出前应用样式修复
const restoreStyles = applyPdfStyleFixes('resume-preview')

// 预加载字体
await preloadFonts()

// 等待图像加载
await waitForImages(document.getElementById('resume-preview'))

try {
  // 执行PDF导出
  await exportToPdf('resume-preview', 'resume.pdf')
} finally {
  // 恢复原始样式
  restoreStyles()
}
```

## 技术细节

### 分页算法
1. 计算每个DOM元素的位置和高度
2. 检测元素是否跨越页面边界
3. 在合适的位置插入分页点
4. 避免在重要元素中间分页
5. 为每一页创建单独的canvas并导出到PDF

### 样式修复
- **Flex容器**：转换为block布局并模拟flex行为
- **Tailwind类**：确保CSS属性被正确应用
- **渐变背景**：确保渐变被html2canvas正确捕获
- **阴影和边框**：增强可见性以提高PDF质量

## 性能考虑

- **内存使用**：多页导出会创建多个canvas，可能增加内存使用
- **处理时间**：更高的缩放比例和DPI会增加处理时间
- **图像质量**：在质量和性能之间取得平衡

## 故障排除

### 常见问题
1. **PDF中缺少样式**：确保使用了`applyPdfStyleFixes`
2. **字体不正确**：使用`preloadFonts`预加载字体
3. **图像缺失**：使用`waitForImages`等待图像加载
4. **分页位置不佳**：调整`pageBreakAvoid`配置

### 调试
- 启用html2canvas的日志记录：`logging: true`
- 检查控制台错误
- 验证元素尺寸和位置计算

## 未来改进

1. **服务器端渲染**：使用Puppeteer进行更一致的PDF生成
2. **PDF/A兼容性**：支持PDF/A标准用于长期存档
3. **自定义页眉页脚**：允许用户添加自定义页眉页脚
4. **水印支持**：添加水印功能
5. **压缩优化**：减少PDF文件大小