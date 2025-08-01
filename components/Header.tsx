"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title?: string
  showBack?: boolean
  backRoute?: string
  showThemeToggle?: boolean
  children?: React.ReactNode
}

export function Header({ 
  title, 
  showBack = false, 
  backRoute = "/", 
  showThemeToggle = true,
  children 
}: HeaderProps) {
  const router = useRouter()

  return (
    <header className="border-b border-border/50 backdrop-blur-sm px-6 py-4 bg-background/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button variant="ghost" onClick={() => router.push(backRoute)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
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
          {showThemeToggle && <ThemeToggle />}
          {children}
        </div>
      </div>
    </header>
  )
} 