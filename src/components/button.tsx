import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, size = "md", ...props }, ref) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
      size === "sm" && "px-3 py-1 text-sm",
      size === "md" && "px-4 py-2 text-base",
      size === "lg" && "px-6 py-3 text-lg",
      className,
    )}
    ref={ref}
    {...props}
  />
))
Button.displayName = "Button"

export { Button }
