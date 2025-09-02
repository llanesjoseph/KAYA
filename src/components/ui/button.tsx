import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono font-normal tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        // Kaya Hub Button Variants
        default: "btn btn-primary",
        primary: "btn btn-primary",
        secondary: "btn btn-secondary",
        winter: "btn border-winter-bark/60 text-winter-bark/90 hover:bg-winter-bark/10 hover:border-dead-leaves/80 hover:text-dead-leaves hover:-translate-y-0.5",
        spring: "btn border-new-shoots/60 text-new-shoots/90 hover:bg-new-shoots/10 hover:border-spring-moss/80 hover:text-spring-moss hover:-translate-y-0.5",
        transition: "btn border-thaw-brown/60 text-thaw-brown/90 hover:bg-thaw-brown/10 hover:border-early-growth/80 hover:text-early-growth hover:-translate-y-0.5",
        // Legacy variants (keep for compatibility)
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Kaya Hub Button Sizes
        default: "h-12 px-6 py-3 text-sm rounded-kaya-sm",
        sm: "h-9 px-4 py-2 text-xs rounded-kaya-sm",
        lg: "h-14 px-8 py-4 text-base rounded-kaya-md",
        icon: "h-10 w-10 rounded-kaya-sm",
        // Legacy sizes (keep for compatibility)
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
