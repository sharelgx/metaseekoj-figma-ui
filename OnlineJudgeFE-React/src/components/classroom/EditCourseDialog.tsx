import { useState, useEffect } from 'react'
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
import { updateCourse, type Course } from '@/api/classroom'
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

interface EditCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onSuccess: (course: Course) => void
}

// 课程类型图标和配色
const typeIcons: Record<string, { icon: JSX.Element; label: string; color: string; bg: string }> = {
  scratch: {
    icon: <Palette className="w-6 h-6" />,
    label: 'Scratch',
    color: 'text-[#FFA726]',
    bg: 'bg-orange-50 hover:bg-orange-100'
  },
  python: {
    icon: <Code2 className="w-6 h-6" />,
    label: 'Python',
    color: 'text-[#3DBAFB]',
    bg: 'bg-blue-50 hover:bg-blue-100'
  },
  cpp: {
    icon: <Zap className="w-6 h-6" />,
    label: 'C++',
    color: 'text-[#C49CFF]',
    bg: 'bg-purple-50 hover:bg-purple-100'
  }
}

const levelConfig: Record<string, { label: string }> = {
  beginner: { label: '初级' },
  intermediate: { label: '中级' },
  advanced: { label: '高级' }
}

export function EditCourseDialog({ open, onOpenChange, course, onSuccess }: EditCourseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      course_type: 'python',
      difficulty_level: 'beginner',
      cover_url: '',
      is_published: false
    }
  })

  // 当课程数据变化时，重置表单
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        description: course.description || '',
        course_type: course.course_type,
        difficulty_level: course.difficulty_level,
        cover_url: course.cover_url || '',
        is_published: course.is_published
      })
      setCoverPreviewUrl(course.cover_url || null)
    }
  }, [course, form])

  const selectedCourseType = form.watch('course_type')

  const onSubmit = async (data: FormData) => {
    if (!course) return

    setIsSubmitting(true)
    try {
      const result = await updateCourse(course.id, data)
      onSuccess(result)
      onOpenChange(false)
      toast.success('课程更新成功！')
    } catch (error: any) {
      console.error('更新课程失败:', error)
      toast.error('更新失败：' + (error.response?.data?.error || error.message || '未知错误'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setCoverPreviewUrl(url || null)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#525252]">编辑课程</DialogTitle>
          <DialogDescription className="text-[#737373] mt-1">
            修改课程信息，更新后立即生效
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
                    <FormLabel className="text-[#525252]">
                      课程标题 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="例如：Scratch 图形化编程入门" 
                        {...field} 
                        className="border-[#e5e5e5] focus-visible:ring-[#3DBAFB]"
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
                        rows={4} 
                        {...field} 
                        className="border-[#e5e5e5] focus-visible:ring-[#3DBAFB]"
                      />
                    </FormControl>
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
                    <FormLabel className="text-[#525252]">
                      课程类型 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(typeIcons).map(([key, config]) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${field.value === key ? `border-[${config.color}] shadow-md` : 'border-[#e5e5e5]'}
                              ${config.bg}
                            `}
                            onClick={() => field.onChange(key)}
                          >
                            <div className={`flex flex-col items-center gap-2 ${config.color}`}>
                              {config.icon}
                              <span className="font-medium">{config.label}</span>
                            </div>
                            {field.value === key && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1 right-1 bg-green-500 rounded-full p-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                              </motion.div>
                            )}
                          </motion.div>
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
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(levelConfig).map(([key, config]) => (
                          <button
                            key={key}
                            type="button"
                            className={`p-3 rounded-lg border-2 transition-all ${
                              field.value === key
                                ? 'border-[#3DBAFB] bg-[#F0F9FF] shadow-md'
                                : 'border-[#e5e5e5] bg-white hover:bg-[#F5F7FA]'
                            }`}
                            onClick={() => field.onChange(key)}
                          >
                            <span className={`font-medium ${field.value === key ? 'text-[#3DBAFB]' : 'text-[#525252]'}`}>
                              {config.label}
                            </span>
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
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleCoverUrlChange(e)
                        }}
                        className="border-[#e5e5e5] focus-visible:ring-[#3DBAFB]"
                      />
                    </FormControl>
                    <FormDescription className="text-[#737373]">
                      输入图片URL，或留空使用默认封面。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {coverPreviewUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-2 border border-[#e5e5e5] rounded-lg bg-[#F5F7FA]"
                >
                  <p className="text-sm font-medium text-[#525252] mb-2">预览：</p>
                  <img
                    src={coverPreviewUrl}
                    alt="封面预览"
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      toast.error('封面图加载失败或URL无效')
                      setCoverPreviewUrl(null)
                    }}
                  />
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
                      <FormLabel className="text-[#525252]">发布课程</FormLabel>
                      <FormDescription className="text-[#737373]">
                        开启后课程将对学生可见
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#3DBAFB]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="border-[#e5e5e5] text-[#525252] hover:bg-[#F5F7FA]"
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] hover:opacity-90 text-white border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    更新中...
                  </>
                ) : (
                  '保存更改'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

