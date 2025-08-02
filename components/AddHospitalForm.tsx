"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Building, MapPin, Phone, Mail, Users, User, Lock } from "lucide-react"

interface AddHospitalFormProps {
  onClose: () => void
  onSubmit: (hospitalData: HospitalData) => void
}

interface HospitalData {
  name: string
  location: string
  address: string
  phone: string
  email: string
  type: string
  capacity: string
  description: string
  // Hospital Admin fields
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  adminPhone: string
  adminPassword: string
  adminConfirmPassword: string
}

export default function AddHospitalForm({ onClose, onSubmit }: AddHospitalFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<HospitalData>({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    type: "",
    capacity: "",
    description: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    adminConfirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.adminPassword !== formData.adminConfirmPassword) {
      alert("Admin passwords do not match!")
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

  const handleInputChange = (field: keyof HospitalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    // Validate required fields for step 1
    const requiredFields = ['name', 'location', 'address', 'phone', 'email', 'type', 'capacity']
    const missingFields = requiredFields.filter(field => !formData[field as keyof HospitalData])
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }
    
    setActiveStep(2)
  }

  const prevStep = () => {
    setActiveStep(1)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-4xl ${
        theme === 'dark' ? 'bg-blue-900 border-blue-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Add New Hospital with Admin
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Register a new hospital and create its admin account
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                activeStep >= 1 ? 'text-blue-500' : 'text-zinc-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStep >= 1 ? 'bg-blue-500 text-white' : 'bg-zinc-600 text-zinc-300'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Hospital Details</span>
              </div>
              <div className="w-8 h-1 bg-zinc-600"></div>
              <div className={`flex items-center space-x-2 ${
                activeStep >= 2 ? 'text-blue-500' : 'text-zinc-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStep >= 2 ? 'bg-blue-500 text-white' : 'bg-zinc-600 text-zinc-300'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Admin Account</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                      Hospital Name *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter hospital name"
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
                      Location *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Region"
                        className={`pl-10 ${
                          theme === 'dark' 
                            ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                            : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Full Address *
                  </Label>
                  <Textarea
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete address"
                    className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                    }`}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="hospital@example.com"
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
                      Hospital Type *
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className={
                        theme === 'dark' 
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                          : 'bg-white border-zinc-300 text-zinc-900'
                      }>
                        <SelectValue placeholder="Select hospital type" />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                        <SelectItem value="general">General Hospital</SelectItem>
                        <SelectItem value="specialized">Specialized Hospital</SelectItem>
                        <SelectItem value="university">University Hospital</SelectItem>
                        <SelectItem value="private">Private Hospital</SelectItem>
                        <SelectItem value="government">Government Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                      Bed Capacity *
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        placeholder="Number of beds"
                        className={`pl-10 ${
                          theme === 'dark' 
                            ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                            : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Description
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the hospital..."
                    className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500'
                    }`}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 text-lg"
                  >
                    Next: Create Admin Account →
                  </Button>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Hospital Information Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Name:</span> {formData.name}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Location:</span> {formData.location}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Type:</span> {formData.type}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Capacity:</span> {formData.capacity} beds
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                      Admin First Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        value={formData.adminFirstName}
                        onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
                        placeholder="Enter admin first name"
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
                      Admin Last Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        value={formData.adminLastName}
                        onChange={(e) => handleInputChange('adminLastName', e.target.value)}
                        placeholder="Enter admin last name"
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
                      Admin Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => handleInputChange('adminEmail', e.target.value)}
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
                      Admin Phone *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        type="tel"
                        value={formData.adminPhone}
                        onChange={(e) => handleInputChange('adminPhone', e.target.value)}
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
                      Admin Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        type={showPassword ? "text" : "password"}
                        value={formData.adminPassword}
                        onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                        placeholder="Enter admin password"
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
                        value={formData.adminConfirmPassword}
                        onChange={(e) => handleInputChange('adminConfirmPassword', e.target.value)}
                        placeholder="Confirm admin password"
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

                <div className="flex justify-end space-x-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    ← Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 text-lg">
                    {isLoading ? "Creating Hospital & Admin..." : "Create Hospital & Admin"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 