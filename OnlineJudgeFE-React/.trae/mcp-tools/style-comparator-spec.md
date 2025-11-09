# Style Comparator MCP Tool 规范

> **目的**: 自动化样式对比，实现像素级对齐的闭环  
> **状态**: 📝 设计阶段  
> **优先级**: P1 - 高优先级

---

## 🎯 工具概述

**名称**: style-comparator  
**描述**: 自动化样式对比工具 - 像素级对齐助手  
**位置**: `/home/sharelgx/MetaSeekOJdev/mcp-servers/style-comparator/`

---

## 🛠️ 工具列表

### 1. extract_page_styles
**描述**: 从指定URL提取页面所有关键样式

**参数**:
```json
{
  "url": "http://localhost:8080/problem",
  "selectors": {
    "body": "body",
    "container": ".content-app, [style*='padding']",
    "panel": ".ivu-card, [class*='card']",
    "table": "table",
    "tableHeader": "th",
    "tableCell": "td",
    "difficultyTags": ".ivu-tag, [class*='badge']",
    "buttons": "button, .ivu-btn"
  },
  "customChecks": [
    "checkDifficultyTagColors",
    "checkHoverEffects"
  ]
}
```

**返回**:
```json
{
  "url": "http://localhost:8080/problem",
  "timestamp": "2025-11-01T21:30:00Z",
  "styles": {
    "bodyBg": "rgb(238, 238, 238)",
    "containerPadding": "0px 2%",
    "tableFontSize": "16px",
    "difficultyTags": [
      {"text": "简单", "bg": "rgb(25, 190, 107)", "color": "rgb(255, 255, 255)"},
      {"text": "中等", "bg": "rgb(45, 140, 240)", "color": "rgb(255, 255, 255)"},
      {"text": "困难", "bg": "rgb(255, 153, 0)", "color": "rgb(255, 255, 255)"}
    ]
  }
}
```

---

### 2. compare_styles
**描述**: 对比两个页面的样式报告

**参数**:
```json
{
  "report8080": { /* extract_page_styles的返回 */ },
  "report8081": { /* extract_page_styles的返回 */ },
  "tolerance": 0  // 容忍度，0表示必须完全一致
}
```

**返回**:
```json
{
  "totalChecks": 50,
  "differences": [
    {
      "key": "tableFontSize",
      "expected": "16px",
      "actual": "14px",
      "severity": "high",
      "impact": "字体大小不一致"
    }
  ],
  "matches": 45,
  "matchRate": "90%",
  "level": "Level 2",  // Level 1/2/3
  "recommendation": "需要修复 5 项差异才能达到 Level 3"
}
```

---

### 3. generate_fix_code
**描述**: 根据差异自动生成修复代码

**参数**:
```json
{
  "differences": [ /* compare_styles返回的差异 */ ],
  "targetFile": "src/pages/ProblemList.tsx",
  "targetFramework": "react"
}
```

**返回**:
```json
{
  "fixes": [
    {
      "file": "src/pages/ProblemList.tsx",
      "line": 315,
      "search": "<Table>",
      "replace": "<Table style={{ fontSize: '16px' }}>",
      "reason": "8080标准值为16px",
      "command": "search_replace"
    }
  ],
  "estimatedTime": "15分钟",
  "riskLevel": "low"
}
```

---

### 4. verify_alignment
**描述**: 验证页面是否达到Level 3标准

**参数**:
```json
{
  "url8080": "http://localhost:8080/problem",
  "url8081": "http://localhost:8081/problem",
  "requireLevel": 3
}
```

**返回**:
```json
{
  "passed": true,
  "level": 3,
  "differences": 0,
  "matchRate": "100%",
  "report": "所有样式完全匹配",
  "screenshots": {
    "comparison": "base64_encoded_image"
  }
}
```

---

### 5. create_snapshot_doc
**描述**: 自动生成快照文档

**参数**:
```json
{
  "pageName": "ProblemList",
  "styleReport": { /* extract_page_styles的返回 */ },
  "verificationResults": { /* verify_alignment的返回 */ }
}
```

**返回**:
```json
{
  "documentPath": ".trae/documents/ProblemList-恢复快照-2025.md",
  "content": "# ProblemList 恢复快照 - 2025\n\n## 关键样式值...",
  "created": true
}
```

---

## 🔄 完整工作流

### 使用 MCP 工具的标准流程

```python
# Agent 接到页面改造任务后

# 1. 提取8080样式（标准）
report8080 = await mcp.call('extract_page_styles', {
    'url': 'http://localhost:8080/problem',
    'selectors': STANDARD_SELECTORS
})

# 2. 开发React页面（初版）
# ... Agent 完成基本功能开发 ...

# 3. 提取8081样式（当前）
report8081 = await mcp.call('extract_page_styles', {
    'url': 'http://localhost:8081/problem',
    'selectors': STANDARD_SELECTORS
})

# 4. 对比差异
comparison = await mcp.call('compare_styles', {
    'report8080': report8080,
    'report8081': report8081,
    'tolerance': 0
})

# 5. 生成修复代码
fixes = await mcp.call('generate_fix_code', {
    'differences': comparison['differences'],
    'targetFile': 'src/pages/ProblemList.tsx',
    'targetFramework': 'react'
})

# 6. 应用修复
for fix in fixes['fixes']:
    await apply_fix(fix)
    
# 7. 验证结果
verification = await mcp.call('verify_alignment', {
    'url8080': 'http://localhost:8080/problem',
    'url8081': 'http://localhost:8081/problem',
    'requireLevel': 3
})

# 8. 创建快照
if verification['passed']:
    snapshot = await mcp.call('create_snapshot_doc', {
        'pageName': 'ProblemList',
        'styleReport': report8080,
        'verificationResults': verification
    })
```

---

## 🏗️ 实现计划

### Phase 1: HTML版本（当前）
- ✅ 已完成：`public/auto-style-compare.html`
- 使用 iframe 和 JavaScript
- 手动在浏览器中运行

### Phase 2: Python MCP 服务器
- 使用 Playwright 自动化浏览器
- 实现所有 5 个工具
- 集成到 `.cursor/mcp.json`

### Phase 3: 增强功能
- 添加截图对比
- 添加响应式测试
- 添加性能对比
- 生成可视化报告

---

## 💻 Python 服务器实现示例

```python
# /home/sharelgx/MetaSeekOJdev/mcp-servers/style-comparator/server.py

import asyncio
import json
from playwright.async_api import async_playwright
from mcp.server import Server
from mcp.types import Tool, TextContent

app = Server("style-comparator")

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="extract_page_styles",
            description="提取页面样式",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string"},
                    "selectors": {"type": "object"}
                }
            }
        ),
        # ... 其他工具
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "extract_page_styles":
        return await extract_styles(
            arguments["url"],
            arguments.get("selectors", {})
        )
    # ... 其他工具调用

async def extract_styles(url: str, selectors: dict):
    """提取页面样式"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until='networkidle')
        
        # JavaScript提取样式
        styles = await page.evaluate('''
            () => {
                const report = {};
                
                // Body
                report.bodyBg = getComputedStyle(document.body).backgroundColor;
                
                // Table
                const table = document.querySelector('table');
                if (table) {
                    const s = getComputedStyle(table);
                    report.tableFontSize = s.fontSize;
                }
                
                // ... 更多提取逻辑
                
                return report;
            }
        ''')
        
        await browser.close()
        return [TextContent(type="text", text=json.dumps(styles, indent=2))]

if __name__ == "__main__":
    import mcp.server.stdio
    mcp.server.stdio.run(app)
```

---

## 🎯 预期效果

使用此工具后，Agent可以：

1. **5分钟** 自动发现所有样式差异
2. **30分钟** 完成所有修复
3. **100%** 达到 Level 3 标准
4. **0** 遗漏任何细节

从 **"不知道哪里不对"** 到 **"精确知道每一个差异点"**！

---

**记住**: 这个工具是达到 Level 3 的关键武器！ 🚀


