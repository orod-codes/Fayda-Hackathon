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
  Shield, Users, Building, Activity, AlertTriangle, Plus, Search, Settings, LogOut,
  BarChart3, Phone, Mail, Calendar, FileText, Globe, Database, ArrowLeft,
  UserPlus, Trash2, Edit, Eye, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle,
  Server, Lock, Key, Monitor, AlertCircle, Globe2, Database2, Network
} from "lucide-react"
import Image from "next/image"

export default function SuperAdminPage() {
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
            <span className="text-xl font-semibold text-red-400">Super Admin Dashboard</span>
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
                    <AvatarFallback className="bg-red-500 text-white">SA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Super Admin</h3>
                    <p className="text-sm text-zinc-400">System Administrator</p>
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
                    variant={activeTab === "hospitals" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("hospitals")}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Hospitals
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Security
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
                        <Building className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{systemStats.totalHospitals}</p>
                          <p className="text-sm text-zinc-400">Total Hospitals</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{systemStats.totalPatients}</p>
                          <p className="text-sm text-zinc-400">Total Patients</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{systemStats.totalAdmins}</p>
                          <p className="text-sm text-zinc-400">System Admins</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-sky-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">{systemStats.systemUptime}</p>
                          <p className="text-sm text-zinc-400">System Uptime</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-zinc-100">System Health</CardTitle>
                      <CardDescription className="text-zinc-400">Current system status and alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Database Status</span>
                        <Badge className="bg-green-500 text-white">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">API Services</span>
                        <Badge className="bg-green-500 text-white">All Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Security Alerts</span>
                        <Badge className="bg-yellow-500 text-white">{systemStats.securityAlerts} Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Last Backup</span>
                        <span className="text-zinc-400">{systemStats.dataBackups}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-zinc-100">Quick Actions</CardTitle>
                      <CardDescription className="text-zinc-400">Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Hospital
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Admin Account
                      </Button>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        <Database className="h-4 w-4 mr-2" />
                        System Backup
                      </Button>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Monitor className="h-4 w-4 mr-2" />
                        Security Audit
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Recent System Activity</CardTitle>
                    <CardDescription className="text-zinc-400">Latest administrative actions and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-zinc-700/50">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'emergency' ? 'bg-red-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
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

            {activeTab === "hospitals" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search hospitals..."
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hospital
                  </Button>
                </div>

                <div className="grid gap-4">
                  {hospitals.map((hospital) => (
                    <Card key={hospital.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">{hospital.name}</h3>
                              <p className="text-zinc-400">{hospital.location}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-zinc-400">{hospital.patients} patients</span>
                                <span className="text-sm text-zinc-400">{hospital.doctors} doctors</span>
                                <span className="text-sm text-zinc-400">{hospital.admins} admins</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              hospital.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                            }>
                              {hospital.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-700">
                          <p className="text-sm text-zinc-400">Last activity: {hospital.lastActivity}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Security Dashboard</CardTitle>
                    <CardDescription className="text-zinc-400">System security status and threat monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-red-500/10 border-red-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                            <div>
                              <p className="text-lg font-semibold text-zinc-100">2</p>
                              <p className="text-sm text-zinc-400">Active Threats</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-500/10 border-green-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Shield className="h-6 w-6 text-green-400" />
                            <div>
                              <p className="text-lg font-semibold text-zinc-100">99.8%</p>
                              <p className="text-sm text-zinc-400">System Security</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Lock className="h-6 w-6 text-blue-400" />
                            <div>
                              <p className="text-lg font-semibold text-zinc-100">256-bit</p>
                              <p className="text-sm text-zinc-400">Encryption</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Monitor className="h-4 w-4 mr-2" />
                        Run Security Audit
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
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
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">System Settings</CardTitle>
                    <CardDescription className="text-zinc-400">Configure system-wide settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-zinc-100">General Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">System Language</span>
                            <select className="bg-zinc-700 border border-zinc-600 text-zinc-100 rounded px-3 py-1">
                              <option>English</option>
                              <option>Amharic</option>
                              <option>Afaan Oromo</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Time Zone</span>
                            <select className="bg-zinc-700 border border-zinc-600 text-zinc-100 rounded px-3 py-1">
                              <option>Africa/Addis_Ababa</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Auto Backup</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-zinc-100">Security Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Two-Factor Auth</span>
                            <Badge className="bg-green-500 text-white">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Session Timeout</span>
                            <span className="text-zinc-100">8 hours</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Password Policy</span>
                            <Badge className="bg-blue-500 text-white">Strong</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Database className="h-4 w-4 mr-2" />
                        Backup System
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Globe className="h-4 w-4 mr-2" />
                        Update System
                      </Button>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Config
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