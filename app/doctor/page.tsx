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
import {
  Stethoscope, Users, FileText, Activity, AlertTriangle, Plus, Search, Settings, LogOut,
  BarChart3, Phone, Mail, Calendar, Clock, CheckCircle, XCircle, ArrowLeft,
  UserPlus, Edit, Eye, TrendingUp, Pill, Heart, Brain, Activity as ActivityIcon,
  MessageSquare, Upload, Download, Video, Watch, Shield, Database, Clipboard
} from "lucide-react"
import Image from "next/image"

export default function DoctorPage() {
  const { translations, language } = useLanguage()
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const patients = [
    {
      id: 1,
      name: "Alemayehu Kebede",
      faydaId: "FIN123456789",
      age: 35,
      gender: "Male",
      lastVisit: "2 days ago",
      status: "active",
      emergencyContact: "+251911234567",
      bloodType: "O+",
      allergies: ["Penicillin", "Sulfa"],
      conditions: ["Hypertension", "Diabetes Type 2"]
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      faydaId: "FIN987654321",
      age: 28,
      gender: "Female",
      lastVisit: "1 week ago",
      status: "active",
      emergencyContact: "+251922345678",
      bloodType: "A-",
      allergies: ["Latex"],
      conditions: ["Asthma"]
    },
    {
      id: 3,
      name: "Tesfaye Haile",
      faydaId: "FIN456789123",
      age: 45,
      gender: "Male",
      lastVisit: "3 days ago",
      status: "emergency",
      emergencyContact: "+251933456789",
      bloodType: "B+",
      allergies: ["None"],
      conditions: ["Heart Disease", "High Cholesterol"]
    }
  ]

  const consultations = [
    {
      id: 1,
      patientName: "Alemayehu Kebede",
      date: "2024-01-15",
      type: "Follow-up",
      status: "completed",
      diagnosis: "Hypertension management",
      prescription: "Amlodipine 5mg daily"
    },
    {
      id: 2,
      patientName: "Fatima Ahmed",
      date: "2024-01-14",
      type: "Emergency",
      status: "completed",
      diagnosis: "Acute asthma attack",
      prescription: "Albuterol inhaler"
    },
    {
      id: 3,
      patientName: "Tesfaye Haile",
      date: "2024-01-13",
      type: "Initial",
      status: "pending",
      diagnosis: "Chest pain evaluation",
      prescription: "Pending tests"
    }
  ]

  const doctorStats = {
    totalPatients: 156,
    consultationsToday: 8,
    emergencyCases: 2,
    pendingReports: 5,
    averageRating: 4.8,
    yearsExperience: 12
  }

  const recentActivity = [
    {
      id: 1,
      action: "Patient consultation completed",
      details: "Alemayehu Kebede - Hypertension follow-up",
      timestamp: "2 hours ago",
      type: "consultation"
    },
    {
      id: 2,
      action: "Emergency alert responded",
      details: "Fatima Ahmed - Asthma attack",
      timestamp: "4 hours ago",
      type: "emergency"
    },
    {
      id: 3,
      action: "Medical report uploaded",
      details: "Tesfaye Haile - Cardiac evaluation",
      timestamp: "1 day ago",
      type: "report"
    },
    {
      id: 4,
      action: "AI diagnosis assistance",
      details: "Drug interaction check completed",
      timestamp: "1 day ago",
      type: "ai"
    }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.faydaId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["doctor"]} loginRoute="/doctor/login">
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50 text-zinc-900'
      }`}>
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
            <span className="text-xl font-semibold text-green-400">Doctor Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
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
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-green-500 text-white">DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Dr. Abebe</h3>
                    <p className="text-sm text-zinc-400">Cardiologist</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "patients" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("patients")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Patients
                  </Button>
                  <Button
                    variant={activeTab === "consultations" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("consultations")}
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Consultations
                  </Button>
                  <Button
                    variant={activeTab === "ai-tools" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("ai-tools")}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI Tools
                  </Button>
                  <Button
                    variant={activeTab === "reports" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("reports")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{doctorStats.totalPatients}</p>
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
                          <p className="text-2xl font-bold text-zinc-100">{doctorStats.consultationsToday}</p>
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
                          <p className="text-2xl font-bold text-zinc-100">{doctorStats.emergencyCases}</p>
                          <p className="text-sm text-zinc-400">Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{doctorStats.pendingReports}</p>
                          <p className="text-sm text-zinc-400">Pending Reports</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-zinc-100">Quick Actions</CardTitle>
                      <CardDescription className="text-zinc-400">Common doctor tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Search className="h-4 w-4 mr-2" />
                        Search Patient
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        New Consultation
                      </Button>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        <Brain className="h-4 w-4 mr-2" />
                        AI Diagnosis Help
                      </Button>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Pill className="h-4 w-4 mr-2" />
                        Drug Interaction Check
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-zinc-100">Performance Stats</CardTitle>
                      <CardDescription className="text-zinc-400">Your professional metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Patient Rating</span>
                        <span className="text-zinc-100 font-semibold">{doctorStats.averageRating}/5.0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Years Experience</span>
                        <span className="text-zinc-100 font-semibold">{doctorStats.yearsExperience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Specialization</span>
                        <Badge className="bg-green-500 text-white">Cardiology</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">License Status</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
                    <CardDescription className="text-zinc-400">Your latest medical activities and consultations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-zinc-700/50">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'emergency' ? 'bg-red-500' :
                            activity.type === 'consultation' ? 'bg-green-500' :
                            activity.type === 'report' ? 'bg-blue-500' : 'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-zinc-100 font-medium">{activity.action}</p>
                            <p className="text-sm text-zinc-400">{activity.details}</p>
                          </div>
                          <span className="text-xs text-zinc-500">{activity.timestamp}</span>
                        </div>
                      ))}
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
                      placeholder="Search patients by name or FIN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                    />
                    <Button className="bg-sky-500 hover:bg-sky-600">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>

                <div className="grid gap-4">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="bg-blue-500 text-white">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">{patient.name}</h3>
                              <p className="text-zinc-400">FIN: {patient.faydaId}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-zinc-400">{patient.age} years, {patient.gender}</span>
                                <span className="text-sm text-zinc-400">Blood: {patient.bloodType}</span>
                                <span className="text-sm text-zinc-400">Last visit: {patient.lastVisit}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {patient.conditions.map((condition, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              patient.status === 'emergency' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                            }>
                              {patient.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Stethoscope className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-zinc-400">Emergency Contact: {patient.emergencyContact}</p>
                              <p className="text-sm text-zinc-400">Allergies: {patient.allergies.join(', ')}</p>
                            </div>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              View Full History
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "consultations" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-zinc-100">Consultations</h2>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Consultation
                  </Button>
                </div>

                <div className="grid gap-4">
                  {consultations.map((consultation) => (
                    <Card key={consultation.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">{consultation.patientName}</h3>
                              <p className="text-zinc-400">{consultation.type} Consultation</p>
                              <p className="text-sm text-zinc-500">Date: {consultation.date}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm text-zinc-400">Diagnosis: {consultation.diagnosis}</span>
                                <span className="text-sm text-zinc-400">•</span>
                                <span className="text-sm text-zinc-400">Prescription: {consultation.prescription}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              consultation.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                            }>
                              {consultation.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Upload className="h-4 w-4" />
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

            {activeTab === "ai-tools" && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">AI Medical Assistant</CardTitle>
                    <CardDescription className="text-zinc-400">AI-powered tools to assist in diagnosis and treatment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700/70 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3">
                            <Brain className="h-8 w-8 text-purple-400" />
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">Diagnosis Assistant</h3>
                              <p className="text-sm text-zinc-400">AI-powered symptom analysis</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700/70 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3">
                            <Pill className="h-8 w-8 text-blue-400" />
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">Drug Interactions</h3>
                              <p className="text-sm text-zinc-400">Check medication compatibility</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700/70 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3">
                            <Heart className="h-8 w-8 text-red-400" />
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">Treatment Suggestions</h3>
                              <p className="text-sm text-zinc-400">Evidence-based recommendations</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700/70 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3">
                            <Clipboard className="h-8 w-8 text-green-400" />
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">Medical Literature</h3>
                              <p className="text-sm text-zinc-400">Latest research and guidelines</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-zinc-700/50 border border-zinc-600 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-zinc-100 mb-3">Quick AI Consultation</h3>
                      <div className="space-y-3">
                        <Input
                          placeholder="Describe symptoms or ask medical question..."
                          className="bg-zinc-600 border-zinc-500 text-zinc-100 placeholder:text-zinc-400"
                        />
                        <Button className="w-full bg-purple-500 hover:bg-purple-600">
                          <Brain className="h-4 w-4 mr-2" />
                          Get AI Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Medical Reports</CardTitle>
                    <CardDescription className="text-zinc-400">Generate and manage patient reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Report
                      </Button>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-zinc-100">Recent Reports</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-700/50">
                          <div>
                            <p className="text-zinc-100 font-medium">Alemayehu Kebede - Cardiac Report</p>
                            <p className="text-sm text-zinc-400">Generated 2 hours ago</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-700/50">
                          <div>
                            <p className="text-zinc-100 font-medium">Fatima Ahmed - Asthma Evaluation</p>
                            <p className="text-sm text-zinc-400">Generated 1 day ago</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Doctor Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Configure your professional profile and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-zinc-100">Profile Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Name</span>
                            <span className="text-zinc-100">Dr. Abebe Kebede</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Specialization</span>
                            <span className="text-zinc-100">Cardiology</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">License Number</span>
                            <span className="text-zinc-100">MD-12345</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Hospital</span>
                            <span className="text-zinc-100">Tikur Anbessa</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-zinc-100">Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">AI Assistance</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Emergency Alerts</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Auto Backup</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Shield className="h-4 w-4 mr-2" />
                        Security Settings
                      </Button>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Database className="h-4 w-4 mr-2" />
                        Backup Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
              </main>
      </div>
    </ProtectedRoute>
  )
} 