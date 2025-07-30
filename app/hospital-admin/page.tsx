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
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
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
        theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50 text-zinc-900'
      }`}>
      {/* Header */}
      <header className={`border-b px-4 py-4 ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Image src="/images/hakmin-logo.png" alt="Hakmin Logo" width={32} height={32} />
            <span className="text-xl font-semibold text-sky-400">Hospital Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
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
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-purple-500 text-white">HA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-zinc-100">Hospital Admin</p>
                      <p className="text-sm text-zinc-400">Tikur Anbessa Hospital</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </Button>
                    <Button 
                      variant={activeTab === "doctors" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab("doctors")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Doctors
                    </Button>
                    <Button 
                      variant={activeTab === "analytics" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button 
                      variant={activeTab === "activity" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab("activity")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Activity Log
                    </Button>
                    <Button 
                      variant={activeTab === "patients" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab("patients")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Patient Records
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
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
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{hospitalStats.totalPatients}</p>
                          <p className="text-sm text-zinc-400">Total Patients</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{hospitalStats.activeDoctors}</p>
                          <p className="text-sm text-zinc-400">Active Doctors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{hospitalStats.todayConsultations}</p>
                          <p className="text-sm text-zinc-400">Today's Consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{hospitalStats.emergencyCases}</p>
                          <p className="text-sm text-zinc-400">Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-zinc-400">Total Revenue</p>
                          <p className="text-2xl font-bold text-zinc-100">{hospitalStats.totalRevenue}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-zinc-400">Patient Satisfaction</p>
                          <p className="text-2xl font-bold text-zinc-100">{hospitalStats.patientSatisfaction}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card 
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer"
                    onClick={() => setShowAddDoctorForm(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <UserPlus className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Add New Doctor</h3>
                      <p className="text-sm text-zinc-400">Create doctor account</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">View Analytics</h3>
                      <p className="text-sm text-zinc-400">Hospital statistics</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab("activity")}
                  >
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Monitor Activity</h3>
                      <p className="text-sm text-zinc-400">Track operations</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {activity.type === "doctor_added" && <UserPlus className="h-4 w-4 text-green-400" />}
                            {activity.type === "emergency" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                            {activity.type === "consultation" && <Activity className="h-4 w-4 text-blue-400" />}
                            <span className="text-zinc-100">{activity.description}</span>
                            {activity.doctor && <span className="text-zinc-400">- {activity.doctor}</span>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={activity.status === "urgent" ? "destructive" : "secondary"}>
                              {activity.status}
                            </Badge>
                            <span className="text-sm text-zinc-400">{activity.time}</span>
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
                      className="w-64 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                    />
                    <Button className="bg-sky-500 hover:bg-sky-600">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <Button 
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => setShowAddDoctorForm(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Doctor
                  </Button>
                </div>

                {/* Doctors List */}
                <div className="grid gap-4">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-zinc-100">{doctor.name}</h3>
                              <p className="text-sm text-zinc-400">{doctor.specialty}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-zinc-500">
                                  <Phone className="h-3 w-3 inline mr-1" />
                                  {doctor.phone}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  <Mail className="h-3 w-3 inline mr-1" />
                                  {doctor.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-zinc-100">{doctor.patients} patients</p>
                              <p className="text-xs text-zinc-400">Last active: {doctor.lastActive}</p>
                            </div>
                            <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                              {doctor.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDoctor(doctor)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditDoctor(doctor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
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
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Hospital Analytics</CardTitle>
                    <CardDescription className="text-zinc-400">Key performance indicators and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-zinc-100 mb-4">Patient Demographics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Adults (18-65)</span>
                            <span className="font-semibold text-zinc-100">65%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Elderly (65+)</span>
                            <span className="font-semibold text-zinc-100">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Children (0-17)</span>
                            <span className="font-semibold text-zinc-100">15%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-100 mb-4">Consultation Types</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">General Checkup</span>
                            <span className="font-semibold text-zinc-100">40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Emergency</span>
                            <span className="font-semibold text-zinc-100">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Specialist Consultation</span>
                            <span className="font-semibold text-zinc-100">35%</span>
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
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Activity Log</CardTitle>
                    <CardDescription className="text-zinc-400">Recent system activities and user actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-zinc-100">Dr. Abebe Kebede logged in</span>
                        </div>
                        <span className="text-sm text-zinc-400">2 minutes ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-zinc-100">New patient record created</span>
                        </div>
                        <span className="text-sm text-zinc-400">15 minutes ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-zinc-100">Emergency alert triggered</span>
                        </div>
                        <span className="text-sm text-zinc-400">1 hour ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-zinc-100">System backup completed</span>
                        </div>
                        <span className="text-sm text-zinc-400">3 hours ago</span>
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
                      className="w-64 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                    />
                    <Button className="bg-sky-500 hover:bg-sky-600">
                      Search
                    </Button>
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600" onClick={() => setShowAddPatientForm(true)}>
                    Add Patient
                  </Button>
                </div>
                <div className="grid gap-4">
                  {filteredPatients.length === 0 && (
                    <div className="text-center text-zinc-400">No patients found.</div>
                  )}
                  {filteredPatients.map((patient, idx) => (
                    <Card key={idx} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold text-zinc-100">{patient.firstName} {patient.lastName}</h3>
                          <p className="text-sm text-zinc-400">{patient.gender}, {patient.dateOfBirth}</p>
                          <p className="text-xs text-zinc-400">{patient.phone} | {patient.email}</p>
                          <p className="text-xs text-zinc-400">{patient.address}</p>
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
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Current Hospital Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Summary of current configuration</CardDescription>
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
                      <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setShowSettingsForm(true)}>
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