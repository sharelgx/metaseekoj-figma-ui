import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Bell, ChevronRight, Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { homeAPI } from '@/api/home'
import type { Announcement } from '@/types/home'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await homeAPI.getAnnouncements()
      setAnnouncements(response.data?.results?.slice(0, 3) || [])
    } catch (error) {
      console.error('加载公告失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="pt-6 text-center text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>暂无公告</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement, index) => (
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      <Bell className="h-3 w-3 mr-1" />
                      公告
                    </Badge>
                    {announcement.visible && (
                      <Badge variant="destructive" className="animate-pulse">
                        置顶
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {announcement.title}
                  </h4>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{announcement.created_by?.username || '管理员'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(announcement.create_time)}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

