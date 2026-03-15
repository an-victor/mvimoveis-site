import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-slate-400/80 shadow-inner hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
