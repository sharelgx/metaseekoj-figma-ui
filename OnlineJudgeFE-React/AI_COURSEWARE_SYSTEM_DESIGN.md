# 🤖 AI 智能课件生成系统 + 点卡充值方案

**版本**: v1.0  
**日期**: 2025-11-03  
**状态**: 设计方案

---

## 📋 系统概述

教师通过**AI对话**生成课件，无需了解Markdown格式或提示词设计。系统采用**点卡消费**模式，支持充值和消费规则配置。

### 核心特点
- 🤖 **AI对话式生成** - 教师只需自然语言描述需求
- 🎯 **零学习成本** - 无需学习Markdown或提示词
- 💰 **点卡消费模式** - 按使用量付费
- ⚙️ **灵活配置** - 管理员可配置充值和消费规则
- 🔄 **迭代优化** - AI辅助修改和完善

---

## 🎯 用户体验流程

### 教师端操作（极简流程）

```
步骤1：点击"AI生成课件"按钮
     ↓
步骤2：与AI对话
教师: "我需要一份C++循环结构的课件，45分钟，适合初中生"
AI: "好的！请问需要包含哪些内容？"
教师: "for循环、while循环、循环嵌套，要有代码示例和练习题"
AI: "明白了！正在为您生成... (消耗10点卡)"
     ↓
步骤3：预览生成结果
[显示幻灯片预览] [显示测试题占位符] [显示闪卡]
     ↓
步骤4：继续对话优化
教师: "第3页的代码太复杂了，简化一下"
AI: "好的，已为您简化... (消耗5点卡)"
     ↓
步骤5：保存并使用
[保存课件] [开始上课]
```

---

## 💰 点卡系统设计

### 1. 点卡模型

```sql
-- 用户点卡表
CREATE TABLE classroom_user_credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES account_user(id),
    total_credits INTEGER DEFAULT 0,        -- 总点卡（累计充值）
    available_credits INTEGER DEFAULT 0,    -- 可用点卡
    used_credits INTEGER DEFAULT 0,         -- 已使用点卡
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_user_credits UNIQUE(user_id)
);

-- 点卡交易记录表
CREATE TABLE classroom_credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES account_user(id),
    transaction_type VARCHAR(20) NOT NULL,  -- recharge(充值), consume(消费), refund(退款)
    amount INTEGER NOT NULL,                -- 金额（正数充值，负数消费）
    balance_before INTEGER NOT NULL,        -- 交易前余额
    balance_after INTEGER NOT NULL,         -- 交易后余额
    description TEXT,                       -- 描述
    related_type VARCHAR(50),               -- 关联类型（ai_generation, ai_edit等）
    related_id INTEGER,                     -- 关联ID
    operator_id INTEGER REFERENCES account_user(id),  -- 操作者（充值时可能是管理员）
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_type (transaction_type)
);

-- 点卡消费规则表
CREATE TABLE classroom_credit_rules (
    id SERIAL PRIMARY KEY,
    rule_type VARCHAR(50) NOT NULL,         -- 规则类型
    rule_name VARCHAR(200) NOT NULL,        -- 规则名称
    credits_required INTEGER NOT NULL,      -- 所需点卡
    description TEXT,                       -- 说明
    is_active BOOLEAN DEFAULT true,         -- 是否启用
    created_by INTEGER REFERENCES account_user(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_rule_type UNIQUE(rule_type)
);

-- 充值套餐表
CREATE TABLE classroom_recharge_packages (
    id SERIAL PRIMARY KEY,
    package_name VARCHAR(100) NOT NULL,     -- 套餐名称
    credits_amount INTEGER NOT NULL,        -- 点卡数量
    price_yuan DECIMAL(10, 2) NOT NULL,     -- 价格（元）
    bonus_credits INTEGER DEFAULT 0,        -- 赠送点卡
    sort_order INTEGER DEFAULT 0,           -- 排序
    is_active BOOLEAN DEFAULT true,         -- 是否启用
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_sort (sort_order, is_active)
);
```

### 2. 消费规则配置

```python
# 默认消费规则
DEFAULT_CREDIT_RULES = {
    'ai_generate_course': {
        'name': 'AI生成完整课件',
        'credits': 10,
        'description': '生成包含幻灯片、测试题、闪卡的完整课件'
    },
    'ai_edit_course': {
        'name': 'AI编辑课件',
        'credits': 5,
        'description': '修改课件内容、调整结构等'
    },
    'ai_generate_flashcards': {
        'name': 'AI生成闪卡',
        'credits': 3,
        'description': '为课程生成闪卡集'
    },
    'ai_generate_questions': {
        'name': 'AI生成测试题',
        'credits': 2,
        'description': '生成选择题、判断题等'
    },
    'ai_optimize_code': {
        'name': 'AI优化代码示例',
        'credits': 3,
        'description': '优化课件中的代码示例'
    }
}
```

### 3. 充值套餐配置

```python
# 默认充值套餐
DEFAULT_RECHARGE_PACKAGES = [
    {
        'name': '体验套餐',
        'credits': 50,
        'price': 9.9,
        'bonus': 0,
        'description': '适合尝鲜使用'
    },
    {
        'name': '标准套餐',
        'credits': 200,
        'price': 29.9,
        'bonus': 20,
        'description': '赠送20点卡'
    },
    {
        'name': '专业套餐',
        'credits': 500,
        'price': 69.9,
        'bonus': 100,
        'description': '赠送100点卡，超值优惠'
    },
    {
        'name': '旗舰套餐',
        'credits': 1000,
        'price': 119.9,
        'bonus': 300,
        'description': '赠送300点卡，最划算'
    }
]
```

---

## 🏗️ 系统架构设计

### 前端架构

```
前端界面
├── AI对话窗口（ChatBox）
│   ├── 消息列表（用户 + AI）
│   ├── 输入框
│   ├── 点卡余额显示
│   └── 消费提示
│
├── 幻灯片预览区
│   ├── 实时预览生成的幻灯片
│   ├── 测试题占位符标记
│   └── 闪卡标记
│
├── 编辑工具栏
│   ├── 手动编辑Markdown
│   ├── 插入测试题
│   └── 调整顺序
│
└── 点卡管理
    ├── 余额查询
    ├── 充值入口
    └── 消费记录
```

### 后端架构

```
后端API
├── AI课件生成API
│   ├── POST /api/classroom/ai/chat/           # AI对话
│   ├── POST /api/classroom/ai/generate/       # 生成课件
│   ├── POST /api/classroom/ai/edit/           # 编辑课件
│   └── GET  /api/classroom/ai/history/:id/    # 对话历史
│
├── 点卡管理API
│   ├── GET  /api/classroom/credits/balance/   # 查询余额
│   ├── POST /api/classroom/credits/consume/   # 消费点卡
│   ├── GET  /api/classroom/credits/history/   # 消费记录
│   └── POST /api/admin/credits/recharge/      # 充值（管理员）
│
├── 充值管理API（管理员）
│   ├── GET  /api/admin/credits/packages/      # 套餐列表
│   ├── POST /api/admin/credits/packages/      # 创建套餐
│   ├── PUT  /api/admin/credits/packages/:id/  # 修改套餐
│   └── POST /api/admin/credits/manual-recharge/ # 手动充值
│
└── 消费规则API（管理员）
    ├── GET  /api/admin/credits/rules/         # 规则列表
    ├── POST /api/admin/credits/rules/         # 创建规则
    └── PUT  /api/admin/credits/rules/:id/     # 修改规则
```

---

## 🤖 AI对话生成流程

### 前端：AI对话组件

```tsx
// AICoursewizard.tsx
export function AICoursewizard({ courseId, onSuccess }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [credits, setCredits] = useState(0)
  const [generatedMarkdown, setGeneratedMarkdown] = useState('')
  const [previewSlides, setPreviewSlides] = useState([])

  // 加载点卡余额
  useEffect(() => {
    loadCredits()
  }, [])

  const loadCredits = async () => {
    const data = await getCredits()
    setCredits(data.available_credits)
  }

  // 发送消息
  const handleSend = async () => {
    if (!input.trim()) return

    // 检查点卡余额
    if (credits < 10) {
      toast.error('点卡余额不足！请充值后继续使用')
      return
    }

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setIsGenerating(true)

    try {
      // 调用AI API
      const response = await chatWithAI({
        course_id: courseId,
        message: input,
        history: messages
      })

      // AI 响应
      const aiMessage = {
        role: 'assistant',
        content: response.message,
        credits_used: response.credits_used
      }
      setMessages([...messages, userMessage, aiMessage])

      // 更新余额
      setCredits(credits - response.credits_used)

      // 如果生成了Markdown
      if (response.markdown) {
        setGeneratedMarkdown(response.markdown)
        
        // 解析预览
        const slides = await parseMarkdown(response.markdown)
        setPreviewSlides(slides)
      }

      toast.success(`已消耗 ${response.credits_used} 点卡`)
    } catch (error: any) {
      toast.error('生成失败：' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>🤖 AI 课件助手</span>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base">
                💰 余额：{credits} 点卡
              </Badge>
              <Button size="sm" variant="outline" onClick={handleRecharge}>
                充值
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 h-full">
          {/* 左侧：AI对话 */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#F5F7FA] rounded-lg">
              {messages.length === 0 && (
                <div className="text-center text-[#737373] py-10">
                  <h3 className="text-lg font-semibold mb-2">👋 你好！我是AI课件助手</h3>
                  <p className="text-sm">告诉我您需要什么样的课件，我来帮您生成</p>
                  
                  {/* 快速开始示例 */}
                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-semibold">💡 快速开始：</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setInput('我需要一份C++循环结构的课件，45分钟，适合初中生')}
                    >
                      C++循环结构课件
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setInput('生成Python列表和字典的课件，40分钟，零基础')}
                    >
                      Python列表和字典
                    </Button>
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white'
                        : 'bg-white text-[#525252] border'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.credits_used && (
                      <div className="mt-2 text-xs opacity-80">
                        消耗 {msg.credits_used} 点卡
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg border">
                    <Loader2 className="h-5 w-5 animate-spin text-[#3DBAFB]" />
                    <span className="ml-2 text-[#737373]">AI 正在思考...</span>
                  </div>
                </div>
              )}
            </div>

            {/* 输入框 */}
            <div className="mt-4 flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="描述您需要的课件，或要求修改的内容..."
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9]"
              >
                发送
              </Button>
            </div>

            {/* 消费提示 */}
            <div className="mt-2 text-xs text-[#737373] text-center">
              💰 生成课件消耗 10 点卡，编辑修改消耗 5 点卡
            </div>
          </div>

          {/* 右侧：实时预览 */}
          <div className="flex flex-col h-full">
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <TabsList>
                <TabsTrigger value="preview">📄 幻灯片预览</TabsTrigger>
                <TabsTrigger value="markdown">📝 Markdown源码</TabsTrigger>
                <TabsTrigger value="stats">📊 统计</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="flex-1 overflow-y-auto">
                {previewSlides.length > 0 ? (
                  <div className="space-y-4">
                    {previewSlides.map((slide, index) => (
                      <Card key={index} className="p-4">
                        <Badge className="mb-2">第 {index + 1} 页</Badge>
                        <div dangerouslySetInnerHTML={{ __html: slide.content }} />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-[#737373] py-10">
                    暂无预览，请与AI对话生成课件
                  </div>
                )}
              </TabsContent>

              <TabsContent value="markdown" className="flex-1">
                <pre className="p-4 bg-[#2d2d2d] text-[#f8f8f2] rounded overflow-auto h-full text-sm">
                  {generatedMarkdown || '暂无内容'}
                </pre>
              </TabsContent>

              <TabsContent value="stats" className="flex-1">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-[#FFA726]">
                        {previewSlides.length}
                      </div>
                      <div className="text-sm text-[#737373]">页幻灯片</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-[#3DBAFB]">
                        {previewSlides.filter(s => s.has_question).length}
                      </div>
                      <div className="text-sm text-[#737373]">道测试题</div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!generatedMarkdown}
            className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9]"
          >
            ✅ 保存并生成幻灯片
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 🔌 后端API设计

### 1. AI对话API

```python
# classroom/views/ai_courseware.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.ai_providers.ai_manager import ai_manager
from classroom.models import CreditTransaction, CreditRule

class AICoursewareChat(APIView):
    """AI课件对话API"""
    
    def post(self, request):
        """
        POST /api/classroom/ai/chat/
        
        请求：
        {
            "course_id": 1,
            "message": "我需要一份C++循环结构的课件",
            "history": [
                {"role": "user", "content": "..."},
                {"role": "assistant", "content": "..."}
            ]
        }
        
        响应：
        {
            "message": "好的！正在为您生成...",
            "markdown": "...",
            "credits_used": 10,
            "credits_remaining": 90
        }
        """
        user = request.user
        course_id = request.data.get('course_id')
        message = request.data.get('message')
        history = request.data.get('history', [])
        
        # 1. 检查点卡余额
        credits = get_user_credits(user)
        required_credits = get_required_credits('ai_generate_course')
        
        if credits.available_credits < required_credits:
            return Response({
                'error': '点卡余额不足',
                'required': required_credits,
                'available': credits.available_credits
            }, status=status.HTTP_402_PAYMENT_REQUIRED)
        
        # 2. 判断用户意图
        intent = analyze_user_intent(message, history)
        
        if intent == 'generate_new':
            # 生成新课件
            result = generate_courseware_with_ai(message, course_id, user)
            credits_used = required_credits
        elif intent == 'edit_existing':
            # 编辑现有课件
            result = edit_courseware_with_ai(message, history, user)
            credits_used = get_required_credits('ai_edit_course')
        else:
            # 普通对话（免费）
            result = chat_with_ai(message, history)
            credits_used = 0
        
        # 3. 消费点卡
        if credits_used > 0:
            consume_credits(
                user=user,
                amount=credits_used,
                description=f"AI生成课件：{message[:50]}...",
                related_type='ai_courseware_generation'
            )
        
        # 4. 返回结果
        return Response({
            'message': result['message'],
            'markdown': result.get('markdown'),
            'slides_preview': result.get('slides'),
            'credits_used': credits_used,
            'credits_remaining': credits.available_credits - credits_used
        })


def generate_courseware_with_ai(user_message, course_id, user):
    """使用AI生成课件"""
    
    # 1. 构造系统提示词（隐藏在后台）
    system_prompt = """
你是MetaSeekOJ智慧课堂的专业课件生成助手。

请严格按照以下Markdown格式生成课件：

【元信息】
---
title: 课程标题
language: cpp | python | scratch
difficulty: beginner | intermediate | advanced
duration: 数字（分钟）
author: 教师姓名
tags: [标签数组]
---

【测试题占位符】
<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: 描述]
占位符说明（不要写具体选项）
<!-- /question -->

【闪卡】
<!-- flashcards:batch -->
### 概念名称
概念解释
示例：`代码`
<!-- flashcards:end -->

请根据用户需求生成课件。
"""
    
    # 2. 调用AI Manager
    response = ai_manager.generate_completion(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        model="openai/gpt-4o-mini",
        max_tokens=3000
    )
    
    # 3. 提取Markdown
    markdown_content = extract_markdown_from_response(response)
    
    # 4. 解析Markdown
    parsed = parse_markdown(markdown_content)
    
    return {
        'message': f"✅ 课件生成成功！共{len(parsed['slides'])}页幻灯片",
        'markdown': markdown_content,
        'slides': parsed['slides'],
        'questions': parsed['questions'],
        'flashcards': parsed['flashcards']
    }
```

### 2. 点卡管理API

```python
# classroom/views/credits.py
class UserCreditsView(APIView):
    """用户点卡管理"""
    
    def get(self, request):
        """
        GET /api/classroom/credits/balance/
        
        响应：
        {
            "total_credits": 100,
            "available_credits": 85,
            "used_credits": 15
        }
        """
        credits = UserCredits.objects.get_or_create(
            user=request.user,
            defaults={'available_credits': 0}
        )[0]
        
        return Response({
            'total_credits': credits.total_credits,
            'available_credits': credits.available_credits,
            'used_credits': credits.used_credits
        })
    
    def post(self, request):
        """
        POST /api/classroom/credits/consume/
        
        请求：
        {
            "rule_type": "ai_generate_course",
            "description": "生成C++循环课件"
        }
        """
        rule_type = request.data.get('rule_type')
        description = request.data.get('description')
        
        # 获取规则
        rule = CreditRule.objects.get(rule_type=rule_type, is_active=True)
        
        # 消费点卡
        transaction = consume_credits(
            user=request.user,
            amount=rule.credits_required,
            description=description,
            related_type=rule_type
        )
        
        return Response({
            'success': True,
            'credits_used': rule.credits_required,
            'balance': transaction.balance_after
        })


class CreditTransactionHistoryView(APIView):
    """点卡交易历史"""
    
    def get(self, request):
        """
        GET /api/classroom/credits/history/
        
        响应：交易记录列表
        """
        transactions = CreditTransaction.objects.filter(
            user=request.user
        ).order_by('-created_at')[:50]
        
        return Response([{
            'id': t.id,
            'type': t.transaction_type,
            'amount': t.amount,
            'description': t.description,
            'balance_after': t.balance_after,
            'created_at': t.created_at
        } for t in transactions])
```

### 3. 管理员API（充值和规则配置）

```python
# classroom/admin_views/credits_admin.py
class ManualRechargeView(APIView):
    """管理员手动充值"""
    permission_classes = [IsSuperAdmin]
    
    def post(self, request):
        """
        POST /api/admin/credits/recharge/
        
        请求：
        {
            "user_id": 123,
            "credits": 100,
            "description": "系统赠送"
        }
        """
        user_id = request.data.get('user_id')
        credits = request.data.get('credits')
        description = request.data.get('description', '管理员充值')
        
        # 充值
        transaction = recharge_credits(
            user_id=user_id,
            amount=credits,
            description=description,
            operator=request.user
        )
        
        return Response({
            'success': True,
            'user_id': user_id,
            'credits_added': credits,
            'new_balance': transaction.balance_after
        })


class CreditRulesView(APIView):
    """消费规则管理"""
    permission_classes = [IsSuperAdmin]
    
    def get(self, request):
        """GET /api/admin/credits/rules/ - 获取所有规则"""
        rules = CreditRule.objects.all()
        return Response([{
            'id': r.id,
            'rule_type': r.rule_type,
            'rule_name': r.rule_name,
            'credits_required': r.credits_required,
            'description': r.description,
            'is_active': r.is_active
        } for r in rules])
    
    def post(self, request):
        """POST /api/admin/credits/rules/ - 创建规则"""
        rule = CreditRule.objects.create(
            rule_type=request.data['rule_type'],
            rule_name=request.data['rule_name'],
            credits_required=request.data['credits_required'],
            description=request.data.get('description', ''),
            created_by=request.user
        )
        return Response({'id': rule.id, 'success': True})
    
    def put(self, request, pk):
        """PUT /api/admin/credits/rules/:id/ - 修改规则"""
        rule = CreditRule.objects.get(pk=pk)
        rule.credits_required = request.data.get('credits_required', rule.credits_required)
        rule.is_active = request.data.get('is_active', rule.is_active)
        rule.save()
        
        return Response({'success': True})
```

---

## ⚙️ 系统Prompt（后台隐藏）

### 生成新课件的系统Prompt

```python
COURSEWARE_GENERATION_SYSTEM_PROMPT = """
你是MetaSeekOJ智慧课堂的专业课件生成助手。

【格式规范】
1. 元信息（YAML）：
---
title: 课程标题
language: cpp | python | scratch
difficulty: beginner | intermediate | advanced
duration: 数字
author: 教师姓名
tags: [标签数组]
---

2. 内容结构：
- 使用 # 一级标题（课程总标题）
- 使用 ## 二级标题（知识点，自动分页）
- 代码块：```cpp 或 ```python

3. 测试题占位符：
<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: 描述]
占位符说明
<!-- /question -->

4. 闪卡批量生成：
<!-- flashcards:batch -->
### 概念名称
解释内容
示例代码
<!-- flashcards:end -->

【禁止事项】
❌ 不要在测试题标记里写A、B、C、D选项
❌ 不要使用 grade、subject、keywords 字段
❌ 闪卡不要用 Q/A 格式
❌ 分页不要用 ---

【生成要求】
- 根据用户描述的主题、难度、时长生成
- 至少3-5个代码示例
- 在3-4处插入测试题占位符
- 生成6-8张闪卡
- 每个知识点添加提示框
- 最后添加总结表格

请直接输出Markdown格式的课件。
"""
```

### 编辑课件的系统Prompt

```python
COURSEWARE_EDIT_SYSTEM_PROMPT = """
你是MetaSeekOJ智慧课堂的课件编辑助手。

用户会告诉你要修改课件的哪个部分，请根据要求修改，并保持Markdown格式不变。

修改类型：
- 简化代码示例
- 调整难度
- 增加/删除知识点
- 调整测试题位置
- 增加/删除闪卡

请直接输出修改后的完整Markdown课件。
"""
```

---

## 💳 充值系统设计

### 前端：充值页面

```tsx
// RechargeDialog.tsx
export function RechargeDialog({ open, onClose }) {
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    const data = await getRechargePackages()
    setPackages(data)
  }

  const handleRecharge = async () => {
    // 预留充值接口
    toast.info('充值功能开发中，请联系管理员手动充值')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>💰 点卡充值</DialogTitle>
          <DialogDescription>
            选择充值套餐，点卡可用于AI生成课件等功能
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id
                  ? 'border-[#3DBAFB] border-2 shadow-lg'
                  : 'border-[#e5e5e5] hover:border-[#3DBAFB]'
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{pkg.package_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-[#3DBAFB]">
                  {pkg.credits_amount}
                  {pkg.bonus_credits > 0 && (
                    <span className="text-sm text-[#8ED1A9]">
                      +{pkg.bonus_credits}
                    </span>
                  )}
                </div>
                <div className="text-sm text-[#737373]">点卡</div>
                <div className="text-2xl font-bold text-[#525252]">
                  ¥{pkg.price_yuan}
                </div>
                {pkg.bonus_credits > 0 && (
                  <Badge className="bg-[#FFA726] text-white text-xs">
                    赠 {pkg.bonus_credits} 点
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleRecharge}
            disabled={!selectedPackage}
            className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9]"
          >
            立即充值 ¥{selectedPackage?.price_yuan || 0}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 后端：充值接口（预留）

```python
# classroom/views/recharge.py
class RechargeCallbackView(APIView):
    """充值回调（预留）"""
    
    def post(self, request):
        """
        支付平台回调接口
        
        对接支付宝/微信支付时使用
        """
        # TODO: 验证支付签名
        # TODO: 更新用户点卡
        # TODO: 记录交易
        pass
```

---

## 🎯 管理员后台配置

### Django Admin 配置

```python
# classroom/admin.py
from django.contrib import admin
from .models import UserCredits, CreditTransaction, CreditRule, RechargePackage

@admin.register(UserCredits)
class UserCreditsAdmin(admin.ModelAdmin):
    list_display = ['user', 'available_credits', 'used_credits', 'total_credits', 'updated_at']
    search_fields = ['user__username', 'user__real_name']
    readonly_fields = ['total_credits', 'used_credits']
    
    actions = ['manual_recharge']
    
    def manual_recharge(self, request, queryset):
        """批量充值"""
        # 弹出表单让管理员输入充值金额
        pass
    manual_recharge.short_description = '手动充值'


@admin.register(CreditRule)
class CreditRuleAdmin(admin.ModelAdmin):
    list_display = ['rule_name', 'rule_type', 'credits_required', 'is_active', 'updated_at']
    list_filter = ['is_active']
    list_editable = ['credits_required', 'is_active']
    
    fieldsets = (
        ('基本信息', {
            'fields': ('rule_type', 'rule_name', 'description')
        }),
        ('消费设置', {
            'fields': ('credits_required', 'is_active')
        }),
    )


@admin.register(RechargePackage)
class RechargePackageAdmin(admin.ModelAdmin):
    list_display = ['package_name', 'credits_amount', 'price_yuan', 'bonus_credits', 'sort_order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['price_yuan', 'bonus_credits', 'sort_order', 'is_active']
    ordering = ['sort_order']
```

---

## 📊 点卡消费计算

### 消费规则建议

| 功能 | 点卡消耗 | 说明 |
|------|---------|------|
| AI生成完整课件 | **10点** | 包含幻灯片、测试题标记、闪卡 |
| AI编辑修改课件 | **5点** | 修改内容、调整结构 |
| AI生成单个闪卡集 | **3点** | 单独生成6-8张闪卡 |
| AI生成测试题 | **2点** | 生成选择题、判断题 |
| AI优化代码示例 | **3点** | 优化课件中的代码 |
| AI翻译课件 | **5点** | 中英文互译 |

### 充值套餐建议

| 套餐名称 | 点卡数量 | 赠送 | 价格 | 性价比 |
|---------|---------|------|------|--------|
| 体验套餐 | 50 | 0 | ¥9.9 | 5点/元 |
| 标准套餐 | 200 | +20 | ¥29.9 | 7.4点/元 |
| 专业套餐 | 500 | +100 | ¥69.9 | 8.6点/元 |
| 旗舰套餐 | 1000 | +300 | ¥119.9 | 10.8点/元 |

**计算逻辑**：
- 体验套餐：50÷9.9 = 5点/元
- 旗舰套餐：(1000+300)÷119.9 = 10.8点/元
- **买得越多越划算**

### 使用场景估算

**单个教师一学期使用量**：
- 每周2节课 × 15周 = 30节课
- 每节课生成1份课件 = 30 × 10点 = 300点
- 平均每份课件修改2次 = 30 × 2 × 5点 = 300点
- **合计**：600点卡
- **推荐套餐**：专业套餐（500+100=600点）或旗舰套餐

---

## 🔐 权限和安全

### 权限控制

```python
# 权限装饰器
@require_teacher_or_admin
@require_sufficient_credits(min_credits=10)
def ai_generate_courseware(request):
    # 生成课件
    pass
```

### 防滥用机制

```python
# 频率限制
RATE_LIMITS = {
    'ai_generate': {
        'calls_per_hour': 10,     # 每小时最多10次
        'calls_per_day': 50        # 每天最多50次
    },
    'ai_edit': {
        'calls_per_hour': 20,
        'calls_per_day': 100
    }
}

# Redis 记录调用次数
def check_rate_limit(user, action_type):
    key = f"rate_limit:{user.id}:{action_type}"
    count = redis_client.incr(key)
    if count == 1:
        redis_client.expire(key, 3600)  # 1小时过期
    
    limit = RATE_LIMITS[action_type]['calls_per_hour']
    if count > limit:
        raise RateLimitExceeded(f"超过频率限制：每小时{limit}次")
```

---

## 📱 完整用户界面设计

### AI课件生成页面

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI 课件助手             💰 余额：85点卡 [充值]     ✕   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌───────────────────┐  ┌───────────────────────────────┐  │
│ │ AI 对话           │  │ 📄 幻灯片预览                 │  │
│ ├───────────────────┤  ├───────────────────────────────┤  │
│ │                   │  │                               │  │
│ │ 👤 我需要一份C++  │  │ [幻灯片1：标题]               │  │
│ │    循环课件       │  │ [幻灯片2：for循环]            │  │
│ │                   │  │ [幻灯片3：测试题占位符]       │  │
│ │ 🤖 好的！请问：   │  │ [幻灯片4：while循环]          │  │
│ │    1. 课程时长？  │  │ ...                           │  │
│ │    2. 学生基础？  │  │                               │  │
│ │                   │  │ 统计：                         │  │
│ │ 👤 45分钟，初中生 │  │ 📄 10页幻灯片                 │  │
│ │                   │  │ ✏️ 3个测试题                  │  │
│ │ 🤖 正在生成...    │  │ 📚 8张闪卡                    │  │
│ │    (消耗10点卡)   │  │ 💻 5个代码示例                │  │
│ │                   │  │                               │  │
│ ├───────────────────┤  └───────────────────────────────┘  │
│ │ [输入框...]       │                                     │
│ │ [发送]            │                                     │
│ └───────────────────┘                                     │
│                                                             │
│ 💡 生成课件 10点卡 | 编辑修改 5点卡                      │
│                                                             │
│                          [取消] [保存并生成幻灯片]        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 开发任务清单

### Phase 1：数据库和后端API（1周）

- [ ] 创建点卡相关数据表（4个表）
- [ ] 实现点卡管理API（查询、消费、充值）
- [ ] 实现AI对话API（集成现有AI Manager）
- [ ] 实现Markdown解析器（Python）
- [ ] 配置默认消费规则
- [ ] 配置默认充值套餐

### Phase 2：前端核心功能（1周）

- [ ] AI对话组件（ChatBox）
- [ ] Markdown预览组件
- [ ] 幻灯片预览组件（Reveal.js集成）
- [ ] 点卡余额显示
- [ ] 消费记录页面

### Phase 3：管理员功能（3天）

- [ ] Django Admin配置
- [ ] 手动充值功能
- [ ] 消费规则配置界面
- [ ] 充值套餐配置界面
- [ ] 用户点卡管理

### Phase 4：支付集成（预留）

- [ ] 支付宝接口（预留）
- [ ] 微信支付接口（预留）
- [ ] 支付回调处理
- [ ] 订单管理

---

## 🔄 AI对话流程示例

### 示例1：生成新课件

```
教师: 帮我生成一份Python函数的课件

AI: 好的！请告诉我：
    1. 课程时长？（建议30-60分钟）
    2. 学生基础？（零基础/有编程经验）
    3. 重点内容？（函数定义/参数/返回值等）

教师: 40分钟，零基础学生，包含函数定义、参数、返回值

AI: 明白了！正在为您生成课件... 
    [消耗 10 点卡]
    
    ✅ 课件生成成功！
    - 📄 8页幻灯片
    - ✏️ 3个测试题占位符
    - 📚 6张闪卡
    - 💻 4个代码示例
    
    您可以预览右侧效果，或继续对话修改。

教师: 第3页的代码太复杂，简化一下

AI: 好的，正在为您简化...
    [消耗 5 点卡]
    
    ✅ 已简化第3页代码
    现在的代码更适合零基础学生理解。
```

### 示例2：修改现有课件

```
教师: 在while循环后面增加一个break语句的讲解

AI: 好的！正在为您添加...
    [消耗 5 点卡]
    
    ✅ 已添加break语句讲解
    位置：第5页，while循环之后
    包含：
    - break的作用
    - 代码示例
    - 使用场景

教师: 很好！再生成3道关于break的测试题

AI: 正在生成测试题...
    [消耗 2 点卡]
    
    ✅ 已生成3道测试题
    已插入到第6页
    题型：选择题
    难度：中等
```

---

## 💡 成本估算和定价策略

### AI API成本

| AI Provider | Model | 成本/1K tokens | 生成课件成本 |
|------------|-------|---------------|-------------|
| OpenRouter | GPT-4o Mini | $0.00015 | 约 $0.15 |
| OpenRouter | GPT-4o | $0.005 | 约 $5.00 |
| OpenRouter | Llama 3.1 8B | $0 (免费) | 免费 |
| 腾讯混元 | Hunyuan-Lite | ¥0.008/千tokens | 约 ¥0.80 |

**估算**：
- 生成一份完整课件（约10000 tokens）
- 使用GPT-4o Mini：$0.15 ≈ ¥1.05
- 售价10点卡 ≈ ¥2（假设1点卡=¥0.2）
- **毛利率**：约 50%

### 定价建议

**方案A：点卡单价 ¥0.20/点**
- 50点卡 = ¥10
- 生成1份课件(10点) = ¥2
- AI成本 ≈ ¥1
- 利润 ≈ ¥1

**方案B：套餐优惠**
- 体验套餐：50点 ¥9.9 (¥0.198/点)
- 标准套餐：220点(200+20赠) ¥29.9 (¥0.136/点) 
- 专业套餐：600点(500+100赠) ¥69.9 (¥0.117/点)
- 旗舰套餐：1300点(1000+300赠) ¥119.9 (¥0.092/点)

---

## 📁 文件结构

```
OnlineJudge/classroom/
├── models/
│   ├── credits.py              # 点卡模型
│   └── ai_courseware.py        # AI课件模型
├── views/
│   ├── ai_courseware.py        # AI生成API
│   ├── credits.py              # 点卡API
│   └── recharge.py             # 充值API（预留）
├── admin_views/
│   ├── credits_admin.py        # 管理员充值
│   └── rules_admin.py          # 规则配置
├── utils/
│   ├── markdown_parser.py      # Markdown解析器
│   ├── ai_prompt_builder.py    # Prompt构建器
│   └── credit_manager.py       # 点卡管理器
└── migrations/
    └── 000X_add_credits_system.py

OnlineJudgeFE-React/src/
├── components/classroom/
│   ├── AICoursewizard.tsx      # AI对话组件
│   ├── RechargeDialog.tsx      # 充值对话框
│   └── CreditBalance.tsx       # 余额显示
├── api/
│   ├── ai-courseware.ts        # AI课件API
│   └── credits.ts              # 点卡API
└── pages/creative-classroom/teacher/
    ├── AIGenerate.tsx          # AI生成页面
    └── SlidePreview.tsx        # 幻灯片预览
```

---

## ✅ 第一阶段交付标准

### 最小可用版本（MVP）

**功能清单**：
- ✅ AI对话生成课件（基础版）
- ✅ 点卡余额查询
- ✅ 点卡消费记录
- ✅ 管理员手动充值
- ✅ Markdown解析和预览
- ✅ 幻灯片生成和演示

**不包含**：
- ⏳ 在线支付（预留接口）
- ⏳ 点卡转赠
- ⏳ 发票管理

---

现在您可以访问幻灯片演示了：

```
http://localhost:8081/classroom/teacher/slide-preview
```

接下来我开始实现AI对话生成系统吗？还是您想先看看幻灯片效果？🚀

