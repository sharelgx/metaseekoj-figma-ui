import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Users, Play, Pause, StopCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getDocumentSlides, getDocument } from '@/api/classroom'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'

// 幻灯片数据类型
interface Slide {
  id: number
  slide_index: number
  content_html: string
  has_code: boolean
  has_question: boolean
  code_language: string
}

// 演示数据（仅当没有document_id时使用）
const demoSlides = [
  {
    id: 1,
    index: 0,
    content: `
      <h1 style="background: linear-gradient(to right, #3DBAFB, #8ED1A9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">
        C++循环结构
      </h1>
      <blockquote style="border-left: 4px solid #3DBAFB; padding-left: 20px; color: #525252;">
        💡 <strong>提示</strong>：循环语句可以让程序重复执行操作，就像洗衣机的"洗→漂→脱"循环模式。
      </blockquote>
    `,
    has_question: false,
    has_code: false
  },
  {
    id: 2,
    index: 1,
    content: `
      <h2 style="color: #525252; border-left: 4px solid #3DBAFB; padding-left: 16px;">
        一、for循环 —— "次数已知"的循环
      </h2>
      <p style="font-size: 1.2em; color: #525252;">当你知道循环次数时，使用 <code>for</code> 最方便。</p>
      <pre><code class="cpp" style="background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 8px; display: block; overflow-x: auto;">
#include &lt;iostream&gt;
using namespace std;

int main() {
    for (int i = 1; i &lt;= 5; i++) {
        cout &lt;&lt; "第 " &lt;&lt; i &lt;&lt; " 次循环" &lt;&lt; endl;
    }
    return 0;
}
      </code></pre>
      <blockquote style="border-left: 4px solid #67C23A; padding-left: 20px; color: #525252; margin-top: 20px;">
        💡 <strong>提示</strong>：<code>for(初始化; 条件; 更新)</code>
      </blockquote>
    `,
    has_question: false,
    has_code: true
  },
  {
    id: 3,
    index: 2,
    content: `
      <h2 style="color: #525252; border-left: 4px solid #FFA726; padding-left: 16px;">随堂练习</h2>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 40px; color: white; margin: 40px auto; max-width: 700px;">
        <h3 style="color: white; margin-bottom: 20px;">📝 测试题占位符</h3>
        <p style="font-size: 1.1em;">
          [题目ID: auto]<br>
          [难度: easy]<br>
          [知识点: for循环]
        </p>
        <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p>教师在编辑器中可以从题库选择具体题目，或新建题目。</p>
          <button style="margin-top: 15px; padding: 10px 30px; border: none; border-radius: 20px; background: white; color: #667eea; cursor: pointer; font-weight: bold;">
            ✏️ 插入测试题
          </button>
        </div>
      </div>
    `,
    has_question: true,
    has_code: false
  },
  {
    id: 4,
    index: 3,
    content: `
      <h2 style="color: #525252; border-left: 4px solid #3DBAFB; padding-left: 16px;">
        二、while循环 —— "条件未知"的循环
      </h2>
      <p style="font-size: 1.2em; color: #525252;">当循环次数未知，但有条件控制时，使用 <code>while</code>。</p>
      <pre><code class="cpp" style="background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 8px; display: block; overflow-x: auto;">
#include &lt;iostream&gt;
using namespace std;

int main() {
    int n = 5;
    while (n &gt; 0) {
        cout &lt;&lt; "倒计时：" &lt;&lt; n &lt;&lt; endl;
        n--;
    }
    cout &lt;&lt; "发射！" &lt;&lt; endl;
    return 0;
}
      </code></pre>
      <blockquote style="border-left: 4px solid #E6A23C; padding-left: 20px; color: #525252; margin-top: 20px;">
        ⚠️ <strong>注意</strong>：使用 while 时，循环变量必须改变，否则会陷入死循环。
      </blockquote>
    `,
    has_question: false,
    has_code: true
  },
  {
    id: 5,
    index: 4,
    content: `
      <h2 style="color: #525252; border-left: 4px solid #8ED1A9; padding-left: 16px;">
        闪卡识记 📚
      </h2>
      <p style="text-align: center; font-size: 1.2em; margin-bottom: 30px; color: #525252;">
        接下来请记住以下重要概念！
      </p>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 900px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white;">
          <h4 style="color: white; margin-bottom: 10px;">for循环组成</h4>
          <p style="font-size: 0.9em;">初始化、条件、更新</p>
          <code style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 10px;">
            for(int i=0;i&lt;10;i++)
          </code>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; color: white;">
          <h4 style="color: white; margin-bottom: 10px;">while循环特点</h4>
          <p style="font-size: 0.9em;">先判断后执行，可能不执行</p>
          <code style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 10px;">
            while(condition){}
          </code>
        </div>
      </div>
    `,
    has_question: false,
    has_code: false
  },
  {
    id: 6,
    index: 5,
    content: `
      <h2 style="color: #525252; border-left: 4px solid #C49CFF; padding-left: 16px;">课后总结</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(to right, #3DBAFB, #8ED1A9); color: white;">
            <th style="padding: 15px; border: 1px solid #ddd;">循环类型</th>
            <th style="padding: 15px; border: 1px solid #ddd;">执行条件</th>
            <th style="padding: 15px; border: 1px solid #ddd;">特点</th>
            <th style="padding: 15px; border: 1px solid #ddd;">适用场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">for循环</td>
            <td style="padding: 12px; border: 1px solid #ddd;">次数已知</td>
            <td style="padding: 12px; border: 1px solid #ddd;">结构清晰</td>
            <td style="padding: 12px; border: 1px solid #ddd;">固定次数重复</td>
          </tr>
          <tr style="background: #F5F7FA;">
            <td style="padding: 12px; border: 1px solid #ddd;">while循环</td>
            <td style="padding: 12px; border: 1px solid #ddd;">条件未知</td>
            <td style="padding: 12px; border: 1px solid #ddd;">可能不执行</td>
            <td style="padding: 12px; border: 1px solid #ddd;">输入验证、等待</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">do-while循环</td>
            <td style="padding: 12px; border: 1px solid #ddd;">先执行后判断</td>
            <td style="padding: 12px; border: 1px solid #ddd;">至少执行一次</td>
            <td style="padding: 12px; border: 1px solid #ddd;">菜单选择类程序</td>
          </tr>
          <tr style="background: #F5F7FA;">
            <td style="padding: 12px; border: 1px solid #ddd;">循环嵌套</td>
            <td style="padding: 12px; border: 1px solid #ddd;">多层控制</td>
            <td style="padding: 12px; border: 1px solid #ddd;">结构复杂</td>
            <td style="padding: 12px; border: 1px solid #ddd;">表格、图案输出</td>
          </tr>
        </tbody>
      </table>
    `,
    has_question: false,
    has_code: false
  }
]

export default function SlidePreview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('document_id')
  
  const revealRef = useRef<HTMLDivElement>(null)
  const [deck, setDeck] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [document, setDocument] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalSlides, setTotalSlides] = useState(0)

  // 加载真实的幻灯片数据
  useEffect(() => {
    if (documentId) {
      loadRealSlides(parseInt(documentId))
    } else {
      // 没有document_id，使用演示数据
      loadDemoSlides()
    }
  }, [documentId])

  // 初始化Reveal.js
  useEffect(() => {
    if (revealRef.current && !deck && slides.length > 0) {
      initReveal()
    }

    return () => {
      if (deck) {
        deck.destroy()
      }
    }
  }, [slides])

  const loadRealSlides = async (docId: number) => {
    setIsLoading(true)
    try {
      // 加载文档和幻灯片数据
      const [docData, slidesData] = await Promise.all([
        getDocument(docId),
        getDocumentSlides(docId)
      ])
      
      setDocument(docData)
      
      // 转换为组件需要的格式
      const formattedSlides: Slide[] = slidesData
        .sort((a, b) => a.slide_index - b.slide_index)
        .map(slide => ({
          id: slide.id,
          slide_index: slide.slide_index,
          content_html: slide.content_html,
          has_code: slide.has_code,
          has_question: slide.has_question,
          code_language: slide.code_language
        }))
      
      setSlides(formattedSlides)
      setTotalSlides(formattedSlides.length)
      toast.success(`已加载 ${formattedSlides.length} 个幻灯片`)
    } catch (error: any) {
      console.error('加载幻灯片失败:', error)
      toast.error('加载幻灯片失败，使用演示数据')
      loadDemoSlides()
    } finally {
      setIsLoading(false)
    }
  }

  const loadDemoSlides = () => {
    // 使用演示数据
    const formattedDemoSlides: Slide[] = demoSlides.map(slide => ({
      id: slide.id,
      slide_index: slide.index,
      content_html: slide.content,
      has_code: slide.has_code,
      has_question: slide.has_question,
      code_language: 'cpp'
    }))
    setSlides(formattedDemoSlides)
    setTotalSlides(formattedDemoSlides.length)
    setIsLoading(false)
  }

  const initReveal = () => {
    const revealDeck = new Reveal(revealRef.current!, {
      controls: true,
      progress: true,
      slideNumber: 'c/t',
      hash: false,
      transition: 'slide',
      backgroundTransition: 'fade',
      width: 1200,
      height: 700,
      margin: 0.1,
      minScale: 0.2,
      maxScale: 2.0
    })

    revealDeck.initialize().then(() => {
      console.log('✅ Reveal.js 初始化成功')
      setDeck(revealDeck)
      
      // 监听幻灯片切换
      revealDeck.on('slidechanged', (event: any) => {
        setCurrentSlide(event.indexh)
        console.log('幻灯片切换到:', event.indexh)
      })
    })
  }

  const handleStartClass = () => {
    toast.success('开始上课功能开发中...')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#3DBAFB] mx-auto mb-4" />
          <p className="text-[#737373]">正在加载幻灯片...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-[#525252]">
                  📖 {document?.title || 'AI生成课件'}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {documentId && (
                    <Badge variant="outline" className="text-xs">
                      文档 #{documentId}
                    </Badge>
                  )}
                  <span className="text-sm text-[#737373]">
                    共 {totalSlides} 页幻灯片
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#737373]">
                <Users className="h-4 w-4" />
                <span>0 名学生在线</span>
              </div>
              <Button
                onClick={handleStartClass}
                className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                开始上课
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* 左侧：幻灯片列表 */}
          <div className="col-span-1 space-y-2">
            <h3 className="text-sm font-semibold text-[#525252] mb-3">
              📑 幻灯片列表（{totalSlides}页）
            </h3>
            {slides.map((slide, index) => (
              <Card
                key={slide.id}
                className={`p-3 cursor-pointer transition-all ${
                  currentSlide === index
                    ? 'border-[#3DBAFB] border-2 shadow-md'
                    : 'border-[#e5e5e5] hover:border-[#3DBAFB]'
                }`}
                onClick={() => deck?.slide(index)}
              >
                <div className="text-xs text-[#737373] mb-1">
                  第 {index + 1} 页
                </div>
                <div className="flex gap-1">
                  {slide.has_code && (
                    <Badge variant="secondary" className="text-xs">代码</Badge>
                  )}
                  {slide.has_question && (
                    <Badge variant="default" className="text-xs bg-[#FFA726]">题目</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* 右侧：幻灯片展示 */}
          <div className="col-span-3">
            <Card className="overflow-hidden shadow-lg">
              <div 
                ref={revealRef} 
                className="reveal"
                style={{ height: '600px' }}
              >
                <div className="slides">
                  {slides.length > 0 ? slides.map((slide) => (
                    <section
                      key={slide.id}
                      data-slide-id={slide.id}
                      dangerouslySetInnerHTML={{ __html: slide.content_html }}
                    />
                  )) : (
                    <section>
                      <h2>暂无幻灯片内容</h2>
                      <p>请先生成课件</p>
                    </section>
                  )}
                </div>
              </div>
            </Card>

            {/* 提示信息 */}
            <div className="mt-4 text-center text-sm text-[#737373]">
              <p>
                💡 使用键盘 <kbd className="px-2 py-1 bg-white border rounded">←</kbd>{' '}
                <kbd className="px-2 py-1 bg-white border rounded">→</kbd> 翻页，
                按 <kbd className="px-2 py-1 bg-white border rounded">ESC</kbd> 查看概览
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 自定义样式 */}
      <style>{`
        .reveal {
          background: #ffffff;
        }
        
        .reveal .slides {
          text-align: left;
        }
        
        .reveal h1 {
          font-size: 2.5em;
          margin-bottom: 0.5em;
        }
        
        .reveal h2 {
          font-size: 2em;
          margin-bottom: 0.5em;
        }
        
        .reveal code {
          background: #f5f7fa;
          padding: 2px 6px;
          border-radius: 4px;
          color: #F57C00;
          font-family: 'Consolas', 'Monaco', monospace;
        }
        
        .reveal pre {
          width: 100%;
          margin: 20px 0;
        }
        
        .reveal pre code {
          max-height: none;
          padding: 20px;
        }
        
        .reveal blockquote {
          width: 90%;
          margin: 20px auto;
          padding: 15px;
          font-style: normal;
          background: rgba(61, 186, 251, 0.05);
          border-radius: 8px;
        }
        
        .reveal table {
          font-size: 0.8em;
        }
        
        kbd {
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  )
}

