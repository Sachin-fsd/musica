"use client"

import { Check, Cog } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useContext, useState } from "react"
import { UserContext } from "@/context"
import { Label } from "@/components/ui/label"

const qualities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "average", label: "Average" },
  { value: "high", label: "High" },
  { value: "very_high", label: "Very High" },
]

const labels = {"low":"Low", "medium":"Medium", "average":"Average", "high":"High", "very_high": "Very High"}

export default function AdjustSongQuality({setIsSheetOpen}) {
  const { setManualQuality, manualQuality } = useContext(UserContext)
  const [open, setOpen] = useState(false)

  const handleSelect = (currentValue) => {
    setManualQuality(currentValue)  // Set the manual quality
    setOpen(false);
    setIsSheetOpen && setIsSheetOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} className="">
      <PopoverTrigger asChild className="cursor-pointer">
        <Label
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex md:flex-col items-center w-full p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform duration-200 ease-in-out group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
            <Cog />
          </div>
          <span className="text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold">
            Quality
          </span>
          <span className="md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold whitespace-nowrap md:ml-0 ml-1">
            {`(${labels[manualQuality]})`}
          </span>
          
        </Label>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No quality found.</CommandEmpty>
            <CommandGroup>
              {qualities.map((quality) => (
                <CommandItem
                  key={quality.value}
                  value={quality.value}
                  onSelect={() => handleSelect(quality.value)}
                  className={cn(
                    "p-2 rounded-md",
                    manualQuality === quality.value ? "bg-accent" : "",
                    "cursor-pointer "
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      manualQuality === quality.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {quality.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
