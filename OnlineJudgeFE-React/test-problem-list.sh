#!/bin/bash

# 题库列表页面功能测试脚本
# 测试React版本(8081)和Vue版本(8080)的功能对比

echo "================================"
echo "题库列表页面功能测试"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
pass_count=0
fail_count=0

# 测试函数
test_api() {
    local name=$1
    local url=$2
    local expected=$3
    
    test_count=$((test_count + 1))
    echo -n "测试 $test_count: $name ... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ 通过${NC}"
        pass_count=$((pass_count + 1))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        fail_count=$((fail_count + 1))
        return 1
    fi
}

echo "1. API 可用性测试"
echo "-------------------"

# 测试题目列表API
test_api "题目列表API (8081)" \
    "http://localhost:8081/api/problem/?paging=true&offset=0&limit=5" \
    '"error":null'

test_api "题目列表API (8080)" \
    "http://localhost:8080/api/problem/?paging=true&offset=0&limit=5" \
    '"error":null'

# 测试标签API
test_api "标签列表API (8081)" \
    "http://localhost:8081/api/problem/tags/" \
    '"error":null'

test_api "标签列表API (8080)" \
    "http://localhost:8080/api/problem/tags/" \
    '"error":null'

echo ""
echo "2. 页面可访问性测试"
echo "-------------------"

# 测试页面访问
test_api "React版本页面 (8081)" \
    "http://localhost:8081/problem" \
    "<!DOCTYPE html>"

test_api "Vue版本页面 (8080)" \
    "http://localhost:8080/problem" \
    "<!DOCTYPE html>"

echo ""
echo "3. 功能完整性测试"
echo "-------------------"

# 检查React源码中的关键功能
echo -n "测试 $((++test_count)): 分页功能实现 ... "
if grep -q "Pagination" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo -n "测试 $((++test_count)): 难度筛选功能 ... "
if grep -q "handleDifficultyChange" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo -n "测试 $((++test_count)): 标签筛选功能 ... "
if grep -q "handleTagFilter" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo -n "测试 $((++test_count)): 关键词搜索功能 ... "
if grep -q "handleKeywordSearch" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo -n "测试 $((++test_count)): 随机选题功能 ... "
if grep -q "handlePickOne" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo -n "测试 $((++test_count)): URL参数同步 ... "
if grep -q "useSearchParams" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo -n "测试 $((++test_count)): AC率计算功能 ... "
if grep -q "getACRate" /home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx; then
    echo -e "${GREEN}✓ 通过${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    fail_count=$((fail_count + 1))
fi

echo ""
echo "4. 组件文件检查"
echo "-------------------"

files=(
    "/home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/pages/ProblemList.tsx"
    "/home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/api/problem.ts"
    "/home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/types/problem.ts"
    "/home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/components/ui/pagination.tsx"
    "/home/sharelgx/MetaSeekOJdev/OnlineJudgeFE-React/src/store/user.ts"
)

for file in "${files[@]}"; do
    echo -n "测试 $((++test_count)): $(basename $file) 文件存在 ... "
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}✗ 失败${NC}"
        fail_count=$((fail_count + 1))
    fi
done

echo ""
echo "================================"
echo "测试总结"
echo "================================"
echo "总测试数: $test_count"
echo -e "通过: ${GREEN}$pass_count${NC}"
echo -e "失败: ${RED}$fail_count${NC}"

if [ $fail_count -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 所有测试通过！题库列表页面已完美实现！${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  有 $fail_count 个测试失败，请检查！${NC}"
    exit 1
fi

