/**
 * 文档预览编辑器
 * 右侧60%区域，显示AI生成的文档并支持编辑
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Copy, 
  X, 
  Edit3, 
  Eye, 
  Save,
  Code2,
  ListChecks,
  Video,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ProblemPickerDialog } from './ProblemPickerDialog'
import { BilibiliVideoDialog } from './BilibiliVideoDialog'
import { convertVideoMarkdownToIframe, type BilibiliVideoInfo } from '@/utils/bilibili'
import type { Problem } from '@/api/problem'
import 'katex/dist/katex.min.css'
import '@/styles/formula-display.css'

interface DocumentPreviewEditorProps {
  documentId: number | null
  version: number
  content: string
  isPublished: boolean
  onContentChange: (content: string) => void
  onPublish: () => void
  onClose?: () => void
}

export function DocumentPreviewEditor({
  documentId,
  version,
  content,
  isPublished,
  onContentChange,
  onPublish,
  onClose
}: DocumentPreviewEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [showProblemDialog, setShowProblemDialog] = useState(false)
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [problemType, setProblemType] = useState<'programming' | 'choice'>('programming')

  useEffect(() => {
    setEditContent(content)
  }, [content])

  const handleSave = () => {
    onContentChange(editContent)
    setIsEditing(false)
    toast.success('保存成功')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('内容已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const handleInsertProblem = (problem: Problem) => {
    const problemMarkdown = `
## 📝 ${problemType === 'programming' ? '编程' : '选择'}题：${problem.title}

:::problem
id: ${problem._id}
type: ${problemType}
difficulty: ${problem.difficulty}
tags: ${problem.tags?.map(t => typeof t === 'string' ? t : t.name).join(', ')}
:::

> 💡 **题目提示**：点击进入题目详情页查看完整描述
`
    
    if (isEditing) {
      setEditContent(prev => prev + '\n' + problemMarkdown)
    } else {
      onContentChange(content + '\n' + problemMarkdown)
    }
    
    toast.success(`${problemType === 'programming' ? '编程' : '选择'}题已插入`)
  }

  const handleInsertVideo = (markdown: string, videoInfo: BilibiliVideoInfo) => {
    if (isEditing) {
      setEditContent(prev => prev + '\n' + markdown)
    } else {
      onContentChange(content + '\n' + markdown)
    }
  }

  const handleInsertChoice = () => {
    // 修复：选择题使用选择题类型
    setProblemType('choice')
    setShowProblemDialog(true)
  }

  const handleInsertCode = () => {
    // 修复：编程题使用编程题类型
    setProblemType('programming')
    setShowProblemDialog(true)
  }

  // 清理和处理Markdown内容
  const processContent = (rawContent: string): string => {
    let processed = rawContent;
    
    // 1. 移除HTML注释
    processed = processed.replace(/<!--[\s\S]*?-->/g, '');
    
    // 2. 转换B站视频
    processed = convertVideoMarkdownToIframe(processed);
    
    return processed;
  };

  const renderedContent = isEditing ? editContent : processContent(content);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部工具栏 */}
      <div className="flex-shrink-0 border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：版本号和状态 */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              v{version}
            </Badge>
            {isPublished && (
              <Badge className="bg-green-500">
                已发布
              </Badge>
            )}
            {isEditing && (
              <Badge variant="secondary" className="animate-pulse">
                编辑中...
              </Badge>
            )}
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  复制
                </Button>
                <Button
                  size="sm"
                  onClick={onPublish}
                  disabled={isPublished}
                  className="gap-2 bg-[#D97757] hover:bg-[#C86646]"
                >
                  <Sparkles className="h-4 w-4" />
                  发布
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditContent(content)
                    setIsEditing(false)
                  }}
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  保存
                </Button>
              </>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 编辑工具栏 */}
        {isEditing && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">插入:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleInsertChoice}
                className="gap-2"
              >
                <ListChecks className="h-4 w-4" />
                选择题
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleInsertCode}
                className="gap-2"
              >
                <Code2 className="h-4 w-4" />
                编程题
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVideoDialog(true)}
                className="gap-2 text-[#00A1D6] border-[#00A1D6]"
              >
                <Video className="h-4 w-4" />
                B站视频
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto">
        {!documentId ? (
          // 空状态
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Eye className="h-16 w-16 mb-4" />
            <p className="text-lg">与AI对话生成课件内容</p>
            <p className="text-sm mt-2">内容将在这里实时显示</p>
          </div>
        ) : isEditing ? (
          // 编辑模式：Textarea
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none"
            placeholder="在此编辑Markdown内容..."
          />
        ) : (
          // 预览模式：完全可视化渲染（不显示任何Markdown/HTML标签）
          <div className="prose prose-lg prose-slate max-w-none p-6 sm:p-8 md:p-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // 代码块 - 语法高亮
                code(props: any) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !className;
                  
                  return isInline ? (
                    <code className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-pink-200" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      className="rounded-xl !mt-4 !mb-4 shadow-lg"
                      customStyle={{ fontSize: '14px', padding: '20px' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
                // 段落
                p: ({ children }) => (
                  <p className="text-[1.15rem] leading-relaxed mb-4 text-slate-800">{children}</p>
                ),
                // H1 - 主标题（渐变色）
                h1: ({ children }) => (
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-8 mt-10 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
                    {children}
                  </h1>
                ),
                // H2 - 章节标题（左侧蓝色边框）
                h2: ({ children }) => (
                  <h2 className="text-3xl md:text-4xl font-bold mb-5 mt-8 text-slate-700 border-l-4 border-[#3DBAFB] pl-4 bg-blue-50/50 py-2 rounded-r">
                    {children}
                  </h2>
                ),
                // H3 - 小节标题
                h3: ({ children }) => (
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-6 text-slate-800">{children}</h3>
                ),
                // H4 - 四级标题
                h4: ({ children }) => (
                  <h4 className="text-xl md:text-2xl font-semibold mb-3 mt-5 text-slate-700">{children}</h4>
                ),
                // 无序列表
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4 pl-6">{children}</ul>
                ),
                // 有序列表
                ol: ({ children }) => (
                  <ol className="space-y-2 my-4 pl-6 list-decimal">{children}</ol>
                ),
                // 列表项（蓝色项目符号）
                li: ({ children }) => (
                  <li className="text-[1.15rem] leading-relaxed text-slate-800 marker:text-[#3DBAFB] marker:font-bold">
                    {children}
                  </li>
                ),
                // 加粗 - 蓝色强调
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#3DBAFB]">{children}</strong>
                ),
                // 斜体
                em: ({ children }) => (
                  <em className="italic text-slate-600">{children}</em>
                ),
                // 引用块（渐变背景）
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#3DBAFB] bg-gradient-to-r from-[#3DBAFB]/10 to-[#8ED1A9]/10 pl-6 pr-6 py-4 my-5 rounded-r-xl shadow-sm">
                    <div className="text-[1.1rem] text-slate-700 italic">{children}</div>
                  </blockquote>
                ),
                // 表格
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      {children}
                    </table>
                  </div>
                ),
                // 表头
                thead: ({ children }) => (
                  <thead className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white">
                    {children}
                  </thead>
                ),
                // 表体
                tbody: ({ children }) => (
                  <tbody className="bg-white divide-y divide-slate-200">{children}</tbody>
                ),
                // 表头单元格
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-sm md:text-base font-bold">{children}</th>
                ),
                // 表格单元格
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm md:text-base text-slate-700">{children}</td>
                ),
                // 链接
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-[#3DBAFB] hover:text-[#2196F3] font-medium hover:underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // 水平分隔线
                hr: () => (
                  <hr className="my-8 border-t-2 border-slate-200" />
                ),
              }}
            >
              {renderedContent}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* 题目选择对话框 */}
      <ProblemPickerDialog
        open={showProblemDialog}
        onOpenChange={setShowProblemDialog}
        onSelect={handleInsertProblem}
        type={problemType}
      />

      {/* B站视频插入对话框 */}
      <BilibiliVideoDialog
        open={showVideoDialog}
        onOpenChange={setShowVideoDialog}
        onInsert={handleInsertVideo}
      />
    </div>
  )
}

