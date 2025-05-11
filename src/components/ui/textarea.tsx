
import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/utils/themeContext"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();
    
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          theme === 'light'
            ? "border-gray-400 bg-white text-black"
            : "border-premium-light/20 bg-transparent text-white placeholder:text-premium-light/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
