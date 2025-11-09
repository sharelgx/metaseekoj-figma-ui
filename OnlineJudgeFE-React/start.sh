#!/bin/bash

# MetaSeekOJ React前端启动脚本
# Agent 5 专用

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 启动 MetaSeekOJ React 前端                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo ""
fi

echo "🔧 配置信息:"
echo "  - 前端端口: 8081"
echo "  - 后端API: http://localhost:8086"
echo ""

echo "🌐 启动开发服务器..."
echo ""

npm run dev

