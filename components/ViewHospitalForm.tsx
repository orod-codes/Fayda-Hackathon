"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Building, MapPin, Phone, Mail, Users, Calendar, Activity } from "lucide-react"

interface ViewHospitalFormProps {
  onClose: () => void
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

export default function ViewHospitalForm({ onClose, hospital }: ViewHospitalFormProps) {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Hospital Details
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              View detailed information about {hospital.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {hospital.name}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Hospital ID: {hospital.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Location
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {hospital.location}
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
                    hospital.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }>
                    {hospital.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Last Activity
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {hospital.lastActivity}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Patients
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {hospital.patients.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Doctors
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {hospital.doctors}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Admins
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {hospital.admins}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
              Quick Statistics
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                  {Math.round((hospital.patients / hospital.doctors) * 10) / 10}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Patients per Doctor
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                  {Math.round((hospital.doctors / hospital.admins) * 10) / 10}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Doctors per Admin
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                  {hospital.status === 'active' ? '100%' : '75%'}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Operational Status
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