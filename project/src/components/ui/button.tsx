// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\ui\button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300 shadow-md hover:shadow-lg active:scale-95",
  {
    variants: {
      variant: {
        // PRIMARY: Rich Earth Brown - Award-Winning Depth
        default: "bg-rich-earth text-pure-cream hover:bg-deep-earth shadow-rich-earth/20 hover:shadow-rich-earth/40 hover:scale-[1.02] transform transition-all duration-300",
        
        // SECONDARY: Warm Sunset - Enhanced Premium Feel
        secondary: "bg-warm-sunset text-pure-cream hover:bg-burnt-orange shadow-warm-sunset/20 hover:shadow-warm-sunset/40 hover:scale-[1.02] transform transition-all duration-300",
        
        // ACCENT: Sage Green - Sophisticated Nature
        nature: "bg-sage-green text-pure-cream hover:bg-sage-green/90 shadow-sage-green/20 hover:shadow-sage-green/40 hover:scale-[1.02] transform transition-all duration-300",
        
        // OUTLINE: Award-Winning Sophistication
        outline: "border-2 border-rich-earth bg-transparent text-deep-forest hover:bg-gentle-lemon/20 hover:border-deep-earth hover:text-rich-earth hover:scale-[1.02] transform transition-all duration-300",
        
        // DESTRUCTIVE: Enhanced Error State
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] transform transition-all duration-300",
        
        // GHOST: Sophisticated Subtle Interaction
        ghost: "hover:bg-gentle-lemon/15 hover:text-rich-earth text-deep-forest hover:scale-[1.01] transform transition-all duration-300",
        
        // LINK: Premium Earth Brown Links
        link: "text-rich-earth underline-offset-4 hover:underline hover:text-warm-sunset transition-colors duration-300",
        
        // PREMIUM: Award-Winning Gradient
        premium: "bg-gradient-to-r from-rich-earth to-warm-sunset text-pure-cream hover:from-deep-earth hover:to-burnt-orange shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 relative overflow-hidden",
        
        // EARTH: Deep Forest Sophistication
        earth: "bg-deep-forest text-pure-cream hover:bg-charcoal-forest shadow-deep-forest/20 hover:shadow-deep-forest/40 hover:scale-[1.02] transform transition-all duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-12 rounded-full px-8 text-base",
        xl: "h-14 rounded-full px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }