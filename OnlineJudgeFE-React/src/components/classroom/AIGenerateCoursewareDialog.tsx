import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Coins } from 'lucide-react'
import { toast } from 'sonner'
import { type Course } from '@/api/classroom'
import { aiGenerateCourse, getCreditsBalance } from '@/api/credits'
import { motion, AnimatePresence } from 'motion/react'

// 表单验证 Schema
const formSchema = z.object({
  topic: z.string()
    .min(3, '主题至少需要3个字符')
    .max(100, '主题不能超过100个字符'),
  
  requirements: z.string()
    .min(10, '需求描述至少需要10个字符')
    .max(500, '需求描述不能超过500个字符')
    .optional()
    .or(z.literal(''))
})

type FormData = z.infer<typeof formSchema>

interface AIGenerateCoursewareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onSuccess: () => void
}

type GenerationStep = 'idle' | 'checking' | 'generating' | 'success' | 'error'

export function AIGenerateCoursewareDialog({ open, onOpenChange, course, onSuccess }: AIGenerateCoursewareDialogProps) {
  const [step, setStep] = useState<GenerationStep>('idle')
  const [progress, setProgress] = useState(0)
  const [credits, setCredits] = useState(0)
  const [requiredCredits] = useState(10) // AI生成课件需要10点卡
  const [generatedDocId, setGeneratedDocId] = useState<number | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      requirements: ''
    }
  })

  // 加载点卡余额
  const loadCredits = async () => {
    try {
      const data = await getCreditsBalance()
      setCredits(data.available_credits)
    } catch (error) {
      console.error('加载点卡余额失败:', error)
    }
  }

  // 当对话框打开时加载余额
  useEffect(() => {
    if (open) {
      loadCredits()
    }
  }, [open])

  const onSubmit = async (data: FormData) => {
    if (!course) return

    // 检查点卡余额
    if (credits < requiredCredits) {
      toast.error('点卡余额不足', {
        description: `需要${requiredCredits}点卡，当前余额：${credits}点卡`,
        action: {
          label: '去充值',
          onClick: () => {
            toast.info('充值功能开发中，请联系管理员')
          }
        }
      })
      return
    }

    setStep('checking')
    setProgress(10)

    try {
      setStep('generating')
      setProgress(30)

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 1000)

      // 调用AI生成API
      const result = await aiGenerateCourse({
        course_id: course.id,
        topic: data.topic,
        requirements: data.requirements || ''
      })

      clearInterval(progressInterval)
      setProgress(100)
      setStep('success')
      setGeneratedDocId(result.document_id)

      // 更新点卡余额
      setCredits(credits - requiredCredits)

      toast.success('课件生成成功！', {
        description: `已生成 ${result.slides_count} 个幻灯片，消耗 ${result.credits_used} 点卡`,
        action: {
          label: '查看幻灯片',
          onClick: () => {
            window.open(`/classroom/teacher/slide-preview?document_id=${result.document_id}`, '_blank')
          }
        }
      })

      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
        resetForm()
      }, 2000)

    } catch (error: any) {
      console.error('AI生成失败:', error)
      setStep('error')
      
      const errorData = error.response?.data || {}
      const errorMsg = errorData.error || error.message || '未知错误'
      const triedProviders = errorData.tried_providers || []
      
      if (error.response?.status === 402) {
        toast.error('点卡余额不足', {
          description: errorMsg || '请充值后重试'
        })
      } else {
        // 显示更详细的错误信息
        const description = triedProviders.length > 0 
          ? `已尝试: ${triedProviders.join(', ')}` 
          : '请检查AI服务配置或稍后重试'
        
        toast.error('AI生成失败', {
          description: `${errorMsg}\n${description}`
        })
        
        console.error('AI生成详细错误:', {
          error: errorMsg,
          tried_providers: triedProviders,
          status: error.response?.status
        })
      }
    }
  }

  const resetForm = () => {
    form.reset()
    setStep('idle')
    setProgress(0)
    setGeneratedDocId(null)
  }

  const handleCancel = () => {
    if (step === 'generating') {
      toast.warning('生成中，请稍候...')
      return
    }
    onOpenChange(false)
    resetForm()
  }

  if (!course) return null

  const isGenerating = step === 'checking' || step === 'generating'
  const isComplete = step === 'success'

  return (
    <Dialog open={open} onOpenChange={isGenerating ? undefined : onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#525252] flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#FFA726]" />
            AI 生成课件
          </DialogTitle>
          <DialogDescription className="text-[#737373] mt-1">
            使用AI为"{course.title}"生成专业课件内容
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* 点卡余额显示 */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] border border-[#FFA726]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-[#F57C00]" />
                    <span className="font-medium text-[#525252]">当前余额：</span>
                    <span className="text-2xl font-bold text-[#F57C00]">{credits}</span>
                    <span className="text-[#737373]">点卡</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#737373]">本次消耗</p>
                    <p className="text-xl font-bold text-[#F57C00]">{requiredCredits} 点卡</p>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#525252]">
                          课件主题 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="例如：C++循环结构：for、while、do-while" 
                            {...field} 
                            className="border-[#e5e5e5] focus-visible:ring-[#3DBAFB]"
                          />
                        </FormControl>
                        <FormDescription className="text-[#737373]">
                          简要描述课件的核心主题
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#525252]">具体要求</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="例如：适合初学者，包含代码示例和练习题，需要涵盖三种循环的使用场景和区别..."
                            rows={5} 
                            {...field} 
                            className="border-[#e5e5e5] focus-visible:ring-[#3DBAFB]"
                          />
                        </FormControl>
                        <FormDescription className="text-[#737373]">
                          详细描述您的需求，AI会根据要求生成更精准的课件内容
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="border-[#e5e5e5] text-[#525252] hover:bg-[#F5F7FA]"
                    >
                      取消
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-[#FFA726] to-[#F57C00] hover:opacity-90 text-white border-0"
                      disabled={credits < requiredCredits}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      开始生成
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8"
            >
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Sparkles className="h-16 w-16 text-[#FFA726]" />
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#525252] mb-2">
                    {step === 'checking' ? '正在检查点卡余额...' : 'AI 正在生成课件...'}
                  </h3>
                  <p className="text-[#737373]">请稍候，预计需要 30-60 秒</p>
                </div>

                <div className="w-full max-w-md mx-auto">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-[#737373] mt-2">{progress}%</p>
                </div>
              </div>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#525252] mb-2">生成成功！</h3>
              <p className="text-[#737373]">课件已生成，即将关闭...</p>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#525252] mb-2">生成失败</h3>
              <p className="text-[#737373] mb-6">请重试或联系管理员</p>
              <Button 
                onClick={resetForm}
                className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white"
              >
                重新生成
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

