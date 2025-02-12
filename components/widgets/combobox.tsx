"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"

const means = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "bank",
    label: "Bank",
  },
  {
    value: "mobile",
    label: "Mobile Money",
  },
  {
    value: "lipa",
    label: "Lipa",
  },
]

export function PaymentMeans({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
        ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? means.find((mean) => mean.value === value)?.label
            : "Select payment means"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <Command>
        <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No payment type found.</CommandEmpty>
            <CommandGroup>
              {means.map((mean) => (
                <CommandItem
                  key={mean.value}
                  value={mean.value}
                  onSelect={() => {
                    onChange(mean.value) 
                    setOpen(false)
                    setTimeout(() => buttonRef.current?.focus(), 0)
                  }}
                >
                  {mean.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === mean.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
