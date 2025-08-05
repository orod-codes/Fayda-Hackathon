"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import { X, User, Mail, Phone, Calendar, MapPin, AlertTriangle } from "lucide-react"

interface AddPatientFormProps {
  onClose: () => void
  onSubmit: (patientData: PatientData) => void
}

interface PatientData {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  phone: string
  email: string
  address: string
  medicalHistory: string
  emergencyContact: string
}

export default function AddPatientForm({ onClose, onSubmit }: AddPatientFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<PatientData>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    medicalHistory: "",
    emergencyContact: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onSubmit(formData)
      onClose()
    }, 1000)
  }

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } hover:shadow-lg transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>
              Add New Patient
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Register a new patient in the hospital
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className={
            theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>First Name *</Label>
                <Input 
                  required 
                  value={formData.firstName} 
                  onChange={e => handleInputChange('firstName', e.target.value)} 
                  placeholder="Enter first name"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                      : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Last Name *</Label>
                <Input 
                  required 
                  value={formData.lastName} 
                  onChange={e => handleInputChange('lastName', e.target.value)} 
                  placeholder="Enter last name"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                      : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Gender *</Label>
                <Select value={formData.gender} onValueChange={value => handleInputChange('gender', value)}>
                  <SelectTrigger className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-black'
                  }`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Date of Birth *</Label>
                <Input 
                  required 
                  type="date" 
                  value={formData.dateOfBirth} 
                  onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-black'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Phone *</Label>
                <Input 
                  required 
                  value={formData.phone} 
                  onChange={e => handleInputChange('phone', e.target.value)} 
                  placeholder="+251 911 123 456"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                      : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Email</Label>
                <Input 
                  value={formData.email} 
                  onChange={e => handleInputChange('email', e.target.value)} 
                  placeholder="patient@email.com"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                      : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Address *</Label>
              <Textarea 
                required 
                value={formData.address} 
                onChange={e => handleInputChange('address', e.target.value)} 
                placeholder="Enter address" 
                rows={2}
                className={`${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                    : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                } focus:border-blue-500 focus:ring-blue-500`}
              />
            </div>
            <div className="space-y-2">
              <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Medical History</Label>
              <Textarea 
                value={formData.medicalHistory} 
                onChange={e => handleInputChange('medicalHistory', e.target.value)} 
                placeholder="Medical history, allergies, etc." 
                rows={2}
                className={`${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                    : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                } focus:border-blue-500 focus:ring-blue-500`}
              />
            </div>
            <div className="space-y-2">
              <Label className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Emergency Contact *</Label>
              <Input 
                required 
                value={formData.emergencyContact} 
                onChange={e => handleInputChange('emergencyContact', e.target.value)} 
                placeholder="Name & phone number"
                className={`${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                    : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                } focus:border-blue-500 focus:ring-blue-500`}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className={`${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-100 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Adding Patient..." : "Add Patient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}