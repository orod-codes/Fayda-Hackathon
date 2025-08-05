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
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } hover:shadow-lg transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>
              Patient Details
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              View detailed information about {patient.firstName} {patient.lastName}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className={
            theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>First Name:</strong> {patient.firstName}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Last Name:</strong> {patient.lastName}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Gender:</strong> {patient.gender}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Date of Birth:</strong> {patient.dateOfBirth}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Phone:</strong> {patient.phone}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Email:</strong> {patient.email}
            </div>
            <div className={`md:col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Address:</strong> {patient.address}
            </div>
            <div className={`md:col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Medical History:</strong> {patient.medicalHistory}
            </div>
            <div className={`md:col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Emergency Contact:</strong> {patient.emergencyContact}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className={`${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-100 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}