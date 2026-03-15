import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-base ring-offset-background placeholder:text-slate-400/80 shadow-inner hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
