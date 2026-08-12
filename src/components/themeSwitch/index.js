"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useThemeColorStore } from "@/store/useThemeColorStore"
import {
  sidebarContainerClass,
  sidebarIconWrapClass,
  sidebarLabelClass,
  sidebarIconStyle,
  sidebarLabelStyle,
} from "@/components/leftSidebar/sidebarItemStyles"

export function ThemeSwitch({ collapsed = false }) {
  const { setTheme, theme } = useTheme()
  const songThemeColor = useThemeColorStore((s) => s.themeColor)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div title={collapsed ? "Theme" : undefined} className={sidebarContainerClass(collapsed, false)}>
          <div className={sidebarIconWrapClass(collapsed)} style={sidebarIconStyle(songThemeColor, false)}>
            <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>

          <span className={sidebarLabelClass(collapsed)} style={sidebarLabelStyle(songThemeColor, false)}>
            Theme
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={theme === "light" ? "bg-accent" : ""}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          className={theme === "dark" ? "bg-accent" : ""}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          className={theme === "system" ? "bg-accent" : ""}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
