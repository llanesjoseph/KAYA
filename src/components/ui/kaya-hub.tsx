import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Kaya Hub Section Component
const sectionVariants = cva(
  "p-6 rounded-kaya-md transition-all duration-300",
  {
    variants: {
      variant: {
        winter: "section-winter",
        spring: "section-spring", 
        transition: "section-transition",
        default: "section-winter",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(sectionVariants({ variant, className }))}
      {...props}
    />
  )
)
Section.displayName = "Section"

// Kaya Hub Typography Components
const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: "primary" | "secondary" | "winter" | "spring"
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
>(({ className, variant = "primary", as: Component = "h1", ...props }, ref) => {
  const variantClasses = {
    primary: "heading-primary",
    secondary: "heading-secondary", 
    winter: "heading-primary heading-winter",
    spring: "heading-primary heading-spring",
  }
  
  return (
    <Component
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
})
Heading.displayName = "Heading"

const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: "body" | "small" | "label"
  }
>(({ className, variant = "body", ...props }, ref) => {
  const variantClasses = {
    body: "text-body",
    small: "text-small",
    label: "text-label",
  }
  
  return (
    <p
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
})
Text.displayName = "Text"

// Kaya Hub Container with Atmospheric Effects
const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "seasonal-overlay" | "spring-glow"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "",
    "seasonal-overlay": "seasonal-overlay",
    "spring-glow": "spring-glow",
  }
  
  return (
    <div
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
})
Container.displayName = "Container"

// Kaya Hub Navigation Component
const Nav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("nav", className)}
    {...props}
  />
))
Nav.displayName = "Nav"

const NavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
  }
>(({ className, active = false, ...props }, ref) => (
  <a
    ref={ref}
    className={cn("nav-item", active && "active", className)}
    {...props}
  />
))
NavItem.displayName = "NavItem"

// Kaya Hub Form Components
const FormGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
))
FormGroup.displayName = "FormGroup"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("form-label", className)}
    {...props}
  />
))
Label.displayName = "Label"

// Kaya Hub Utility Components
const Divider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "winter" | "spring" | "transition"
  }
>(({ className, variant = "winter", ...props }, ref) => {
  const variantClasses = {
    winter: "border-winter-bark/30",
    spring: "border-new-shoots/30", 
    transition: "border-thaw-brown/30",
  }
  
  return (
    <div
      ref={ref}
      className={cn("border-t my-4", variantClasses[variant], className)}
      {...props}
    />
  )
})
Divider.displayName = "Divider"

// Kaya Hub Grid System
const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cols?: 1 | 2 | 3 | 4
    gap?: "sm" | "md" | "lg"
  }
>(({ className, cols = 2, gap = "md", ...props }, ref) => {
  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }
  
  const gapClasses = {
    sm: "gap-kaya-sm",
    md: "gap-kaya-md", 
    lg: "gap-kaya-lg",
  }
  
  return (
    <div
      ref={ref}
      className={cn("grid", colsClasses[cols], gapClasses[gap], className)}
      {...props}
    />
  )
})
Grid.displayName = "Grid"

// Kaya Hub Spacing Components
const Spacer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
  }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    xs: "h-kaya-xs",
    sm: "h-kaya-sm",
    md: "h-kaya-md",
    lg: "h-kaya-lg", 
    xl: "h-kaya-xl",
    xxl: "h-kaya-xxl",
  }
  
  return (
    <div
      ref={ref}
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
})
Spacer.displayName = "Spacer"

export {
  Section,
  Heading,
  Text,
  Container,
  Nav,
  NavItem,
  FormGroup,
  Label,
  Divider,
  Grid,
  Spacer,
}