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
import AddHospitalForm from "@/components/AddHospitalForm"
import CreateAdminForm from "@/components/CreateAdminForm"
import SystemBackupForm from "@/components/SystemBackupForm"
import SecurityAuditForm from "@/components/SecurityAuditForm"
import ViewHospitalForm from "@/components/ViewHospitalForm"
import EditHospitalForm from "@/components/EditHospitalForm"
import HospitalSettingsForm from "@/components/HospitalSettingsForm"
import {
  Shield, Users, Building, Activity, AlertTriangle, Plus, Search, Settings, LogOut,
  BarChart3, Phone, Mail, Calendar, FileText, Globe, Database, ArrowLeft,
  UserPlus, Trash2, Edit, Eye, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle,
  Server, Lock, Key, Monitor, AlertCircle, Globe2, Database2, Network
} from "lucide-react"
import Image from "next/image"

export const dynamic = 'force-dynamic';

export default function SuperAdminPage() {
  const { translations, language } = useLanguage()
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddHospitalForm, setShowAddHospitalForm] = useState(false)
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false)
  const [showSystemBackupForm, setShowSystemBackupForm] = useState(false)
  const [showSecurityAuditForm, setShowSecurityAuditForm] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [showViewHospitalForm, setShowViewHospitalForm] = useState(false)
  const [showEditHospitalForm, setShowEditHospitalForm] = useState(false)
  const [showHospitalSettingsForm, setShowHospitalSettingsForm] = useState(false)
  const [showAddHospitalAdminForm, setShowAddHospitalAdminForm] = useState(false)
  const [selectedHospitalForAdmin, setSelectedHospitalForAdmin] = useState<any>(null)
  const [showGudifechaRegistrationForm, setShowGudifechaRegistrationForm] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAddHospital = (hospitalData: any) => {
    console.log("Adding hospital:", hospitalData)
    alert("Hospital added successfully!")
  }

  const handleCreateAdmin = (adminData: any) => {
    console.log("Creating admin:", adminData)
    alert("Admin account created successfully!")
  }

  const handleSystemBackup = (backupData: any) => {
    console.log("System backup:", backupData)
    alert("System backup initiated successfully!")
  }

  const handleSecurityAudit = (auditData: any) => {
    console.log("Security audit:", auditData)
    alert("Security audit completed successfully!")
  }

  const handleViewHospital = (hospital: any) => {
    setSelectedHospital(hospital)
    setShowViewHospitalForm(true)
  }

  const handleEditHospital = (hospital: any) => {
    setSelectedHospital(hospital)
    setShowEditHospitalForm(true)
  }

  const handleHospitalSettings = (hospital: any) => {
    setSelectedHospital(hospital)
    setShowHospitalSettingsForm(true)
  }

  const handleUpdateHospital = (hospitalData: any) => {
    console.log("Updating hospital:", hospitalData)
    alert("Hospital updated successfully!")
  }

  const handleHospitalSettingsUpdate = (settingsData: any) => {
    console.log("Updating hospital settings:", settingsData)
    alert("Hospital settings updated successfully!")
  }

  const handleAddHospitalAdmin = (hospital: any) => {
    setSelectedHospitalForAdmin(hospital)
    setShowAddHospitalAdminForm(true)
  }

  const handleCreateHospitalAdmin = (adminData: any) => {
    console.log("Creating hospital admin:", adminData)
    console.log("For hospital:", selectedHospitalForAdmin)
    alert("Hospital admin created successfully!")
  }

  const handleGudifechaRegistration = (registrationData: any) => {
    console.log("Gudifecha registration:", registrationData)
    alert("Gudifecha registration submitted successfully!")
  }

  const hospitals = [
    {
      id: 1,
      name: "Tikur Anbessa Specialized Hospital",
      location: "Addis Ababa",
      status: "active",
      patients: 1250,
      doctors: 45,
      admins: 3,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "St. Paul's Hospital",
      location: "Addis Ababa",
      status: "active",
      patients: 890,
      doctors: 32,
      admins: 2,
      lastActivity: "1 hour ago"
    },
    {
      id: 3,
      name: "Jimma University Medical Center",
      location: "Jimma",
      status: "active",
      patients: 650,
      doctors: 28,
      admins: 2,
      lastActivity: "30 minutes ago"
    }
  ]

  const systemStats = {
    totalHospitals: 24,
    totalPatients: 15680,
    totalDoctors: 892,
    totalAdmins: 67,
    activeUsers: 1245,
    systemUptime: "99.8%",
    securityAlerts: 2,
    dataBackups: "Last 2 hours ago"
  }

  const recentActivity = [
    {
      id: 1,
      action: "New hospital registered",
      details: "Bahir Dar University Hospital",
      timestamp: "10 minutes ago",
      type: "info"
    },
    {
      id: 2,
      action: "Security alert",
      details: "Multiple failed login attempts detected",
      timestamp: "1 hour ago",
      type: "warning"
    },
    {
      id: 3,
      action: "System backup completed",
      details: "Full backup to secure cloud storage",
      timestamp: "2 hours ago",
      type: "success"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={["super-admin"]} loginRoute="/super-admin/login">
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-black'
      }`}>
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
            <span className="text-xl font-semibold text-red-400">Super Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher variant="compact" />
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <AlertTriangle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6">
          <div className="w-64 flex-shrink-0">
            <Card className={`${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-500 text-white">SA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-gray-100' : 'text-black'
                    }`}>Super Admin</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>System Administrator</p>
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
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "hospitals" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === "hospitals" 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab("hospitals")}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Hospitals
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === "security" 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Security
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
                    Settings
                  </Button>
                  <Button
                    variant={activeTab === "gudifecha" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === "gudifecha" 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab("gudifecha")}
                  >
                    <Globe2 className="h-4 w-4 mr-2" />
                    Gudifecha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Building className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{systemStats.totalHospitals}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Total Hospitals</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-green-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{systemStats.totalPatients}</p>
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
                        <Shield className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{systemStats.totalAdmins}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>System Admins</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-sky-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-black'
                          }`}>{systemStats.systemUptime}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>System Uptime</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardHeader>
                      <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>System Health</CardTitle>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Current system status and alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Database Status</span>
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>API Services</span>
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">All Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Security Alerts</span>
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">{systemStats.securityAlerts} Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Last Backup</span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{systemStats.dataBackups}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardHeader>
                      <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Quick Actions</CardTitle>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowAddHospitalForm(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Hospital with Admin
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowCreateAdminForm(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Admin Account
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowSystemBackupForm(true)}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        System Backup
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowSecurityAuditForm(true)}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        Security Audit
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Recent System Activity</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Latest administrative actions and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className={`flex items-center space-x-4 p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'emergency' ? 'bg-red-500' :
                            activity.type === 'warning' ? 'bg-blue-500' :
                            activity.type === 'success' ? 'bg-blue-500' : 'bg-blue-400'
                          }`} />
                          <div className="flex-1">
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-gray-100' : 'text-black'
                            }`}>{activity.action}</p>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{activity.details}</p>
                          </div>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>{activity.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "hospitals" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search hospitals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-64 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                      } focus:border-blue-500 focus:ring-blue-500`}
                    />
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        alert(`Searching for hospitals with query: "${searchQuery}"`)
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAddHospitalForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hospital with Admin
                  </Button>
                </div>

                <div className="grid gap-4">
                  {hospitals.map((hospital) => (
                    <Card key={hospital.id} className={`${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-all duration-300`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>{hospital.name}</h3>
                              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{hospital.location}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{hospital.patients} patients</span>
                                <span className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{hospital.doctors} doctors</span>
                                <span className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{hospital.admins} admins</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              hospital.status === 'active' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-400 text-white'
                            }>
                              {hospital.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleViewHospital(hospital)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleEditHospital(hospital)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleHospitalSettings(hospital)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-600 text-green-300 hover:bg-green-700"
                                onClick={() => handleAddHospitalAdmin(hospital)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Last activity: {hospital.lastActivity}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Security Dashboard</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>System security status and threat monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-red-500/10 border-red-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                            <div>
                              <p className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>2</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>Active Threats</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Shield className="h-6 w-6 text-green-400" />
                            <div>
                              <p className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>99.8%</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>System Security</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Lock className="h-6 w-6 text-blue-400" />
                            <div>
                              <p className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>256-bit</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>Encryption</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Running comprehensive security audit...")
                        }}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        Run Security Audit
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Backing up security keys to secure location...")
                        }}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Backup Security Keys
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>System Settings</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Configure system-wide settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>General Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>System Language</span>
                            <select className={`${
                              theme === 'dark' 
                                ? 'bg-gray-700 border border-gray-600 text-gray-100' 
                                : 'bg-white border border-gray-300 text-black'
                            } rounded px-3 py-1`}>
                              <option>English</option>
                              <option>Amharic</option>
                              <option>Afaan Oromo</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Time Zone</span>
                            <select className={`${
                              theme === 'dark' 
                                ? 'bg-gray-700 border border-gray-600 text-gray-100' 
                                : 'bg-white border border-gray-300 text-black'
                            } rounded px-3 py-1`}>
                              <option>Africa/Addis_Ababa</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Auto Backup</span>
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Enabled</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>Security Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Two-Factor Auth</span>
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Session Timeout</span>
                            <span className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>8 hours</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Password Policy</span>
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Strong</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Initiating system backup...")
                        }}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Backup System
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Checking for system updates...")
                        }}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Update System
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Opening advanced configuration panel...")
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "gudifecha" && (
              <div className="space-y-6">
                {/* Gudifecha Overview Card */}
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-3 ${
                      theme === 'dark' ? 'text-gray-100' : 'text-black'
                    }`}>
                      <Globe2 className="h-6 w-6 text-blue-400" />
                      <span>Gudifecha (ጉዲፈቻ) - FormAI Overview</span>
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Traditional Oromo adoption practice integrated with AI-powered healthcare assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>Cultural Context</h3>
                        <div className={`space-y-3 text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <p>
                            <strong>Gudifecha (ጉዲፈቻ)</strong> is an Amharic word that translates to "adoption" in English. 
                            It refers to the traditional practice of <strong>Guddifachaa</strong>, a form of customary adoption 
                            common among the Oromo people in Ethiopia.
                          </p>
                          <p>
                            This practice involves a voluntary agreement between birth families and adoptive families to raise 
                            a child according to <strong>Safuu</strong>, a set of Oromo cultural norms, values, and rituals.
                          </p>
                          <p>
                            The system emphasizes community support, cultural preservation, and holistic child development 
                            within the framework of traditional Oromo values.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>FormAI Integration</h3>
                        <div className={`space-y-3 text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <p>
                            Our FormAI system integrates traditional Gudifecha practices with modern healthcare technology, 
                            providing culturally-sensitive medical assistance while respecting Oromo cultural values.
                          </p>
                          <p>
                            The AI system is trained to understand and incorporate <strong>Safuu</strong> principles in 
                            healthcare recommendations, ensuring culturally appropriate care for Oromo communities.
                          </p>
                          <p>
                            This integration bridges traditional wisdom with modern medical practices, creating a 
                            comprehensive healthcare approach that honors cultural heritage.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Users className="h-6 w-6 text-blue-400" />
                            <div>
                              <p className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>Cultural Sensitivity</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>Respects Oromo traditions</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-500/10 border-green-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Shield className="h-6 w-6 text-green-400" />
                            <div>
                              <p className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>Safuu Integration</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>Oromo cultural values</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-500/10 border-purple-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-6 w-6 text-purple-400" />
                            <div>
                              <p className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-black'
                              }`}>AI-Powered Care</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>Modern healthcare tech</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Gudifecha Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardHeader>
                      <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Traditional Practices</CardTitle>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Core elements of Gudifecha</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Voluntary family agreements</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Community-based child rearing</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Cultural value preservation</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Safuu principles integration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Holistic development focus</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardHeader>
                      <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>AI Integration Features</CardTitle>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Modern technology enhancements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Culturally-aware AI responses</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Multilingual support (Amharic/Oromo)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Traditional medicine integration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Community health monitoring</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Cultural sensitivity training</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Gudifecha Statistics */}
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Gudifecha System Statistics</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Current implementation metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>1,247</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Families Served</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>89%</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Cultural Satisfaction</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>156</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Communities Reached</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-black'
                        }`}>94%</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>AI Accuracy Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gudifecha Actions */}
                <Card className={`${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className={theme === 'dark' ? 'text-gray-100' : 'text-black'}>Gudifecha Management</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Administrative actions for Gudifecha system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Opening Gudifecha cultural training module...")
                        }}
                      >
                        <Globe2 className="h-4 w-4 mr-2" />
                        Cultural Training
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Generating Gudifecha community report...")
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Community Report
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Updating Safuu integration parameters...")
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Safuu Settings
                      </Button>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          alert("Analyzing cultural sensitivity metrics...")
                        }}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Cultural Analytics
                      </Button>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => setShowGudifechaRegistrationForm(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Family
                      </Button>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          alert("Opening Gudifecha community directory...")
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Community Directory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form Modals */}
      {showAddHospitalForm && (
        <AddHospitalForm
          onClose={() => setShowAddHospitalForm(false)}
          onSubmit={handleAddHospital}
        />
      )}

      {showCreateAdminForm && (
        <CreateAdminForm
          onClose={() => setShowCreateAdminForm(false)}
          onSubmit={handleCreateAdmin}
        />
      )}

      {showSystemBackupForm && (
        <SystemBackupForm
          onClose={() => setShowSystemBackupForm(false)}
          onSubmit={handleSystemBackup}
        />
      )}

      {showSecurityAuditForm && (
        <SecurityAuditForm
          onClose={() => setShowSecurityAuditForm(false)}
          onSubmit={handleSecurityAudit}
        />
      )}

      {showViewHospitalForm && selectedHospital && (
        <ViewHospitalForm
          onClose={() => setShowViewHospitalForm(false)}
          hospital={selectedHospital}
        />
      )}

      {showEditHospitalForm && selectedHospital && (
        <EditHospitalForm
          onClose={() => setShowEditHospitalForm(false)}
          onSubmit={handleUpdateHospital}
          hospital={selectedHospital}
        />
      )}

      {showHospitalSettingsForm && selectedHospital && (
        <HospitalSettingsForm
          onClose={() => setShowHospitalSettingsForm(false)}
          onSubmit={handleHospitalSettingsUpdate}
          hospital={selectedHospital}
        />
      )}

      {showAddHospitalAdminForm && selectedHospitalForAdmin && (
        <CreateAdminForm
          onClose={() => setShowAddHospitalAdminForm(false)}
          onSubmit={handleCreateHospitalAdmin}
          hospitalId={selectedHospitalForAdmin.id}
          hospitalName={selectedHospitalForAdmin.name}
        />
      )}

      {/* Gudifecha Registration Form Modal */}
      {showGudifechaRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-black'
                }`}>
                  <Globe2 className="h-6 w-6 inline mr-2 text-blue-400" />
                  Gudifecha Family Registration
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGudifechaRegistrationForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  familyName: formData.get('familyName'),
                  community: formData.get('community'),
                  region: formData.get('region'),
                  contactPerson: formData.get('contactPerson'),
                  phone: formData.get('phone'),
                  email: formData.get('email'),
                  familyType: formData.get('familyType'),
                  childrenCount: formData.get('childrenCount'),
                  culturalBackground: formData.get('culturalBackground'),
                  languagePreference: formData.get('languagePreference'),
                  healthcareNeeds: formData.get('healthcareNeeds'),
                  traditionalPractices: formData.get('traditionalPractices'),
                  communitySupport: formData.get('communitySupport'),
                  safuuUnderstanding: formData.get('safuuUnderstanding'),
                  aiAssistance: formData.get('aiAssistance'),
                  additionalNotes: formData.get('additionalNotes')
                }
                handleGudifechaRegistration(data)
                setShowGudifechaRegistrationForm(false)
              }} className="space-y-6">
                
                {/* Family Information */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-black'
                  }`}>Family Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Family Name *</label>
                      <Input
                        name="familyName"
                        required
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        placeholder="Enter family name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Community *</label>
                      <Input
                        name="community"
                        required
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        placeholder="Enter community name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Region *</label>
                      <select
                        name="region"
                        required
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select region</option>
                        <option value="oromia">Oromia</option>
                        <option value="amhara">Amhara</option>
                        <option value="tigray">Tigray</option>
                        <option value="snnpr">SNNPR</option>
                        <option value="somali">Somali</option>
                        <option value="afar">Afar</option>
                        <option value="benishangul">Benishangul-Gumuz</option>
                        <option value="gambella">Gambella</option>
                        <option value="harari">Harari</option>
                        <option value="addis-ababa">Addis Ababa</option>
                        <option value="dire-dawa">Dire Dawa</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Contact Person *</label>
                      <Input
                        name="contactPerson"
                        required
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        placeholder="Primary contact person"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Phone Number *</label>
                      <Input
                        name="phone"
                        type="tel"
                        required
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        placeholder="+251 9XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Email Address</label>
                      <Input
                        name="email"
                        type="email"
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Family Details */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-black'
                  }`}>Family Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Family Type *</label>
                      <select
                        name="familyType"
                        required
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select family type</option>
                        <option value="birth-family">Birth Family</option>
                        <option value="adoptive-family">Adoptive Family</option>
                        <option value="extended-family">Extended Family</option>
                        <option value="community-family">Community Family</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Number of Children</label>
                      <Input
                        name="childrenCount"
                        type="number"
                        min="0"
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Cultural Background *</label>
                      <select
                        name="culturalBackground"
                        required
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select cultural background</option>
                        <option value="oromo">Oromo</option>
                        <option value="amhara">Amhara</option>
                        <option value="tigray">Tigray</option>
                        <option value="somali">Somali</option>
                        <option value="afar">Afar</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Language Preference *</label>
                      <select
                        name="languagePreference"
                        required
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select preferred language</option>
                        <option value="afaan-oromo">Afaan Oromo</option>
                        <option value="amharic">Amharic</option>
                        <option value="english">English</option>
                        <option value="tigrinya">Tigrinya</option>
                        <option value="somali">Somali</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Healthcare & Cultural Information */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-black'
                  }`}>Healthcare & Cultural Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Healthcare Needs</label>
                      <textarea
                        name="healthcareNeeds"
                        rows={3}
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                        placeholder="Describe any specific healthcare needs..."
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Traditional Practices</label>
                      <textarea
                        name="traditionalPractices"
                        rows={3}
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                        placeholder="Describe traditional practices followed by the family..."
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Community Support Available</label>
                      <select
                        name="communitySupport"
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select level of community support</option>
                        <option value="strong">Strong community support</option>
                        <option value="moderate">Moderate community support</option>
                        <option value="limited">Limited community support</option>
                        <option value="none">No community support</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Understanding of Safuu *</label>
                      <select
                        name="safuuUnderstanding"
                        required
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select Safuu understanding level</option>
                        <option value="excellent">Excellent understanding</option>
                        <option value="good">Good understanding</option>
                        <option value="moderate">Moderate understanding</option>
                        <option value="basic">Basic understanding</option>
                        <option value="learning">Currently learning</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>AI Assistance Preference</label>
                      <select
                        name="aiAssistance"
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                      >
                        <option value="">Select AI assistance preference</option>
                        <option value="high">High preference for AI assistance</option>
                        <option value="moderate">Moderate preference</option>
                        <option value="low">Low preference</option>
                        <option value="none">No AI assistance preferred</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Additional Notes</label>
                      <textarea
                        name="additionalNotes"
                        rows={4}
                        className={`w-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-black'
                        } rounded-md border px-3 py-2`}
                        placeholder="Any additional information about the family, cultural practices, or special requirements..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGudifechaRegistrationForm(false)}
                    className={`${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Family
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </ProtectedRoute>
)
} 