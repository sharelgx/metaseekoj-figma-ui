import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

/**
 * Markdown转幻灯片 - 精简版
 * 
 * 功能：
 * 1. 输入Markdown文档
 * 2. 点击生成按钮
 * 3. 自动创建临时课程和文档
 * 4. 跳转到Figma幻灯片预览
 */
export default function MarkdownToSlides() {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!markdown.trim()) {
      toast.error('请输入Markdown内容');
      return;
    }

    setLoading(true);
    try {
      // 1. 创建临时课程（如果不存在）
      let courseId = localStorage.getItem('temp_course_id');
      
      if (!courseId) {
        const courseRes = await axios.post('/classroom/courses/', {
          title: '幻灯片临时课程',
          course_type: 'cpp',
          difficulty_level: 'beginner',
          description: '用于Markdown快速生成幻灯片'
        });
        courseId = courseRes.data.id;  // 直接从data获取
        localStorage.setItem('temp_course_id', courseId);
      }

      // 2. 创建文档
      const docRes = await axios.post('/classroom/documents/', {
        course: courseId,
        title: '快速生成 - ' + new Date().toLocaleString(),
        content_markdown: markdown,  // 字段名：content_markdown
        content_type: 'markdown'      // 内容类型
      });

      const documentId = docRes.data.id;  // 直接从data获取

      // 3. 生成幻灯片
      await axios.post(`/classroom/documents/${documentId}/generate_slides/`);

      toast.success('幻灯片生成成功！');

      // 4. 跳转到幻灯片预览
      setTimeout(() => {
        navigate(`/classroom/teacher/slide-fullscreen-figma?document_id=${documentId}`);
      }, 500);

    } catch (error: any) {
      console.error('生成失败:', error);
      toast.error(error.response?.data?.error || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const exampleMarkdown = `---
title: GESP一级 - 变量与数据类型
author: 柳老师
course_type: cpp
difficulty_level: beginner
---

## 第1章：什么是变量

### 直观类比
变量就像一个贴了名字的盒子，可以装不同的东西。

### 正式定义
变量是程序中用于存储数据的命名内存位置。

### 代码示例
\`\`\`cpp
int age = 10;        // 整型
double height = 1.5; // 浮点型
char grade = 'A';    // 字符型
bool isPass = true;  // 布尔型
\`\`\`

## 第2章：基本数据类型

### 整型（int）
用于存储整数，如年龄、数量。

### 浮点型（double）
用于存储小数，如身高、体重。

### 字符型（char）
用于存储单个字符，如 'A'、'9'。

### 布尔型（bool）
用于存储真假值（true/false）。

## 第3章：课堂练习

### 练习1
读入两个整数，输出它们的和。

### 练习2
判断一个学生是否及格（分数>=60）。

## 第4章：知识总结

### 核心要点
1. 变量需要先定义再使用
2. 选择合适的数据类型
3. 注意类型转换

### 下一步
学习运算符和表达式`;

  const loadExample = () => {
    setMarkdown(exampleMarkdown);
    toast.success('示例已加载');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Markdown → Figma幻灯片
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            粘贴Markdown文档，一键生成精美幻灯片
          </p>
        </div>

        {/* 主要内容 */}
        <div className="grid grid-cols-1 gap-6">
          {/* 输入区域 */}
          <Card className="shadow-lg border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                输入Markdown文档
              </CardTitle>
              <CardDescription>
                支持标题、代码块、列表等Markdown语法，也支持闪卡和选择题标记
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="粘贴您的Markdown文档...

示例：
## 第1章：标题
### 小节
内容...

```cpp
代码示例
```

<!-- flashcard -->
Q: 问题
A: 答案
<!-- /flashcard -->
"
                className="min-h-[500px] font-mono text-sm"
              />
              
              <div className="flex items-center gap-3 mt-4">
                <Button
                  onClick={loadExample}
                  variant="outline"
                  size="sm"
                >
                  加载示例
                </Button>
                <Button
                  onClick={() => setMarkdown('')}
                  variant="ghost"
                  size="sm"
                >
                  清空
                </Button>
                <div className="ml-auto text-sm text-slate-500">
                  {markdown.length} 字符
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !markdown.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2">⏳</div>
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      生成Figma幻灯片
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-4 text-center text-sm text-slate-600">
                <p>⚡ 无需AI，即刻生成</p>
                <p className="text-xs text-slate-500 mt-1">
                  支持章节、代码、闪卡、选择题等元素
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 功能说明 */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">支持的Markdown元素</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">章节标题</div>
                    <div className="text-slate-500">## 第X章</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">代码块</div>
                    <div className="text-slate-500">```cpp</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">闪卡</div>
                    <div className="text-slate-500">&lt;!-- flashcard --&gt;</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">选择题</div>
                    <div className="text-slate-500">&lt;!-- question:choice --&gt;</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">列表</div>
                    <div className="text-slate-500">- 项目</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">公式</div>
                    <div className="text-slate-500">$x = y$</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">表格</div>
                    <div className="text-slate-500">| A | B |</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-semibold">引用</div>
                    <div className="text-slate-500">&gt; 文字</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

