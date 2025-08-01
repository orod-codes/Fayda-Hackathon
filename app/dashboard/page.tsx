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
    <div className="min-h-screen bg-background text-foreground">
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
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {currentRole === "patient" ? "P" : currentRole === "doctor" ? "D" : currentRole === "admin" ? "A" : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">User Name</p>
                      <p className="text-sm text-muted-foreground capitalize">{currentRole}</p>
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
                      variant={activeTab === "chat" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => router.push("/chat")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Health Chat
                    </Button>
                    <Button 
                      variant={activeTab === "history" ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Medical History
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start"
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
                <Card className="border-destructive/20 bg-destructive/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div>
                        <h3 className="font-semibold text-destructive">Emergency Contacts</h3>
                        <p className="text-sm text-destructive/80">Ambulance: 911 | Police: 991 | Fire: 939</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer" onClick={() => router.push("/chat")}>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold">Health Chat</h3>
                      <p className="text-sm text-muted-foreground">Chat with AI assistant</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <User className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Medical History</h3>
                      <p className="text-sm text-muted-foreground">View your records</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground">Share medical files</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Medication Reminders</h3>
                      <p className="text-sm text-muted-foreground">Set reminders</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentRole === "doctor" && (
              <div className="space-y-6">
                {/* Search Patient */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search Patient</CardTitle>
                    <CardDescription>Enter Fayda ID to view patient records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter Fayda ID (FIN)"
                        className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold">View Patients</h3>
                      <p className="text-sm text-muted-foreground">Access patient data</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Stethoscope className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Add Diagnosis</h3>
                      <p className="text-sm text-muted-foreground">Record diagnoses</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Upload Notes</h3>
                      <p className="text-sm text-muted-foreground">Add treatment notes</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Shield className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Drug Interactions</h3>
                      <p className="text-sm text-muted-foreground">Check interactions</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentRole === "admin" && (
              <div className="space-y-6">
                {/* Hospital Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">156</p>
                          <p className="text-sm text-muted-foreground">Total Patients</p>
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
                          <p className="text-sm text-muted-foreground">Active Doctors</p>
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
                          <p className="text-sm text-muted-foreground">Today's Consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        <div>
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-sm text-muted-foreground">Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Manage Doctors</h3>
                      <p className="text-sm text-muted-foreground">Add/remove doctors</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Hospital Analytics</h3>
                      <p className="text-sm text-muted-foreground">View statistics</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold">Monitor Activity</h3>
                      <p className="text-sm text-muted-foreground">Track operations</p>
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