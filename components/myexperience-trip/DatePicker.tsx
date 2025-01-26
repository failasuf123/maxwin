"use client"

import * as React from "react"
import { addDays, format, startOfDay, isBefore } from "date-fns"
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
  onDateChange: (data: { startDate: Date | null; endDate: Date | null; totalDays: number }) => void,
  totalDays: string,
}

export default function DatePicker({ className, onDateChange, totalDays }: DatePickerProps) {
  const today = startOfDay(new Date()) // Hari ini tanpa waktu
  const [date, setDate] = React.useState<DateRange | undefined>()

  const handleSelect = (selected: DateRange | undefined) => {
    if (selected?.from && isBefore(startOfDay(selected.from), today)) {
      alert("You have selected a past date.")
    } else {
      const startDate = selected?.from || undefined
      const parsedTotalDays = parseInt(totalDays, 10) || 0
      const endDate = startDate ? addDays(startDate, parsedTotalDays - 1) : undefined
  
      setDate({
        from: startDate,
        to: endDate,
      })
  
      onDateChange({
        startDate: startDate || null,
        endDate: endDate || null,
        totalDays: parsedTotalDays,
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
              <span>Pilih Rentang Tanggal dalam {totalDays} hari</span>
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
