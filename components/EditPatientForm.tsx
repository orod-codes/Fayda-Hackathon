"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import { X } from "lucide-react"

interface EditPatientFormProps {
  onClose: () => void
  onSubmit: (patientData: PatientData) => void
  patient: PatientData
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

export default function EditPatientForm({ onClose, onSubmit, patient }: EditPatientFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<PatientData>({...patient})
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
      <Card className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Edit Patient
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Update information for {patient.firstName} {patient.lastName}
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
                <Label>First Name *</Label>
                <Input required value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input required value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} placeholder="Enter last name" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={value => handleInputChange('gender', value)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input required type="date" value={formData.dateOfBirth} onChange={e => handleInputChange('dateOfBirth', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input required value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+251 911 123 456" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="patient@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address *</Label>
              <Textarea required value={formData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="Enter address" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Medical History</Label>
              <Textarea value={formData.medicalHistory} onChange={e => handleInputChange('medicalHistory', e.target.value)} placeholder="Medical history, allergies, etc." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact *</Label>
              <Input required value={formData.emergencyContact} onChange={e => handleInputChange('emergencyContact', e.target.value)} placeholder="Name & phone number" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">{isLoading ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}