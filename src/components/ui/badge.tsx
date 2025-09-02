import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge transition-all duration-300",
  {
    variants: {
      variant: {
        // Kaya Hub Badge Variants
        default: "badge",
        winter: "badge-winter",
        spring: "badge-spring",
        transition: "badge border-thaw-brown/50 text-thaw-brown/80 hover:bg-thaw-brown/10 hover:text-thaw-brown hover:border-thaw-brown/70",
        // Legacy variants (keep for compatibility)
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
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
