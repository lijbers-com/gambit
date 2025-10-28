import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-slate-200 bg-slate-100 text-slate-900",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-[#FEE2E2] bg-[#FEF2F2] text-[#DC2626]",
        success:
          "border-[#D1FAE5] bg-[#ECFDF5] text-[#059669]",
        warning:
          "border-[#FFEDD5] bg-[#FFF7ED] text-[#EA580C]",
        outline: 
          "border-slate-200 bg-transparent text-foreground",
        info:
          "border-slate-200 bg-slate-50 text-slate-600",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        large: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
