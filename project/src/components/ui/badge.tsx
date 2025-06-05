// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\ui\badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 duration-200",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#8B4513] text-[#FEFDFA] hover:bg-[#A0522D] shadow-sm",
        secondary:
          "border-transparent bg-[#FCF59E] text-[#2D342D] hover:bg-[#BC8F56] hover:text-[#FEFDFA]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-[#2D342D] border-[#BC8F56] hover:bg-[#FCF59E]/50",
        nature: "border-transparent bg-[#6B8E23] text-[#FEFDFA] hover:bg-[#556B2F]",
        earth: "border-transparent bg-[#654321] text-[#FEFDFA] hover:bg-[#8B4513]",
        golden: "border-transparent bg-[#DAA520] text-[#2D342D] hover:bg-[#B8860B]",
        leaf: "border-transparent bg-[#6B8E23]/20 text-[#2D342D] border-[#6B8E23]/30 hover:bg-[#6B8E23]/30",
        sand: "border-transparent bg-[#F4EECD] text-[#2D342D] border-[#BC8F56]/30 hover:bg-[#FAF3B0]",
        // Theme-specific badges for wildlife categories
        animal: "border-transparent bg-[#8B4513]/20 text-[#8B4513] border-[#8B4513]/30 hover:bg-[#8B4513]/30",
        location: "border-transparent bg-[#6B8E23]/20 text-[#6B8E23] border-[#6B8E23]/30 hover:bg-[#6B8E23]/30",
        duration: "border-transparent bg-[#BC8F56]/20 text-[#BC8F56] border-[#BC8F56]/30 hover:bg-[#BC8F56]/30",
        rating: "border-transparent bg-[#DAA520] text-[#2D342D] hover:bg-[#B8860B]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }