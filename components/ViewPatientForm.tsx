"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/ThemeContext"
import { X, User, Mail, Phone, Calendar, MapPin, AlertTriangle } from "lucide-react"

interface ViewPatientFormProps {
  onClose: () => void
  patient: {
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
}

export default function ViewPatientForm({ onClose, patient }: ViewPatientFormProps) {
  const { theme } = useTheme()
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Patient Details
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              View detailed information about {patient.firstName} {patient.lastName}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>First Name:</strong> {patient.firstName}</div>
            <div><strong>Last Name:</strong> {patient.lastName}</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Date of Birth:</strong> {patient.dateOfBirth}</div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div><strong>Email:</strong> {patient.email}</div>
            <div className="md:col-span-2"><strong>Address:</strong> {patient.address}</div>
            <div className="md:col-span-2"><strong>Medical History:</strong> {patient.medicalHistory}</div>
            <div className="md:col-span-2"><strong>Emergency Contact:</strong> {patient.emergencyContact}</div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}