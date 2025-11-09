/**
 * 题目选择器对话框
 * 用于在课件中插入MetaSeekOJ的题目
 */

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Code2, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { problemAPI, type Problem } from '@/api/problem'
import { toast } from 'sonner'

interface ProblemPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (problem: Problem) => void
  type?: 'programming' | 'choice'  // 题目类型
}

export function ProblemPickerDialog({
  open,
  onOpenChange,
  onSelect,
  type = 'programming'
}: ProblemPickerDialogProps) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [difficulty, setDifficulty] = useState<'Low' | 'Mid' | 'High' | ''>('')

  useEffect(() => {
    if (open) {
      loadProblems()
    }
  }, [open, difficulty])

  const loadProblems = async () => {
    setLoading(true)
    try {
      // 修复：如果类型是选择题，显示提示（MetaSeekOJ只有编程题）
      if (type === 'choice') {
        toast.info('MetaSeekOJ当前只支持编程题，选择题功能开发中')
        // 暂时也显示编程题，但会标记为选择题类型
        // 未来可以连接到选择题系统
      }
      
      const data = await problemAPI.getProblemList({
        offset: 0,
        limit: 20,
        keyword: keyword || undefined,
        difficulty: difficulty || undefined
      })
      setProblems(data.results || [])
    } catch (error) {
      toast.error('加载题目失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadProblems()
  }

  const handleSelect = () => {
    if (selectedProblem) {
      onSelect(selectedProblem)
      onOpenChange(false)
      setSelectedProblem(null)
      setKeyword('')
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Low':
        return 'bg-green-100 text-green-700'
      case 'Mid':
        return 'bg-yellow-100 text-yellow-700'
      case 'High':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyText = (diff: string) => {
    switch (diff) {
      case 'Low':
        return '简单'
      case 'Mid':
        return '中等'
      case 'High':
        return '困难'
      default:
        return diff
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            {type === 'programming' ? '选择编程题' : '选择选择题'}
          </DialogTitle>
        </DialogHeader>

        {/* 搜索栏 */}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="搜索题目标题或ID..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {/* 难度筛选 */}
          <div className="flex gap-1">
            <Button
              variant={difficulty === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('')}
            >
              全部
            </Button>
            <Button
              variant={difficulty === 'Low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('Low')}
            >
              简单
            </Button>
            <Button
              variant={difficulty === 'Mid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('Mid')}
            >
              中等
            </Button>
            <Button
              variant={difficulty === 'High' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('High')}
            >
              困难
            </Button>
          </div>
        </div>

        {/* 题目列表 */}
        <ScrollArea className="h-[400px] border rounded-md">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Code2 className="h-12 w-12 mb-2" />
              <p>暂无题目</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedProblem?.id === problem.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedProblem(problem)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-mono text-sm text-gray-500">
                        #{problem._id}
                      </span>
                      <h4 className="font-medium text-gray-900">
                        {problem.title}
                      </h4>
                    </div>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {getDifficultyText(problem.difficulty)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{problem.accepted_number}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-gray-400" />
                      <span>{problem.submission_number}</span>
                    </div>
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedProblem}
          >
            插入题目
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

