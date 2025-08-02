"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/contexts/ThemeContext"
import { X, User, Mail, Phone, Stethoscope, MapPin, Calendar, Shield, Activity, Clock } from "lucide-react"

interface ViewDoctorFormProps {
  onClose: () => void
  doctor: {
    id: string
    name: string
    specialty: string
    status: string
    patients: number
    lastActive: string
    phone: string
    email: string
    hospital: string
  }
}

export default function ViewDoctorForm({ onClose, doctor }: ViewDoctorFormProps) {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Doctor Details
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              View detailed information about {doctor.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {doctor.name}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Doctor ID: {doctor.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Stethoscope className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Specialty
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Activity className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Status
                  </p>
                  <Badge className={
                                                doctor.status === 'active' ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white'
                  }>
                    {doctor.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Last Active
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {doctor.lastActive}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Current Patients
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {doctor.patients}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Phone
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {doctor.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Email
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {doctor.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
              Performance Metrics
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                  {doctor.patients}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Active Patients
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                  {doctor.status === 'active' ? '95%' : '75%'}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Availability
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                  4.8★
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Patient Rating
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 