"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Database, Cloud, HardDrive, Shield, Clock, AlertTriangle } from "lucide-react"

interface SystemBackupFormProps {
  onClose: () => void
  onSubmit: (backupData: BackupData) => void
}

interface BackupData {
  backupType: string
  includeDatabase: boolean
  includeFiles: boolean
  includeLogs: boolean
  encryption: boolean
  compression: boolean
  destination: string
  schedule: string
}

export default function SystemBackupForm({ onClose, onSubmit }: SystemBackupFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<BackupData>({
    backupType: "",
    includeDatabase: true,
    includeFiles: true,
    includeLogs: false,
    encryption: true,
    compression: true,
    destination: "",
    schedule: ""
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
    }, 2000)
  }

  const handleInputChange = (field: keyof BackupData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${
        theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
              System Backup Configuration
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Configure and initiate system backup
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Backup Type *
                </Label>
                <Select value={formData.backupType} onValueChange={(value) => handleInputChange('backupType', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select backup type" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="full">Full System Backup</SelectItem>
                    <SelectItem value="incremental">Incremental Backup</SelectItem>
                    <SelectItem value="differential">Differential Backup</SelectItem>
                    <SelectItem value="database-only">Database Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Backup Destination *
                </Label>
                <Select value={formData.destination} onValueChange={(value) => handleInputChange('destination', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage (AWS S3)</SelectItem>
                    <SelectItem value="network">Network Drive</SelectItem>
                    <SelectItem value="external">External Hard Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Backup Schedule
                </Label>
                <Select value={formData.schedule} onValueChange={(value) => handleInputChange('schedule', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="manual">Manual (One-time)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Backup Components
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="database" 
                    checked={formData.includeDatabase}
                    onCheckedChange={(checked) => handleInputChange('includeDatabase', checked as boolean)}
                  />
                  <Label htmlFor="database" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Include Database
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="files" 
                    checked={formData.includeFiles}
                    onCheckedChange={(checked) => handleInputChange('includeFiles', checked as boolean)}
                  />
                  <Label htmlFor="files" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Include System Files
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="logs" 
                    checked={formData.includeLogs}
                    onCheckedChange={(checked) => handleInputChange('includeLogs', checked as boolean)}
                  />
                  <Label htmlFor="logs" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Include Log Files
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Backup Options
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="encryption" 
                    checked={formData.encryption}
                    onCheckedChange={(checked) => handleInputChange('encryption', checked as boolean)}
                  />
                  <Label htmlFor="encryption" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Enable Encryption
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="compression" 
                    checked={formData.compression}
                    onCheckedChange={(checked) => handleInputChange('compression', checked as boolean)}
                  />
                  <Label htmlFor="compression" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Enable Compression
                  </Label>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    theme === 'dark' ? 'text-blue-100' : 'text-blue-800'
                  }`}>Backup Warning</h4>
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    This operation may take several minutes depending on the data size. 
                    The system will remain operational during backup.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                {isLoading ? "Creating Backup..." : "Start Backup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 