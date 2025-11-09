import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Palette, Code2, Zap, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createCourse, type CreateCourseData, type Course } from '@/api/classroom'
import { motion } from 'motion/react'

// 表单验证 Schema
const formSchema = z.object({
  title: z.string()
    .min(1, '课程标题不能为空')
    .max(200, '课程标题不能超过200个字符'),
  
  description: z.string()
    .max(2000, '课程描述不能超过2000个字符')
    .optional()
    .or(z.literal('')),
  
  course_type: z.enum(['scratch', 'python', 'cpp'], {
    required_error: '请选择课程类型'
  }),
  
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced'])
    .default('beginner'),
  
  cover_url: z.string()
    .url('请输入有效的URL')
    .optional()
    .or(z.literal('')),
  
  is_published: z.boolean()
    .default(false)
})

type FormData = z.infer<typeof formSchema>

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (course: Course) => void
}

// 课程类型配置（MetaSeekOJ 风格）
const courseTypes = [
  {
    value: 'scratch' as const,
    label: 'Scratch',
    subtitle: '图形化编程',
    icon: <Palette className="h-6 w-6" />,
    color: 'text-[#FFA726]',
    bg: 'bg-[#FFA726]/10',
    border: 'border-[#FFA726]',
    hoverBg: 'hover:bg-[#FFA726]/20'
  },
  {
    value: 'python' as const,
    label: 'Python',
    subtitle: '代码编程',
    icon: <Code2 className="h-6 w-6" />,
    color: 'text-[#3DBAFB]',
    bg: 'bg-[#3DBAFB]/10',
    border: 'border-[#3DBAFB]',
    hoverBg: 'hover:bg-[#3DBAFB]/20'
  },
  {
    value: 'cpp' as const,
    label: 'C++',
    subtitle: '算法竞赛',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-[#C49CFF]',
    bg: 'bg-[#C49CFF]/10',
    border: 'border-[#C49CFF]',
    hoverBg: 'hover:bg-[#C49CFF]/20'
  }
]

// 难度等级配置
const difficultyLevels = [
  { value: 'beginner' as const, label: '初级', color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'intermediate' as const, label: '中级', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { value: 'advanced' as const, label: '高级', color: 'text-red-600', bg: 'bg-red-100' }
]

export function CreateCourseDialog({ open, onOpenChange, onSuccess }: CreateCourseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string>('')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      course_type: undefined,
      difficulty_level: 'beginner',
      cover_url: '',
      is_published: false
    }
  })

  const selectedType = form.watch('course_type')
  const coverUrl = form.watch('cover_url')

  // 监听封面 URL 变化
  const handleCoverUrlChange = (url: string) => {
    if (url && url.startsWith('http')) {
      setCoverPreview(url)
    } else {
      setCoverPreview('')
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // 清理空字符串
      const submitData: CreateCourseData = {
        ...data,
        description: data.description || '',
        cover_url: data.cover_url || ''
      }
      
      const result = await createCourse(submitData)
      toast.success('课程创建成功！')
      onSuccess(result)
      onOpenChange(false)
      form.reset()
      setCoverPreview('')
    } catch (error: any) {
      console.error('创建课程失败:', error)
      toast.error(error.response?.data?.message || '创建失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    setCoverPreview('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#525252]">
            创建新课程
          </DialogTitle>
          <DialogDescription className="text-[#737373]">
            填写课程基本信息，创建后可以继续添加教学内容
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#525252] flex items-center gap-2">
                📝 基本信息
              </h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252]">课程标题 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例如：Scratch 图形化编程入门"
                        className="border-[#e5e5e5]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252]">课程描述</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="简要介绍课程内容和学习目标..."
                        className="min-h-[100px] border-[#e5e5e5] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[#737373]">
                      帮助学生了解课程内容（选填）
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 课程设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#525252] flex items-center gap-2">
                🎯 课程设置
              </h3>

              <FormField
                control={form.control}
                name="course_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252]">课程类型 *</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-4">
                        {courseTypes.map((type) => (
                          <motion.button
                            key={type.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => field.onChange(type.value)}
                            className={`
                              relative p-4 rounded-lg border-2 transition-all
                              ${field.value === type.value 
                                ? `${type.border} ${type.bg}` 
                                : 'border-[#e5e5e5] hover:border-[#d0d0d0]'
                              }
                            `}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className={type.color}>
                                {type.icon}
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-[#525252]">
                                  {type.label}
                                </div>
                                <div className="text-xs text-[#737373]">
                                  {type.subtitle}
                                </div>
                              </div>
                            </div>
                            {field.value === type.value && (
                              <div className="absolute top-2 right-2">
                                <div className={`w-5 h-5 rounded-full ${type.bg} ${type.color} flex items-center justify-center text-xs`}>
                                  ✓
                                </div>
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252]">难度等级</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        {difficultyLevels.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => field.onChange(level.value)}
                            className={`
                              flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all
                              ${field.value === level.value
                                ? `${level.bg} ${level.color} border-current`
                                : 'border-[#e5e5e5] text-[#737373] hover:border-[#d0d0d0]'
                              }
                            `}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 封面设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#525252] flex items-center gap-2">
                🖼️ 封面设置（可选）
              </h3>

              <FormField
                control={form.control}
                name="cover_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252]">封面图片 URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/cover.jpg"
                        className="border-[#e5e5e5]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleCoverUrlChange(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-[#737373]">
                      输入图片URL或稍后上传本地图片
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 封面预览 */}
              {coverPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg overflow-hidden border-2 border-[#e5e5e5]"
                >
                  <img
                    src={coverPreview}
                    alt="封面预览"
                    className="w-full h-48 object-cover"
                    onError={() => {
                      setCoverPreview('')
                      toast.error('封面图加载失败，请检查URL')
                    }}
                  />
                  <div className="p-2 bg-[#F5F7FA] text-center text-sm text-[#737373]">
                    封面预览
                  </div>
                </motion.div>
              )}
            </div>

            {/* 发布设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#525252] flex items-center gap-2">
                📢 发布设置
              </h3>

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#e5e5e5] p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-[#525252]">
                        立即发布课程
                      </FormLabel>
                      <FormDescription className="text-[#737373]">
                        创建后可以在课程详情中继续编辑和发布
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="border-[#e5e5e5] text-[#525252] hover:bg-[#F5F7FA]"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  '创建课程'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

