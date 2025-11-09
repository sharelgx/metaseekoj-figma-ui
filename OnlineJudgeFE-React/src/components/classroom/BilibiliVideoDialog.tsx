/**
 * B站视频插入对话框
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Video, Link, Code, CheckCircle2, AlertCircle } from 'lucide-react'
import { parseBilibiliUrl, parseIframeCode, generateVideoMarkdown, type BilibiliVideoInfo } from '@/utils/bilibili'
import { toast } from 'sonner'

interface BilibiliVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (markdown: string, videoInfo: BilibiliVideoInfo) => void
}

export function BilibiliVideoDialog({
  open,
  onOpenChange,
  onInsert
}: BilibiliVideoDialogProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [iframeCode, setIframeCode] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [parsedInfo, setParsedInfo] = useState<BilibiliVideoInfo | null>(null)
  const [activeTab, setActiveTab] = useState<'url' | 'iframe'>('url')

  const handleParseUrl = () => {
    if (!videoUrl.trim()) {
      toast.error('请输入B站视频链接')
      return
    }

    const info = parseBilibiliUrl(videoUrl)
    if (!info) {
      toast.error('无法识别的B站视频链接，请检查格式')
      return
    }

    setParsedInfo(info)
    toast.success('视频链接解析成功！')
  }

  const handleParseIframe = () => {
    if (!iframeCode.trim()) {
      toast.error('请输入iframe代码')
      return
    }

    const info = parseIframeCode(iframeCode)
    if (!info) {
      toast.error('无法解析iframe代码，请检查格式')
      return
    }

    setParsedInfo(info)
    toast.success('iframe代码解析成功！')
  }

  const handleInsert = () => {
    if (!parsedInfo) {
      toast.error('请先解析视频链接')
      return
    }

    const markdown = generateVideoMarkdown(parsedInfo, videoTitle)
    onInsert(markdown, parsedInfo)
    
    // 重置状态
    setVideoUrl('')
    setIframeCode('')
    setVideoTitle('')
    setParsedInfo(null)
    onOpenChange(false)
    
    toast.success('视频已插入！')
  }

  const handleReset = () => {
    setVideoUrl('')
    setIframeCode('')
    setVideoTitle('')
    setParsedInfo(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-[#00A1D6]" />
            插入B站视频
          </DialogTitle>
          <DialogDescription>
            支持通过URL或iframe代码插入B站视频到课件中
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'url' | 'iframe')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              视频链接
            </TabsTrigger>
            <TabsTrigger value="iframe" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              iframe代码
            </TabsTrigger>
          </TabsList>

          {/* 方式1：通过URL */}
          <TabsContent value="url" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="video-url">B站视频链接</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="video-url"
                  placeholder="https://www.bilibili.com/video/BV1TpyQBvEFu 或 BV1TpyQBvEFu"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleParseUrl()}
                />
                <Button onClick={handleParseUrl} variant="outline">
                  解析
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                支持完整链接或BV号
              </p>
            </div>
          </TabsContent>

          {/* 方式2：通过iframe代码 */}
          <TabsContent value="iframe" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="iframe-code">iframe嵌入代码</Label>
              <Textarea
                id="iframe-code"
                placeholder='<iframe src="//player.bilibili.com/player.html?..." ...></iframe>'
                value={iframeCode}
                onChange={(e) => setIframeCode(e.target.value)}
                rows={6}
                className="mt-2 font-mono text-xs"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  粘贴完整的iframe代码
                </p>
                <Button onClick={handleParseIframe} variant="outline" size="sm">
                  解析
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 视频标题 */}
        <div>
          <Label htmlFor="video-title">视频标题（可选）</Label>
          <Input
            id="video-title"
            placeholder="例如：Python循环语句详解"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            为视频添加一个描述性标题
          </p>
        </div>

        {/* 解析结果 */}
        {parsedInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">解析成功</span>
            </div>
            <div className="space-y-2 text-sm">
              {parsedInfo.bvid && (
                <div className="flex gap-2">
                  <span className="text-gray-600 min-w-[60px]">BV号:</span>
                  <span className="font-mono text-gray-900">{parsedInfo.bvid}</span>
                </div>
              )}
              {parsedInfo.aid && (
                <div className="flex gap-2">
                  <span className="text-gray-600 min-w-[60px]">AV号:</span>
                  <span className="font-mono text-gray-900">{parsedInfo.aid}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-gray-600 min-w-[60px]">分P:</span>
                <span className="font-mono text-gray-900">P{parsedInfo.part}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600 min-w-[60px]">播放器:</span>
                <span className="font-mono text-xs text-gray-600 break-all">
                  {parsedInfo.embedUrl}
                </span>
              </div>
            </div>
            
            {/* 预览 */}
            <div className="mt-4 border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 text-xs text-gray-600">
                预览效果
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  src={parsedInfo.embedUrl}
                  className="w-full h-full"
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        {!parsedInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 space-y-2">
                <p className="font-medium">使用说明：</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>复制B站视频页面的链接，例如：https://www.bilibili.com/video/BV1TpyQBvEFu</li>
                  <li>或者直接输入BV号，例如：BV1TpyQBvEFu</li>
                  <li>也可以使用B站的iframe嵌入代码（点击"iframe代码"标签页）</li>
                  <li>视频将以响应式播放器的形式嵌入到幻灯片中</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!parsedInfo}
            className="bg-[#00A1D6] hover:bg-[#0090C1]"
          >
            <Video className="h-4 w-4 mr-2" />
            插入视频
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

