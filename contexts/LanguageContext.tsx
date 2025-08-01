"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "en" | "am" | "or"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  translations: Record<string, string>
}

const translations = {
  en: {
    welcome: "Welcome to Hakim AI ",
    welcomeSubtitle: "Your AI Health Assistant for Ethiopia",
    healthAssistant: "Your AI Health Assistant",
    selectLanguage: "Select Your Language",
    english: "English",
    amharic: "አማርኛ (Amharic)",
    oromo: "Afaan Oromo",
    continue: "Continue",
    typeMessage: "Type your health question...",
    send: "Send",
    healthTips: "Health Tips",
    emergencyContacts: "Emergency Contacts",
    symptoms: "Describe your symptoms",
    askDoctor: "Ask hakim-ai about your health",
    adminDashboard: "Admin Dashboard",
    userChat: "Health Chat",
    newChat: "New Chat",
    clearChat: "Clear Chat",
    exportChat: "Export Chat",
    disclaimer: "This is for informational purposes only. Always consult healthcare professionals for medical advice.",
  },
  am: {
    welcome: "ወደ ሃክሚን እንኳን በደህና መጡ",
    welcomeSubtitle: "የኢትዮጵያ የእርስዎ AI ጤና አማካሪ",
    healthAssistant: "የእርስዎ AI ጤና አማካሪ",
    selectLanguage: "ቋንቋዎን ይምረጡ",
    english: "English",
    amharic: "አማርኛ",
    oromo: "Afaan Oromo",
    continue: "ቀጥል",
    typeMessage: "የጤና ጥያቄዎን ይጻፉ...",
    send: "ላክ",
    healthTips: "የጤና ምክሮች",
    emergencyContacts: "የአደጋ ጊዜ ዕውቂያዎች",
    symptoms: "ምልክቶችዎን ይግለጹ",
    askDoctor: "ስለ ጤንነትዎ ሃክሚንን ይጠይቁ",
    adminDashboard: "የአስተዳዳሪ ዳሽቦርድ",
    userChat: "የጤና ውይይት",
    newChat: "አዲስ ውይይት",
    clearChat: "ውይይት አጽዳ",
    exportChat: "ውይይት ላክ",
    disclaimer: "ይህ ለመረጃ ዓላማ ብቻ ነው። ሁልጊዜ ለሕክምና ምክር የጤና ባለሙያዎችን ያማክሩ።",
  },
  or: {
    welcome: "Gara hakim-ai Baga Nagaan Dhuftan",
    welcomeSubtitle: "Gorsaa Fayyaa AI Itiyoophiyaa Keessan",
    healthAssistant: "Gorsaa Fayyaa AI Keessan",
    selectLanguage: "Afaan Keessan Filaadhaa",
    english: "English",
    amharic: "አማርኛ (Amharic)",
    oromo: "Afaan Oromo",
    continue: "Itti Fufi",
    typeMessage: "Gaaffii fayyaa keessan barreessaa...",
    send: "Ergi",
    healthTips: "Gorsa Fayyaa",
    emergencyContacts: "Bilbila Yeroo Balaa",
    symptoms: "Mallattoo keessan ibsaa",
    askDoctor: "Waaʼee fayyaa keessanii hakim-ai gaafadhaa",
    adminDashboard: "Dashboard Bulchaa",
    userChat: "Haasawa Fayyaa",
    newChat: "Haasawa Haaraa",
    clearChat: "Haasawa Qulqulleessi",
    exportChat: "Haasawa Ergii",
    disclaimer: "Kun odeeffannoof qofa. Yeroo hunda gorsa yaalaa argachuuf ogeessota fayyaa mariʼadhaa.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
