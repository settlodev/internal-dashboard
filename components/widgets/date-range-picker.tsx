import React, { useState, useEffect } from "react"
import { format, addDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Predefined date ranges for quick selection
const PRESETS = {
  today: {
    label: "Today",
    getValue: () => {
      const today = new Date()
      return { from: today, to: today }
    }
  },
  yesterday: {
    label: "Yesterday",
    getValue: () => {
      const yesterday = addDays(new Date(), -1)
      return { from: yesterday, to: yesterday }
    }
  },
  thisWeek: {
    label: "This Week",
    getValue: () => {
      const today = new Date()
      const startOfWeek = addDays(today, -today.getDay()) // Sunday
      return { from: startOfWeek, to: today }
    }
  },
  lastWeek: {
    label: "Last Week",
    getValue: () => {
      const today = new Date()
      const endOfLastWeek = addDays(today, -today.getDay() - 1) // Saturday of previous week
      const startOfLastWeek = addDays(endOfLastWeek, -6) // Sunday of previous week
      return { from: startOfLastWeek, to: endOfLastWeek }
    }
  },
  thisMonth: {
    label: "This Month",
    getValue: () => {
      const today = new Date()
      return { from: startOfMonth(today), to: today }
    }
  },
  lastMonth: {
    label: "Last Month",
    getValue: () => {
      const today = new Date()
      const lastMonth = subMonths(today, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    }
  },
  last30Days: {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date()
      return { from: addDays(today, -30), to: today }
    }
  },
  last90Days: {
    label: "Last 90 Days",
    getValue: () => {
      const today = new Date()
      return { from: addDays(today, -90), to: today }
    }
  }
}

type DatePickerWithRangeProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'> & {
  value?: DateRange;
  onChange?: (date: DateRange) => void;
  defaultValue?: DateRange;
  align?: "start" | "center" | "end";
  disabled?: boolean;
};

export function DatePickerWithRange({
  className,
  value,
  onChange,
  defaultValue = {
    from: startOfMonth(new Date()),
    to: new Date(),
  },
  align = "start",
  disabled = false,
  ...props
}: DatePickerWithRangeProps) {
  // Initialize with either provided value or default
  const [date, setDate] = useState<DateRange | undefined>(value || defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  
  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  // Handle date change
  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    if (newDate && onChange) {
      onChange(newDate)
    }
  }

  // Handle preset selection
  const handlePresetChange = (preset: string) => {
    const selectedPreset = PRESETS[preset as keyof typeof PRESETS]
    if (selectedPreset) {
      const newRange = selectedPreset.getValue()
      handleSelect(newRange)
      // Close the popover after selecting a preset
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "h-9 px-3 py-2 w-auto md:w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="p-3 border-b">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Select Range</h4>
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
          <div className="p-3 border-t flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}