"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function HospitalAdminLoginPage() {
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
        id: "admin-1",
        name: "Hospital Admin",
        email: email,
        role: "hospital-admin",
        hospitalId: "hospital-1"
      })
      router.push("/hospital-admin")
    }, 2000)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-zinc-900'
    }`}>
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/")} 
          className={`mb-6 ${
            theme === 'dark' ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className={`${
          theme === 'dark' 
            ? 'bg-zinc-800/50 backdrop-blur-sm border-zinc-700' 
            : 'bg-white/50 backdrop-blur-sm border-zinc-200'
        }`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'shadow-lg' : 'shadow-md'
              }`}>
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className={`text-2xl ${
                  theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
                }`}>Hospital Admin Login</CardTitle>
                <CardDescription className={
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                }>Manage your hospital operations</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 ${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 ${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-sm">
                Forgot your password?
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className={`${
            theme === 'dark' 
              ? 'bg-zinc-800/30 border border-zinc-700' 
              : 'bg-white/30 border border-zinc-200'
          } rounded-lg p-4`}>
            <h3 className={`font-semibold mb-2 ${
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
            }`}>Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className={`${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                <strong>Email:</strong> admin@tikuranbessa.et
              </div>
              <div className={`${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                <strong>Password:</strong> admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 