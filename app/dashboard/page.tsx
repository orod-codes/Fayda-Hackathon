"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  User, 
  Shield, 
  Building, 
  Phone, 
  FileText, 
  Calendar,
  AlertTriangle,
  Activity,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  Heart,
  Stethoscope,
  Users,
  BarChart3,
  Database,
  ArrowLeft
} from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const { translations, language } = useLanguage()
  const router = useRouter()
  const [userRole, setUserRole] = useState("patient") // This would be set based on authentication
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    router.push("/")
  }

  // Function to determine user role based on URL or authentication
  const getUserRole = () => {
    // In a real app, this would come from authentication context
    // For now, we'll use a simple state
    return userRole
  }

  const currentRole = getUserRole()

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={32} height={32} />
            <span className="text-xl font-semibold text-sky-400">hakim-ai Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
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
                      <AvatarFallback className="bg-sky-500 text-white">
                        {currentRole === "patient" ? "P" : currentRole === "doctor" ? "D" : currentRole === "admin" ? "A" : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-zinc-100">User Name</p>
                      <p className="text-sm text-zinc-400 capitalize">{currentRole}</p>
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
                      variant={activeTab === "chat" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => router.push("/chat")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Health Chat
                    </Button>
                    <Button 
                      variant={activeTab === "history" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Medical History
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <div className="flex-1">
            {currentRole === "patient" && (
              <div className="space-y-6">
                {/* Emergency Alert */}
                <Card className="border-red-500/20 bg-red-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div>
                        <h3 className="font-semibold text-red-300">Emergency Contacts</h3>
                        <p className="text-sm text-red-400">Ambulance: 911 | Police: 991 | Fire: 939</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer" onClick={() => router.push("/chat")}>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-sky-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Health Chat</h3>
                      <p className="text-sm text-zinc-400">Chat with AI assistant</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <User className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Medical History</h3>
                      <p className="text-sm text-zinc-400">View your records</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Upload Documents</h3>
                      <p className="text-sm text-zinc-400">Share medical files</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Medication Reminders</h3>
                      <p className="text-sm text-zinc-400">Set reminders</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentRole === "doctor" && (
              <div className="space-y-6">
                {/* Search Patient */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Search Patient</CardTitle>
                    <CardDescription className="text-zinc-400">Enter Fayda ID to view patient records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter Fayda ID (FIN)"
                        className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <Button className="bg-sky-500 hover:bg-sky-600">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">View Patients</h3>
                      <p className="text-sm text-zinc-400">Access patient data</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Stethoscope className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Add Diagnosis</h3>
                      <p className="text-sm text-zinc-400">Record diagnoses</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Upload Notes</h3>
                      <p className="text-sm text-zinc-400">Add treatment notes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Shield className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Drug Interactions</h3>
                      <p className="text-sm text-zinc-400">Check interactions</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentRole === "admin" && (
              <div className="space-y-6">
                {/* Hospital Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">156</p>
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
                          <p className="text-2xl font-bold text-zinc-100">12</p>
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
                          <p className="text-2xl font-bold text-zinc-100">89</p>
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
                          <p className="text-2xl font-bold text-zinc-100">3</p>
                          <p className="text-sm text-zinc-400">Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Manage Doctors</h3>
                      <p className="text-sm text-zinc-400">Add/remove doctors</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Hospital Analytics</h3>
                      <p className="text-sm text-zinc-400">View statistics</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Monitor Activity</h3>
                      <p className="text-sm text-zinc-400">Track operations</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 