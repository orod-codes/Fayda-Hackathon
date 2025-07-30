"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Building, MapPin, Phone, Mail, Users } from "lucide-react"

interface EditHospitalFormProps {
  onClose: () => void
  onSubmit: (hospitalData: HospitalData) => void
  hospital: {
    id: number
    name: string
    location: string
    status: string
    patients: number
    doctors: number
    admins: number
    lastActivity: string
  }
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
  status: string
}

export default function EditHospitalForm({ onClose, onSubmit, hospital }: EditHospitalFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<HospitalData>({
    name: hospital.name,
    location: hospital.location,
    address: "123 Main Street, " + hospital.location,
    phone: "+251 911 123 456",
    email: `${hospital.name.toLowerCase().replace(/\s+/g, '')}@hospital.gov.et`,
    type: "general",
    capacity: "500",
    description: "A leading healthcare facility providing comprehensive medical services.",
    status: hospital.status
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Edit Hospital
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Update information for {hospital.name}
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
                  Status *
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                {isLoading ? "Updating..." : "Update Hospital"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 