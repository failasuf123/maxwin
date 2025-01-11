"use client"

import * as React from "react"
import { addDays, differenceInDays, format, startOfDay, isBefore } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (data: { startDate: Date | null; endDate: Date | null; totalDays: number }) => void
}

export default function DatePicker({ className, onDateChange }: DatePickerProps) {
  const today = startOfDay(new Date()) // Hari ini tanpa waktu
  const [date, setDate] = React.useState<DateRange | undefined>()

  const handleSelect = (selected: DateRange | undefined) => {
    if (selected?.from && isBefore(startOfDay(selected.from), today)) {
      alert("You have selected a past date.")
    } else if (selected?.to && isBefore(startOfDay(selected.to), today)) {
      alert("End date is in the past.")
    } else if (
      selected?.from &&
      selected?.to &&
      differenceInDays(selected.to, selected.from) > 5
    ) {
      alert("The date range cannot exceed 5 days.")
    } else {
      setDate(selected)
      const totalDays = selected?.from && selected?.to ? differenceInDays(selected.to, selected.from) + 1 : 0
      onDateChange({
        startDate: selected?.from || null,
        endDate: selected?.to || null,
        totalDays,
      })
    }
  }
  

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih Rentang Tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || today}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{
              before: today,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
