"use client"
import { Button } from "@/components/ui/button"
import { useLanguage, type Language } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Footer } from "@/components/Footer"
import { MessageSquare, Settings, User, Stethoscope, Building, Shield } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"

export default function HomePage() {
  const { language, setLanguage, translations } = useLanguage()
  const router = useRouter()
  const { isDark, isLight } = useTheme()

  const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "am" as Language, name: "አማርኛ", flag: "🇪🇹" },
    { code: "or" as Language, name: "Afaan Oromo", flag: "🇾🇪" },
  ]

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
          title: "Patient",
          description: "Access health chat, medical history, and emergency services",
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
      
      <header className="border-b border-border/50 backdrop-blur-sm px-6 py-6 relative z-10">
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
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Hakim AI 
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-background/80 backdrop-blur-sm border border-border/50 text-foreground rounded-xl px-4 py-2 focus:border-primary focus:outline-none transition-all duration-300"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
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
            <p className="text-muted-foreground text-xl max-w-xl mx-auto leading-relaxed">
              {translations.healthAssistant}
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-full max-w-lg">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/60 hover:border-primary/50 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
                  onClick={role.onClick || (() => router.push(role.route))}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center space-x-4">
                    <div className={`relative w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      <role.icon className="h-8 w-8 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {role.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed mb-3">
                        {role.description}
                      </p>
                      {role.requiresFayda && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></div>
                          Fayda ID Required
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 max-w-lg mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="text-foreground font-medium">Important Notice</p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              For medical emergencies, please contact emergency services immediately. This system provides health assistance and should not replace professional medical care.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
