"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Settings, Shield, Database, Users, Bell, Globe, Lock } from "lucide-react"

interface HospitalSettingsFormProps {
  onClose: () => void
  onSubmit: (settingsData: SettingsData) => void
  hospital: {
    id: number
    name: string
    location: string
    status: string
    patients: number
    doctors: number
    admins: number
    lastActivity: string
  }
}

interface SettingsData {
  autoBackup: boolean
  notifications: boolean
  twoFactorAuth: boolean
  sessionTimeout: string
  dataRetention: string
  apiAccess: boolean
  auditLogging: boolean
  emergencyMode: boolean
  maintenanceMode: boolean
  language: string
  timezone: string
}

export default function HospitalSettingsForm({ onClose, onSubmit, hospital }: HospitalSettingsFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<SettingsData>({
    autoBackup: true,
    notifications: true,
    twoFactorAuth: true,
    sessionTimeout: "8",
    dataRetention: "7",
    apiAccess: true,
    auditLogging: true,
    emergencyMode: false,
    maintenanceMode: false,
    language: "en",
    timezone: "Africa/Addis_Ababa"
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onSubmit(formData)
      onClose()
    }, 1000)
  }

  const handleInputChange = (field: keyof SettingsData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-3xl ${
        theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              Hospital Settings
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Configure settings for {hospital.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Security Settings */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Security Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <div>
                      <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                        Two-Factor Authentication
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Require 2FA for all users
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Session Timeout (hours)
                  </Label>
                  <Select value={formData.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
                    <SelectTrigger className={
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Data Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <div>
                      <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                        Auto Backup
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Automatically backup data daily
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.autoBackup}
                    onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Data Retention (days)
                  </Label>
                  <Select value={formData.dataRetention} onValueChange={(value) => handleInputChange('dataRetention', value)}>
                    <SelectTrigger className={
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="0">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                System Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <div>
                      <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                        Notifications
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Enable system notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.notifications}
                    onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <div>
                      <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                        Audit Logging
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Log all system activities
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.auditLogging}
                    onCheckedChange={(checked) => handleInputChange('auditLogging', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <div>
                      <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                        API Access
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Enable API endpoints
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.apiAccess}
                    onCheckedChange={(checked) => handleInputChange('apiAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className={`h-5 w-5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <div>
                      <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                        Maintenance Mode
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Temporarily disable system
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Regional Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Language
                  </Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger className={
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                      <SelectItem value="om">Afaan Oromo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Timezone
                  </Label>
                  <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger className={
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                      <SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 