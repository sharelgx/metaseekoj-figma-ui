/**
 * 点卡余额徽章组件
 * 显示用户的点卡余额，点击可查看详情
 */

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Coins, TrendingUp, TrendingDown, History, Loader2 } from 'lucide-react'
import { getCreditsBalance, getCreditsStatistics, getCreditTransactionHistory, type CreditTransaction, type CreditStatistics } from '@/api/credits'
import { toast } from 'sonner'

export function CreditsBadge() {
  const [credits, setCredits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [statistics, setStatistics] = useState<CreditStatistics | null>(null)
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])

  useEffect(() => {
    loadCredits()
  }, [])

  const loadCredits = async () => {
    try {
      const data = await getCreditsBalance()
      setCredits(data.available_credits)
    } catch (error: any) {
      console.warn('加载点卡余额失败（静默处理）:', error)
      // 静默处理，不显示toast错误，避免干扰用户
      setCredits(0)  // 默认显示0
    } finally {
      setIsLoading(false)
    }
  }

  const loadDetails = async () => {
    try {
      const [stats, history] = await Promise.all([
        getCreditsStatistics(),
        getCreditTransactionHistory({ limit: 10 })
      ])
      setStatistics(stats)
      setTransactions(history)
    } catch (error: any) {
      console.error('加载点卡详情失败:', error)
      toast.error('加载点卡详情失败')
    }
  }

  const handleClick = () => {
    setShowDialog(true)
    loadDetails()
  }

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>加载中...</span>
      </Badge>
    )
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Badge
          variant={credits > 20 ? "default" : "destructive"}
          className="flex items-center gap-1 cursor-pointer bg-gradient-to-r from-[#FFA726] to-[#F57C00] text-white"
          onClick={handleClick}
        >
          <Coins className="h-3 w-3" />
          <span>{credits} 点卡</span>
        </Badge>
      </motion.div>

      {/* 点卡详情Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#525252] flex items-center gap-2">
              <Coins className="h-6 w-6 text-[#FFA726]" />
              我的点卡
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 余额概览 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#3DBAFB] to-[#8ED1A9]">
                <p className="text-sm text-white/80">可用点卡</p>
                <p className="text-3xl font-bold text-white">{credits}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#e5e5e5]">
                <p className="text-sm text-[#737373]">累计获得</p>
                <p className="text-2xl font-semibold text-[#525252] flex items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  {statistics?.total_earned || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#e5e5e5]">
                <p className="text-sm text-[#737373]">累计消费</p>
                <p className="text-2xl font-semibold text-[#525252] flex items-center gap-1">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  {statistics?.total_spent || 0}
                </p>
              </div>
            </div>

            {/* 充值按钮 */}
            <div className="flex justify-center">
              <Button
                className="bg-gradient-to-r from-[#FFA726] to-[#F57C00] hover:opacity-90 text-white"
                onClick={() => {
                  toast.info('充值功能开发中，请联系管理员手动充值')
                }}
              >
                💳 充值点卡
              </Button>
            </div>

            {/* 交易记录 */}
            <div>
              <h3 className="text-lg font-semibold text-[#525252] mb-3 flex items-center gap-2">
                <History className="h-5 w-5" />
                最近交易记录
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-center text-[#737373] py-8">暂无交易记录</p>
                ) : (
                  transactions.map((trans) => (
                    <div
                      key={trans.id}
                      className="p-3 rounded-lg border border-[#e5e5e5] flex items-center justify-between hover:bg-[#F5F7FA] transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#525252]">{trans.description}</p>
                        <p className="text-xs text-[#737373]">
                          {new Date(trans.created_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${trans.transaction_type === 'recharge' ? 'text-green-500' : 'text-red-500'}`}>
                          {trans.transaction_type === 'recharge' ? '+' : '-'}{trans.amount}
                        </p>
                        <p className="text-xs text-[#737373]">余额: {trans.balance_after}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

