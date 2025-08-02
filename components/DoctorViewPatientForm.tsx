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
      <Card className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Patient Details
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              {patient.name} ({patient.faydaId})
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Name:</strong> {patient.name}</div>
            <div><strong>FIN:</strong> {patient.faydaId}</div>
            <div><strong>Age:</strong> {patient.age}</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Blood Type:</strong> {patient.bloodType}</div>
                            <div><strong>Status:</strong> <Badge className={patient.status === 'emergency' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>{patient.status}</Badge></div>
            <div><strong>Last Visit:</strong> {patient.lastVisit}</div>
            <div><strong>Emergency Contact:</strong> {patient.emergencyContact}</div>
            <div className="md:col-span-2"><strong>Allergies:</strong> {patient.allergies.join(', ')}</div>
            <div className="md:col-span-2"><strong>Conditions:</strong> {patient.conditions.join(', ')}</div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}