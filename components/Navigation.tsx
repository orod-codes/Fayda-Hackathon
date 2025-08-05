"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { Bell, LogOut, User, Settings } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import LanguageSwitcher from "@/components/LanguageSwitcher"

interface NavigationProps {
  title?: string
  showBack?: boolean
  backRoute?: string
  showThemeToggle?: boolean
  showNotifications?: boolean
  showUserMenu?: boolean
  onLogout?: () => void
  children?: React.ReactNode
}

export function Navigation({ 
  title, 
  showBack = false, 
  backRoute = "/", 
  showThemeToggle = true,
  showNotifications = true,
  showUserMenu = true,
  onLogout,
  children 
}: NavigationProps) {
  const router = useRouter()

  return (
    <nav className="border-b border-border/50 backdrop-blur-sm px-6 py-4 bg-background/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button variant="ghost" onClick={() => router.push(backRoute)}>
              ← Back
            </Button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={24} height={24} />
            </div>
            {title && (
              <span className="text-xl font-bold">{title}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher variant="compact" />
          {showThemeToggle && <ThemeToggle />}
          {showNotifications && (
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          )}
          {showUserMenu && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              {onLogout && (
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </nav>
  )
} 