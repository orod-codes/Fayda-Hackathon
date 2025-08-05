"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useRouter } from "next/navigation"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, Shield, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic';

export default function SuperAdminLoginPage() {
  const { translations, language } = useLanguage()
  const { theme } = useTheme()
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      login({
        id: "super-admin-1",
        name: "Super Admin",
        email: email,
        role: "super-admin"
      })
      router.push("/super-admin")
    }, 2000)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100 text-black'
    }`}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")} 
            className={`${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            } transition-colors duration-200`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher variant="compact" />
            <ThemeToggle />
          </div>
        </div>

        <Card className={`${
          theme === 'dark' 
            ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300' 
            : 'bg-white/50 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300'
        }`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={32} height={32} />
              </div>
              <div>
                <CardTitle className={`text-2xl ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Super Admin Login</CardTitle>
                <CardDescription className={
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }>System-wide administration access</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label className={theme === 'dark' ? 'text-white' : 'text-black'}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-500'
                  } transition-colors duration-200`}
                />
              </div>
            </div>

            <div>
              <Label className={theme === 'dark' ? 'text-white' : 'text-black'}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-500'
                  } transition-colors duration-200`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                Forgot your password?
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className={`${
            theme === 'dark' 
              ? 'bg-gray-800/30 border border-gray-700' 
              : 'bg-white/30 border border-gray-200'
          } rounded-lg p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
            <h3 className={`font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <strong>Email:</strong> superadmin@hakim-ai.gov.et
              </div>
              <div className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <strong>Password:</strong> superadmin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 