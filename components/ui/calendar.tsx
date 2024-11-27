"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-popover rounded-md border", className)}
      classNames={{
        root: "w-full",
        months: "w-full",
        month: "w-full space-y-4",
        caption: "flex justify-between items-center px-2 py-4",
        caption_label: "text-sm font-medium",
        nav: "flex items-center space-x-1 bg-transparent",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-70"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "w-[14.28%] text-center text-muted-foreground font-medium text-sm",
        row: "flex w-full mt-2",
        cell: "w-[14.28%] text-center text-sm relative p-0",
        day: cn(
          "h-9 w-9 p-0 mx-auto font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground"
        ),
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground/50",
        day_disabled: "text-muted-foreground/50",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 