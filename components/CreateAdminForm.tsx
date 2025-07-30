"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import { X, User, Mail, Lock, Building, Phone, Shield } from "lucide-react"

interface CreateAdminFormProps {
  onClose: () => void
  onSubmit: (adminData: AdminData) => void
}

interface AdminData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  hospitalId: string
  password: string
  confirmPassword: string
}

export default function CreateAdminForm({ onClose, onSubmit }: CreateAdminFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<AdminData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    hospitalId: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onSubmit(formData)
      onClose()
    }, 1000)
  }

  const handleInputChange = (field: keyof AdminData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Create Admin Account
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Create a new administrative account
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  First Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Last Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="admin@hospital.com"
                    className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+251 911 123 456"
                    className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Role *
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="hospital-admin">Hospital Admin</SelectItem>
                    <SelectItem value="system-admin">System Admin</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Assigned Hospital *
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.hospitalId} onValueChange={(value) => handleInputChange('hospitalId', value)}>
                    <SelectTrigger className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }`}>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                      <SelectItem value="1">Tikur Anbessa Specialized Hospital</SelectItem>
                      <SelectItem value="2">St. Paul's Hospital</SelectItem>
                      <SelectItem value="3">Jimma University Medical Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
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
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 