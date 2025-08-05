import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Roboto, Montserrat } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"
import { Toaster } from "@/components/ui/toaster"

// Dynamically import providers to prevent SSR issues
const LanguageProvider = dynamic(() => import("@/contexts/LanguageContext").then(mod => ({ default: mod.LanguageProvider })), { ssr: false })
const ThemeProvider = dynamic(() => import("@/contexts/ThemeContext").then(mod => ({ default: mod.ThemeProvider })), { ssr: false })
const AuthProvider = dynamic(() => import("@/contexts/AuthContext").then(mod => ({ default: mod.AuthProvider })), { ssr: false })

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "hakim-ai - AI Health Assistant for Ethiopia",
  description: "Your multilingual AI health assistant supporting English, Amharic, and Afaan Oromo",
   
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} ${roboto.variable} ${montserrat.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
