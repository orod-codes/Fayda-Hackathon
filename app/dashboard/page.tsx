"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/Navigation"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white">
      <Navigation 
        title="hakim-ai Dashboard"
        showBack={true}
        backRoute="/"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {currentRole === "patient" ? "P" : currentRole === "doctor" ? "D" : currentRole === "admin" ? "A" : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-black dark:text-white">User Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{currentRole}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </Button>
                    <Button 
                      variant={activeTab === "chat" ? "default" : "ghost"}
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
                      onClick={() => router.push("/chat")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Health Chat
                    </Button>
                    <Button 
                      variant={activeTab === "history" ? "default" : "ghost"}
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Medical History
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
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
                <Card className="border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-300">Emergency Contacts</h3>
                        <p className="text-sm text-red-700 dark:text-red-400">Ambulance: 911 | Police: 991 | Fire: 939</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl" onClick={() => router.push("/chat")}>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Health Chat</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Chat with AI assistant</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <User className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Medical History</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View your records</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Upload Documents</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Share medical files</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Medication Reminders</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Set reminders</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentRole === "doctor" && (
              <div className="space-y-6">
                {/* Search Patient */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white">Search Patient</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Enter Fayda ID to view patient records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter Fayda ID (FIN)"
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">View Patients</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Access patient data</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <Stethoscope className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Add Diagnosis</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Record diagnoses</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Upload Notes</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add treatment notes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <Shield className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Drug Interactions</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Check interactions</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentRole === "admin" && (
              <div className="space-y-6">
                {/* Hospital Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-black dark:text-white">156</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-black dark:text-white">12</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Active Doctors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold text-black dark:text-white">89</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Today's Consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold text-black dark:text-white">3</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Manage Doctors</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add/remove doctors</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Hospital Analytics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View statistics</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-black dark:text-white">Monitor Activity</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track operations</p>
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