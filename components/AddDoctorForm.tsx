"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import { X, User, Mail, Phone, Stethoscope, MapPin, Calendar, Shield } from "lucide-react"

interface AddDoctorFormProps {
  onClose: () => void
  onSubmit: (doctorData: DoctorData) => void
}

interface DoctorData {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialty: string
  licenseNumber: string
  experience: string
  education: string
  address: string
  password: string
  confirmPassword: string
}

export default function AddDoctorForm({ onClose, onSubmit }: AddDoctorFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<DoctorData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    experience: "",
    education: "",
    address: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

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

  const handleInputChange = (field: keyof DoctorData, value: string) => {
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
              Add New Doctor
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Register a new doctor in the hospital
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
                    placeholder="doctor@hospital.et"
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
                  Specialty *
                </Label>
                <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="emergency-medicine">Emergency Medicine</SelectItem>
                    <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="radiology">Radiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  License Number *
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="MD-2024-001"
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
                  Years of Experience *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    required
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="5"
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
                  Education *
                </Label>
                <Input
                  required
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="MBBS, MD, etc."
                  className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Textarea
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  className={`pl-10 ${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                  }`}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Password *
                </Label>
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Confirm Password *
                </Label>
                <Input
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600">
                {isLoading ? "Adding Doctor..." : "Add Doctor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 