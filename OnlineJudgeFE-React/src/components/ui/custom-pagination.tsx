import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CustomPaginationProps {
  current: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  showSizer?: boolean
}

export function CustomPagination({
  current,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showSizer = true
}: CustomPaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (current - 1) * pageSize + 1
  const endItem = Math.min(current * pageSize, total)

  const handlePrevious = () => {
    if (current > 1) {
      onPageChange(current - 1)
    }
  }

  const handleNext = () => {
    if (current < totalPages) {
      onPageChange(current + 1)
    }
  }

  const handlePageClick = (page: number) => {
    onPageChange(page)
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (current > 3) {
        pages.push('...')
      }

      const start = Math.max(2, current - 1)
      const end = Math.min(totalPages - 1, current + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  if (total === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-gray-500">
        显示 {startItem} 到 {endItem} 共 {total} 条
      </div>
      
      <div className="flex items-center gap-2">
        {showSizer && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">每页</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">条</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={current === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={current === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageClick(page)}
                className="min-w-[36px]"
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2 text-gray-500">
                {page}
              </span>
            )
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={current === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomPagination

