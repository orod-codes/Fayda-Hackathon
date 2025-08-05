"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import { X } from "lucide-react"

interface DoctorViewPatientFormProps {
  onClose: () => void
  patient: {
    name: string
    faydaId: string
    age: number
    gender: string
    lastVisit: string
    status: string
    emergencyContact: string
    bloodType: string
    allergies: string[]
    conditions: string[]
  }
}

export default function DoctorViewPatientForm({ onClose, patient }: DoctorViewPatientFormProps) {
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
              {patient.name} ({patient.faydaId})
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
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Name:</strong> {patient.name}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>FIN:</strong> {patient.faydaId}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Age:</strong> {patient.age}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Gender:</strong> {patient.gender}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Blood Type:</strong> {patient.bloodType}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Status:</strong> <Badge className={patient.status === 'emergency' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>{patient.status}</Badge>
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Last Visit:</strong> {patient.lastVisit}
            </div>
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Emergency Contact:</strong> {patient.emergencyContact}
            </div>
            <div className={`md:col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Allergies:</strong> {patient.allergies.join(', ')}
            </div>
            <div className={`md:col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Conditions:</strong> {patient.conditions.join(', ')}
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