"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import AddDoctorForm from "@/components/AddDoctorForm"
import ViewDoctorForm from "@/components/ViewDoctorForm"
import EditDoctorForm from "@/components/EditDoctorForm"
import AddPatientForm from "@/components/AddPatientForm"
import ViewPatientForm from "@/components/ViewPatientForm"
import EditPatientForm from "@/components/EditPatientForm"
import HospitalAdminSettingsForm from "@/components/HospitalAdminSettingsForm"
import { 
  Users, 
  Stethoscope, 
  Activity, 
  AlertTriangle,
  Plus,
  Search,
  Settings,
  LogOut,
  BarChart3,
  Building,
  Phone,
  Mail,
  Calendar,
  FileText,
  Shield,
  ArrowLeft,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  User
} from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic';

export default function HospitalAdminPage() {
  const { translations, language } = useLanguage()
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [showViewDoctorForm, setShowViewDoctorForm] = useState(false)
  const [showEditDoctorForm, setShowEditDoctorForm] = useState(false)

  // Patient state
  const [patients, setPatients] = useState([
    {
      firstName: "Amanuel",
      lastName: "Tadesse",
      gender: "male",
      dateOfBirth: "1990-01-01",
      phone: "+251 911 111 111",
      email: "amanuel.tadesse@email.com",
      address: "Addis Ababa, Ethiopia",
      medicalHistory: "Diabetes, Hypertension",
      emergencyContact: "Sara Tadesse, +251 922 222 222"
    },
    {
      firstName: "Mekdes",
      lastName: "Bekele",
      gender: "female",
      dateOfBirth: "1985-05-12",
      phone: "+251 922 333 444",
      email: "mekdes.bekele@email.com",
      address: "Adama, Ethiopia",
      medicalHistory: "Asthma",
      emergencyContact: "Bekele Mekonnen, +251 933 444 555"
    }
  ])
  const [patientSearch, setPatientSearch] = useState("")
  const [showAddPatientForm, setShowAddPatientForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showViewPatientForm, setShowViewPatientForm] = useState(false)
  const [showEditPatientForm, setShowEditPatientForm] = useState(false)

  // Hospital settings state
  const [hospitalSettings, setHospitalSettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "8",
    autoBackup: true,
    dataRetention: "7",
    notifications: true,
    maintenanceMode: false,
    language: "en",
    timezone: "Africa/Addis_Ababa"
  })
  const [showSettingsForm, setShowSettingsForm] = useState(false)
  const handleSaveSettings = (settings: any) => {
    setHospitalSettings(settings)
    alert("Settings saved successfully!")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAddDoctor = (doctorData: any) => {
    console.log("Adding doctor:", doctorData)
    alert("Doctor added successfully!")
  }

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setShowViewDoctorForm(true)
  }

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setShowEditDoctorForm(true)
  }

  const handleUpdateDoctor = (doctorData: any) => {
    console.log("Updating doctor:", doctorData)
    alert("Doctor updated successfully!")
  }

  const doctors = [
    {
      id: "1",
      name: "Dr. Abebe Kebede",
      specialty: "Cardiology",
      status: "active",
      patients: 45,
      lastActive: "2 hours ago",
      phone: "+251 911 234 567",
      email: "abebe.kebede@hospital.et",
      hospital: "Tikur Anbessa Hospital"
    },
    {
      id: "2",
      name: "Dr. Fatima Ahmed",
      specialty: "Pediatrics",
      status: "active",
      patients: 32,
      lastActive: "1 hour ago",
      phone: "+251 922 345 678",
      email: "fatima.ahmed@hospital.et",
      hospital: "Tikur Anbessa Hospital"
    },
    {
      id: "3",
      name: "Dr. Mohammed Omar",
      specialty: "Emergency Medicine",
      status: "offline",
      patients: 28,
      lastActive: "3 days ago",
      phone: "+251 933 456 789",
      email: "mohammed.omar@hospital.et",
      hospital: "Tikur Anbessa Hospital"
    }
  ]

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPatients = patients.filter(
    p =>
      p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.lastName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone.includes(patientSearch)
  )

  const handleAddPatient = (patient: any) => {
    setPatients(prev => [...prev, patient])
    alert("Patient added successfully!")
  }
  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setShowViewPatientForm(true)
  }
  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient)
    setShowEditPatientForm(true)
  }
  const handleUpdatePatient = (updated: any) => {
    setPatients(prev => prev.map(p => (p === selectedPatient ? updated : p)))
    alert("Patient updated successfully!")
  }
  const handleDeletePatient = (patient: any) => {
    if (confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
      setPatients(prev => prev.filter(p => p !== patient))
      alert("Patient deleted successfully!")
    }
  }

  const hospitalStats = {
    totalPatients: 156,
    activeDoctors: 12,
    todayConsultations: 89,
    emergencyCases: 3,
    totalRevenue: "2.5M ETB",
    patientSatisfaction: "94%"
  }

  const recentActivity = [
    {
      id: "1",
      type: "doctor_added",
      description: "New doctor account created",
      doctor: "Dr. Sarah Johnson",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: "2",
      type: "emergency",
      description: "Emergency case reported",
      details: "Chest pain patient",
      time: "4 hours ago",
      status: "urgent"
    },
    {
      id: "3",
      type: "consultation",
      description: "Patient consultation completed",
      doctor: "Dr. Abebe Kebede",
      time: "6 hours ago",
      status: "completed"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={["hospital-admin"]} loginRoute="/hospital-admin/login">
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-black'
      }`}>
      {/* Header */}
      <header className={`border-b px-4 py-4 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={32} height={32} />
            <span className="text-xl font-semibold text-sky-400">Hospital Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher variant="compact" />
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className={`${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white">HA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-gray-100' : 'text-black'
                      }`}>Hospital Admin</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Tikur Anbessa Hospital</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === "overview" 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </Button>
                    <Button 
                      variant={activeTab === "doctors" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === "doctors" 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab("doctors")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Doctors
                    </Button>
                    <Button 
                      variant={activeTab === "analytics" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === "analytics" 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button 
                      variant={activeTab === "activity" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === "activity" 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab("activity")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Activity Log
                    </Button>
                    <Button 
                      variant={activeTab === "patients" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === "patients" 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab("patients")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Patient Records
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === "settings" 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Hospital Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Hospital Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{hospitalStats.totalPatients}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Total Patients</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-8 w-8 text-green-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{hospitalStats.activeDoctors}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Active Doctors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{hospitalStats.todayConsultations}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Today's Consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{hospitalStats.emergencyCases}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Total Revenue</p>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{hospitalStats.totalRevenue}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Patient Satisfaction</p>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{hospitalStats.patientSatisfaction}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card 
                    className={`${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                    onClick={() => setShowAddDoctorForm(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <UserPlus className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-black'
                      }`}>Add New Doctor</h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Create doctor account</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-black'
                      }`}>View Analytics</h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Hospital statistics</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                    onClick={() => setActiveTab("activity")}
                  >
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-black'
                      }`}>Monitor Activity</h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Track operations</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className={`flex items-center justify-between p-3 border ${
                          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        } rounded-lg`}>
                          <div className="flex items-center space-x-3">
                            {activity.type === "doctor_added" && <UserPlus className="h-4 w-4 text-green-400" />}
                            {activity.type === "emergency" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                            {activity.type === "consultation" && <Activity className="h-4 w-4 text-blue-400" />}
                            <span className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>{activity.description}</span>
                            {activity.doctor && <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>- {activity.doctor}</span>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={activity.status === "urgent" ? "destructive" : "secondary"}>
                              {activity.status}
                            </Badge>
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "doctors" && (
              <div className="space-y-6">
                {/* Search and Add */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search doctors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-64 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                      } focus:border-blue-500 focus:ring-blue-500`}
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAddDoctorForm(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Doctor
                  </Button>
                </div>

                {/* Doctors List */}
                <div className="grid gap-4">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className={`${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-all duration-300`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className={`font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>{doctor.name}</h3>
                              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{doctor.specialty}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  <Phone className="h-3 w-3 inline mr-1" />
                                  {doctor.phone}
                                </span>
                                <span className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  <Mail className="h-3 w-3 inline mr-1" />
                                  {doctor.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>{doctor.patients} patients</p>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>Last active: {doctor.lastActive}</p>
                            </div>
                            <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                              {doctor.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleViewDoctor(doctor)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleEditDoctor(doctor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${doctor.name}?`)) {
                                    alert("Doctor deleted successfully!")
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Hospital Analytics</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Key performance indicators and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        } mb-4`}>Patient Demographics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Adults (18-65)</span>
                            <span className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>65%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Elderly (65+)</span>
                            <span className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Children (0-17)</span>
                            <span className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>15%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        } mb-4`}>Consultation Types</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>General Checkup</span>
                            <span className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Emergency</span>
                            <span className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Specialist Consultation</span>
                            <span className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>35%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Activity Log</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Recent system activities and user actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-3 border ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Dr. Abebe Kebede logged in</span>
                        </div>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>2 minutes ago</span>
                      </div>
                      <div className={`flex items-center justify-between p-3 border ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>New patient record created</span>
                        </div>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>15 minutes ago</span>
                      </div>
                      <div className={`flex items-center justify-between p-3 border ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Emergency alert triggered</span>
                        </div>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>1 hour ago</span>
                      </div>
                      <div className={`flex items-center justify-between p-3 border ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>System backup completed</span>
                        </div>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>3 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "patients" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search patients..."
                      value={patientSearch}
                      onChange={e => setPatientSearch(e.target.value)}
                      className={`w-64 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                      } focus:border-blue-500 focus:ring-blue-500`}
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Search
                    </Button>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddPatientForm(true)}>
                    Add Patient
                  </Button>
                </div>
                <div className="grid gap-4">
                  {filteredPatients.length === 0 && (
                    <div className={`text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>No patients found.</div>
                  )}
                  {filteredPatients.map((patient, idx) => (
                    <Card key={idx} className={`${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-all duration-300`}>
                      <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{patient.firstName} {patient.lastName}</h3>
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{patient.gender}, {patient.dateOfBirth}</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{patient.phone} | {patient.email}</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{patient.address}</p>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient)}>View</Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient)}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePatient(patient)}>Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {showAddPatientForm && (
                  <AddPatientForm
                    onClose={() => setShowAddPatientForm(false)}
                    onSubmit={handleAddPatient}
                  />
                )}
                {showViewPatientForm && selectedPatient && (
                  <ViewPatientForm
                    onClose={() => setShowViewPatientForm(false)}
                    patient={selectedPatient}
                  />
                )}
                {showEditPatientForm && selectedPatient && (
                  <EditPatientForm
                    onClose={() => setShowEditPatientForm(false)}
                    onSubmit={handleUpdatePatient}
                    patient={selectedPatient}
                  />
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Current Hospital Settings</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Summary of current configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><strong>Two-Factor Auth:</strong> {hospitalSettings.twoFactorAuth ? "Enabled" : "Disabled"}</div>
                      <div><strong>Session Timeout:</strong> {hospitalSettings.sessionTimeout} hours</div>
                      <div><strong>Auto Backup:</strong> {hospitalSettings.autoBackup ? "Enabled" : "Disabled"}</div>
                      <div><strong>Data Retention:</strong> {hospitalSettings.dataRetention === "0" ? "Indefinite" : hospitalSettings.dataRetention + " days"}</div>
                      <div><strong>Notifications:</strong> {hospitalSettings.notifications ? "Enabled" : "Disabled"}</div>
                      <div><strong>Maintenance Mode:</strong> {hospitalSettings.maintenanceMode ? "On" : "Off"}</div>
                      <div><strong>Language:</strong> {hospitalSettings.language}</div>
                      <div><strong>Timezone:</strong> {hospitalSettings.timezone}</div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowSettingsForm(true)}>
                        Edit Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {showSettingsForm && (
                  <HospitalAdminSettingsForm
                    onClose={() => setShowSettingsForm(false)}
                    onSubmit={handleSaveSettings}
                    initialSettings={hospitalSettings}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form Modals */}
      {showAddDoctorForm && (
        <AddDoctorForm
          onClose={() => setShowAddDoctorForm(false)}
          onSubmit={handleAddDoctor}
        />
      )}

      {showViewDoctorForm && selectedDoctor && (
        <ViewDoctorForm
          onClose={() => setShowViewDoctorForm(false)}
          doctor={selectedDoctor}
        />
      )}

      {showEditDoctorForm && selectedDoctor && (
        <EditDoctorForm
          onClose={() => setShowEditDoctorForm(false)}
          onSubmit={handleUpdateDoctor}
          doctor={selectedDoctor}
        />
      )}
    </div>
  </ProtectedRoute>
)
} 