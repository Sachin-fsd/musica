"use client"

import { Check, Gem } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { useThemeColorStore } from "@/store/useThemeColorStore"
import {
  sidebarContainerClass,
  sidebarIconWrapClass,
  sidebarLabelClass,
  sidebarIconStyle,
  sidebarLabelStyle,
} from "../sidebarItemStyles"

const qualities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "average", label: "Average" },
  { value: "high", label: "High" },
  { value: "very_high", label: "Very High" },
]

const labels = {"low":"Low", "medium":"Medium", "average":"Average", "high":"High", "very_high": "Very High"}

export default function AdjustSongQuality({setIsSheetOpen, collapsed = false}) {
  const { setManualQuality, manualQuality } = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const themeColor = useThemeColorStore((s) => s.themeColor)

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
          title={collapsed ? `Quality (${labels[manualQuality]})` : undefined}
          className={sidebarContainerClass(collapsed, false)}
        >
          <div className={sidebarIconWrapClass(collapsed)} style={sidebarIconStyle(themeColor, false)}>
            <Gem size={collapsed ? 22 : 20} />
          </div>
          <span className={sidebarLabelClass(collapsed)} style={sidebarLabelStyle(themeColor, false)}>
            {collapsed ? "Quality" : `Quality (${labels[manualQuality]})`}
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
