#!/bin/bash

echo "================================"
echo "🔍 React Router 诊断脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. 检查文件存在性
echo "📁 1. 检查关键文件"
echo "-------------------"

files=(
    "src/App.tsx"
    "src/pages/HomeFigma.tsx"
    "src/pages/ProblemList.tsx"
    "src/components/layout/Navbar.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file 存在"
    else
        echo -e "${RED}✗${NC} $file 不存在"
    fi
done

echo ""

# 2. 检查路由配置
echo "🛣️  2. 检查路由配置"
echo "-------------------"

echo "App.tsx 中的路由："
grep -A 3 "Route path=" src/App.tsx | head -10

echo ""

# 3. 检查服务器状态
echo "🌐 3. 检查开发服务器"
echo "-------------------"

if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 8081 端口正在监听"
    echo "进程信息："
    ps aux | grep "vite.*8081" | grep -v grep | head -2
else
    echo -e "${RED}✗${NC} 8081 端口未监听"
fi

echo ""

# 4. 测试实际访问
echo "🔗 4. 测试页面访问"
echo "-------------------"

echo "测试 http://localhost:8081/ (首页):"
RESPONSE_HOME=$(curl -s http://localhost:8081/ | head -50)
if echo "$RESPONSE_HOME" | grep -q "<!DOCTYPE html>"; then
    echo -e "${GREEN}✓${NC} 首页可访问"
else
    echo -e "${RED}✗${NC} 首页无法访问"
fi

echo ""
echo "测试 http://localhost:8081/problem (题库):"
RESPONSE_PROBLEM=$(curl -s http://localhost:8081/problem | head -50)
if echo "$RESPONSE_PROBLEM" | grep -q "<!DOCTYPE html>"; then
    echo -e "${GREEN}✓${NC} /problem 可访问"
    echo "返回的页面标题："
    echo "$RESPONSE_PROBLEM" | grep -o "<title>.*</title>"
else
    echo -e "${RED}✗${NC} /problem 无法访问"
fi

echo ""

# 5. 检查是否是同一个HTML
echo "⚠️  5. 对比两个路由的HTML"
echo "-------------------"

HASH_HOME=$(echo "$RESPONSE_HOME" | md5sum | cut -d' ' -f1)
HASH_PROBLEM=$(echo "$RESPONSE_PROBLEM" | md5sum | cut -d' ' -f1)

if [ "$HASH_HOME" = "$HASH_PROBLEM" ]; then
    echo -e "${RED}✗ 问题：/ 和 /problem 返回完全相同的HTML！${NC}"
    echo "这是因为 Vite 对所有路由都返回同一个 index.html"
    echo "React Router 应该在客户端处理路由"
else
    echo -e "${GREEN}✓${NC} / 和 /problem 返回不同的HTML"
fi

echo ""

# 6. 检查 ProblemList 组件导出
echo "📦 6. 检查组件导出"
echo "-------------------"

if grep -q "export default.*ProblemList" src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓${NC} ProblemList 有默认导出"
else
    echo -e "${RED}✗${NC} ProblemList 缺少默认导出"
fi

if grep -q "import ProblemList" src/App.tsx; then
    echo -e "${GREEN}✓${NC} App.tsx 导入了 ProblemList"
else
    echo -e "${RED}✗${NC} App.tsx 未导入 ProblemList"
fi

echo ""

# 7. 创建浏览器测试脚本
echo "🌐 7. 生成浏览器测试脚本"
echo "-------------------"

cat > /tmp/test-routing.js << 'EOF'
// 在浏览器控制台运行此脚本
console.clear();
console.log('🔍 React Router 客户端诊断\n');

// 检查当前路由
console.log('📍 当前 URL:', window.location.href);
console.log('📍 当前路径:', window.location.pathname);

// 检查 root 元素
const root = document.getElementById('root');
console.log('\n📦 Root 元素:', root ? '存在' : '不存在');

if (root) {
    const rootText = root.textContent.substring(0, 200);
    console.log('Root 内容预览:', rootText);
    
    // 检查是否包含特定组件的标识
    const hasHero = rootText.includes('用 AI 助你') || rootText.includes('闯编程关卡');
    const hasProblemList = rootText.includes('题目列表') || rootText.includes('难度');
    
    console.log('\n🔍 页面内容检测:');
    console.log('  包含首页内容 (Hero):', hasHero ? '✓' : '✗');
    console.log('  包含题库内容 (ProblemList):', hasProblemList ? '✓' : '✗');
    
    if (window.location.pathname === '/problem' && hasHero && !hasProblemList) {
        console.error('\n❌ 问题：访问 /problem 但显示的是首页内容！');
        console.log('可能的原因：');
        console.log('1. React Router 没有正确渲染');
        console.log('2. 路由配置有问题');
        console.log('3. 组件导入失败');
    } else if (window.location.pathname === '/problem' && hasProblemList) {
        console.log('\n✅ 正确：/problem 显示题库内容');
    }
}

// 检查 React Router
console.log('\n📚 React Router 状态:');
try {
    // 尝试访问 React DevTools
    console.log('建议：安装 React DevTools 扩展来调试组件树');
} catch (e) {
    console.log('无法检测 React 状态');
}
EOF

echo -e "${GREEN}✓${NC} 已生成浏览器测试脚本: /tmp/test-routing.js"
echo ""
echo "请在浏览器访问 http://localhost:8081/problem"
echo "然后按 F12 打开开发者工具，在控制台运行："
echo -e "${YELLOW}$(cat /tmp/test-routing.js)${NC}"

echo ""

# 8. 检查编译错误
echo "🔨 8. 检查最近的编译日志"
echo "-------------------"

if [ -f "/tmp/vite-dev.log" ]; then
    echo "最近的 Vite 日志："
    tail -20 /tmp/vite-dev.log
else
    echo "未找到 Vite 日志文件"
fi

echo ""
echo "================================"
echo "💡 建议操作"
echo "================================"
echo ""
echo "1. 在浏览器中强制刷新（Ctrl+Shift+R 或 Cmd+Shift+R）"
echo "2. 清除浏览器缓存"
echo "3. 在浏览器控制台运行上面的测试脚本"
echo "4. 检查浏览器控制台是否有 JavaScript 错误"
echo ""
echo "如果问题依然存在，请提供浏览器控制台的错误信息"
echo ""

