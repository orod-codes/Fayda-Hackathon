"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  loginRoute: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  loginRoute 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(loginRoute)
        return
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate login page based on user role
        const roleRoutes = {
          "patient": "/patient/login",
          "doctor": "/doctor/login", 
          "hospital-admin": "/hospital-admin/login",
          "super-admin": "/super-admin/login"
        }
        router.push(roleRoutes[user.role])
        return
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, loginRoute, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null // Will redirect to appropriate login
  }

  return <>{children}</>
} 