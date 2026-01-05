"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex md:flex-col items-center w-full p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform duration-200 ease-in-out group cursor-pointer">
      <DropdownMenu className="">
        <DropdownMenuTrigger asChild className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300">
          <Button variant="secondary" size="icon" className="rounded-full">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className={theme === 'light' ? 'bg-accent' : ''}
            onClick={() => setTheme("light")}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            className={theme === 'dark' ? 'bg-accent' : ''}
            onClick={() => setTheme("dark")}
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            className={theme === 'system' ? 'bg-accent' : ''}
            onClick={() => setTheme("system")}
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="flex-1 text-center md:text-left md:text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-300 font-bold">
        Theme
      </span>
    </div>
  )
}
