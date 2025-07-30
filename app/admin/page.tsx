"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
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
  ArrowLeft
} from "lucide-react"
import Image from "next/image"

export default function AdminPage() {
  const { translations, language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    router.push("/")
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
      email: "abebe.kebede@hospital.et"
    },
    {
      id: "2",
      name: "Dr. Fatima Ahmed",
      specialty: "Pediatrics",
      status: "active",
      patients: 32,
      lastActive: "1 hour ago",
      phone: "+251 922 345 678",
      email: "fatima.ahmed@hospital.et"
    },
    {
      id: "3",
      name: "Dr. Mohammed Omar",
      specialty: "Emergency Medicine",
      status: "offline",
      patients: 28,
      lastActive: "3 days ago",
      phone: "+251 933 456 789",
      email: "mohammed.omar@hospital.et"
    }
  ]

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["hospital-admin"]} loginRoute="/hospital-admin/login">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
              <Image src="/images/hakmin-logo.png" alt="Hakmin Logo" width={32} height={32} />
              <span className="text-xl font-semibold text-gray-900">Hospital Admin Dashboard</span>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>HA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Hospital Admin</p>
                      <p className="text-sm text-gray-600">Tikur Anbessa Hospital</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </Button>
                    <Button 
                      variant={activeTab === "doctors" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("doctors")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Doctors
                    </Button>
                    <Button 
                      variant={activeTab === "analytics" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button 
                      variant={activeTab === "activity" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("activity")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Activity Log
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
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">156</p>
                          <p className="text-sm text-gray-600">Total Patients</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">12</p>
                          <p className="text-sm text-gray-600">Active Doctors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold">89</p>
                          <p className="text-sm text-gray-600">Today's Consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-sm text-gray-600">Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Add New Doctor</h3>
                      <p className="text-sm text-gray-600">Create doctor account</p>
            </CardContent>
          </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold">View Analytics</h3>
                      <p className="text-sm text-gray-600">Hospital statistics</p>
            </CardContent>
          </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Monitor Activity</h3>
                      <p className="text-sm text-gray-600">Track operations</p>
            </CardContent>
          </Card>
        </div>

                {/* Recent Activity */}
                <Card>
            <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Plus className="h-4 w-4 text-green-500" />
                          <span>New doctor account created</span>
                        </div>
                        <span className="text-sm text-gray-600">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Emergency case reported</span>
                        </div>
                        <span className="text-sm text-gray-600">4 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span>Patient consultation completed</span>
                        </div>
                        <span className="text-sm text-gray-600">6 hours ago</span>
                      </div>
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
                      className="w-64"
                    />
                    <Button className="bg-sky-500 hover:bg-sky-600">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Doctor
                  </Button>
                </div>

                {/* Doctors List */}
                <div className="grid gap-4">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialty}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">
                                  <Phone className="h-3 w-3 inline mr-1" />
                                  {doctor.phone}
                                </span>
                                <span className="text-xs text-gray-500">
                                  <Mail className="h-3 w-3 inline mr-1" />
                                  {doctor.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{doctor.patients} patients</p>
                              <p className="text-xs text-gray-500">Last active: {doctor.lastActive}</p>
                            </div>
                            <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                              {doctor.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
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
                <Card>
            <CardHeader>
                    <CardTitle>Hospital Analytics</CardTitle>
                    <CardDescription>Key performance indicators and statistics</CardDescription>
            </CardHeader>
            <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4">Patient Demographics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Adults (18-65)</span>
                            <span className="font-semibold">65%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Elderly (65+)</span>
                            <span className="font-semibold">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Children (0-17)</span>
                            <span className="font-semibold">15%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-4">Consultation Types</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>General Checkup</span>
                            <span className="font-semibold">40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Emergency</span>
                            <span className="font-semibold">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Specialist Consultation</span>
                            <span className="font-semibold">35%</span>
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
                <Card>
          <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>Recent system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Dr. Abebe Kebede logged in</span>
                        </div>
                        <span className="text-sm text-gray-600">2 minutes ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>New patient record created</span>
                        </div>
                        <span className="text-sm text-gray-600">15 minutes ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Emergency alert triggered</span>
                        </div>
                        <span className="text-sm text-gray-600">1 hour ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>System backup completed</span>
                  </div>
                        <span className="text-sm text-gray-600">3 hours ago</span>
                </div>
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
