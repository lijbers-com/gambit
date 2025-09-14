import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface SortOption {
  value: string
  label: string
}

export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  sortOptions?: SortOption[]
  selectedSort?: string
  onSortChange?: (value: string) => void
  className?: string
  showSort?: boolean
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  sortOptions = [],
  selectedSort,
  onSortChange,
  className,
  showSort = true,
}) => {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Calculate the range of pages to show around current page
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i)
    }

    // Always show first page
    if (rangeStart > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    // Add the calculated range
    rangeWithDots.push(...range)

    // Always show last page
    if (rangeEnd < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const selectedSortLabel = sortOptions.find(option => option.value === selectedSort)?.label || 'Latest'

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3",
      className
    )}>
      {/* Pagination - Left aligned */}
      <nav role="navigation" aria-label="pagination" className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "ghost"}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "h-9 w-9 text-sm",
                isActive 
                  ? "bg-slate-900 text-white hover:bg-slate-800" 
                  : "hover:bg-white"
              )}
            >
              {pageNumber}
            </Button>
          )
        })}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>

      {/* Sort Dropdown - Right aligned */}
      {showSort && sortOptions.length > 0 && onSortChange && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="whitespace-nowrap">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 text-sm gap-2 min-w-[140px] justify-between">
                {selectedSortLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    selectedSort === option.value && "bg-accent"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}