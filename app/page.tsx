"use client"
import { Button } from "@/components/ui/button"
import { useLanguage, type Language } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Footer } from "@/components/Footer"
import { MessageSquare, Settings, User, Stethoscope, Building, Shield } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function HomePage() {
  const { translations } = useLanguage()
  const router = useRouter()
  const { isDark, isLight } = useTheme()

  const handlePatientLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        console.error('Authorization URL not found in response');
      }
    } catch (error) {
      console.error('Failed to initiate login:', error);
      // Fallback to patient page for demo
      router.push('/patient');
    }
  }

  const userRoles = [
        {
          id: "patient",
          title: translations.patient,
          description: translations.patientDescription,
          icon: User,
          color: "bg-blue-500",
          route: "/patient",
          requiresFayda: true,
          onClick: handlePatientLogin
        }
  ]

    return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <header className="border-b border-border/50 backdrop-blur-sm px-6 py-6 relative z-10 bg-white/80 dark:bg-gray-800/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
                      <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Image 
                  src={isDark ? "/images/hakim-ai-logo.png" : "/images/11.png"} 
                  alt="hakim-ai Logo" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6" 
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Hakim AI 
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher variant="default" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center mx-auto mb-8">
              <Image 
                src={isDark ? "/images/hakim-ai-logo.png" : "/images/11.png"} 
                alt="hakim-ai Logo" 
                width={2000} 
                height={200} 
                className="w-480 h-480" 
              />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              {translations.welcome}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-xl mx-auto leading-relaxed">
              {translations.healthAssistant}
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-full max-w-lg">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="group relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:border-blue-500/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
                  onClick={role.onClick || (() => router.push(role.route))}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center space-x-4">
                    <div className={`relative w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      <role.icon className="h-8 w-8 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {role.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-3">
                        {role.description}
                      </p>
                      {role.requiresFayda && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          {translations.faydaIDRequired}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-lg mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="text-black dark:text-white font-medium">{translations.importantNotice}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {translations.medicalEmergencyNotice}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
