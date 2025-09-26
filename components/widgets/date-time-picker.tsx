
"use client";
 
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = "Select date and time" 
}: DateTimePickerProps) {
  console.log("DateTimePicker rendered with:", { value, hasOnChange: !!onChange });

  const handleSelect = (date: Date | undefined) => {
    console.log("CALENDAR SELECTED:", date);
    
    if (date) {
      // Add current time to the selected date
      const now = new Date();
      const newDate = new Date(date);
      newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      
      console.log("CALLING onChange with:", newDate);
      onChange?.(newDate);
    } else {
      console.log("CALLING onChange with undefined");
      onChange?.(undefined);
    }
  };

  const displayValue = value && !isNaN(value.getTime()) ? value : null;

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !displayValue && "text-muted-foreground"
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue ? format(displayValue, "PPp") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={displayValue || undefined}
            onSelect={handleSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}