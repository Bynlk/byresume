#!/bin/bash

# ByResume 部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "🚀 开始部署 ByResume..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

echo -e "${BLUE}步骤 1: 拉取最新代码...${NC}"
git pull origin main

echo -e "${BLUE}步骤 2: 安装依赖...${NC}"
npm install

echo -e "${BLUE}步骤 3: 构建项目...${NC}"
npm run build

echo -e "${BLUE}步骤 4: 检查环境变量...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}警告: .env 文件不存在，请确保环境变量已正确配置${NC}"
    echo "可以复制 .env.example 并配置"
fi

echo -e "${BLUE}步骤 5: 创建日志目录...${NC}"
mkdir -p logs

echo -e "${BLUE}步骤 6: 重启 PM2 服务...${NC}"
# 停止现有服务
pm2 stop ecosystem.config.js || true

# 启动服务
pm2 start ecosystem.config.js

echo -e "${BLUE}步骤 7: 保存 PM2 配置...${NC}"
pm2 save

echo -e "${BLUE}步骤 8: 显示服务状态...${NC}"
pm2 status

echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "服务信息:"
echo "  - 名称: byresume"
echo "  - 端口: 3001"
echo "  - 日志: ./logs/"
echo ""
echo "常用命令:"
echo "  pm2 logs byresume      # 查看日志"
echo "  pm2 restart byresume   # 重启服务"
echo "  pm2 stop byresume      # 停止服务"
echo "  pm2 status             # 查看状态"