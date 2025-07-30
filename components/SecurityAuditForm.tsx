"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Shield, Lock, AlertTriangle, Search, FileText, Network, Database } from "lucide-react"

interface SecurityAuditFormProps {
  onClose: () => void
  onSubmit: (auditData: AuditData) => void
}

interface AuditData {
  auditType: string
  scope: string[]
  includeVulnerabilityScan: boolean
  includePenetrationTest: boolean
  includeComplianceCheck: boolean
  includeAccessReview: boolean
  includeLogAnalysis: boolean
  priority: string
  generateReport: boolean
}

export default function SecurityAuditForm({ onClose, onSubmit }: SecurityAuditFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<AuditData>({
    auditType: "",
    scope: [],
    includeVulnerabilityScan: true,
    includePenetrationTest: false,
    includeComplianceCheck: true,
    includeAccessReview: true,
    includeLogAnalysis: true,
    priority: "medium",
    generateReport: true
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
    }, 3000)
  }

  const handleScopeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      scope: prev.scope.includes(value)
        ? prev.scope.filter(item => item !== value)
        : [...prev.scope, value]
    }))
  }

  const handleInputChange = (field: keyof AuditData, value: string | boolean) => {
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
              Security Audit Configuration
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              Configure and run comprehensive security audit
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
                  Audit Type *
                </Label>
                <Select value={formData.auditType} onValueChange={(value) => handleInputChange('auditType', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select audit type" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="comprehensive">Comprehensive Security Audit</SelectItem>
                    <SelectItem value="vulnerability">Vulnerability Assessment</SelectItem>
                    <SelectItem value="compliance">Compliance Audit</SelectItem>
                    <SelectItem value="penetration">Penetration Testing</SelectItem>
                    <SelectItem value="access">Access Control Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Priority Level
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className={
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-zinc-300'}>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="critical">Critical Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Audit Scope
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="web-applications" 
                    checked={formData.scope.includes('web-applications')}
                    onCheckedChange={() => handleScopeChange('web-applications')}
                  />
                  <Label htmlFor="web-applications" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Web Applications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="database-systems" 
                    checked={formData.scope.includes('database-systems')}
                    onCheckedChange={() => handleScopeChange('database-systems')}
                  />
                  <Label htmlFor="database-systems" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Database Systems
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="network-infrastructure" 
                    checked={formData.scope.includes('network-infrastructure')}
                    onCheckedChange={() => handleScopeChange('network-infrastructure')}
                  />
                  <Label htmlFor="network-infrastructure" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Network Infrastructure
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="user-access" 
                    checked={formData.scope.includes('user-access')}
                    onCheckedChange={() => handleScopeChange('user-access')}
                  />
                  <Label htmlFor="user-access" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    User Access Controls
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="api-endpoints" 
                    checked={formData.scope.includes('api-endpoints')}
                    onCheckedChange={() => handleScopeChange('api-endpoints')}
                  />
                  <Label htmlFor="api-endpoints" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    API Endpoints
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Audit Components
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vulnerability-scan" 
                    checked={formData.includeVulnerabilityScan}
                    onCheckedChange={(checked) => handleInputChange('includeVulnerabilityScan', checked as boolean)}
                  />
                  <Label htmlFor="vulnerability-scan" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Vulnerability Scan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="penetration-test" 
                    checked={formData.includePenetrationTest}
                    onCheckedChange={(checked) => handleInputChange('includePenetrationTest', checked as boolean)}
                  />
                  <Label htmlFor="penetration-test" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Penetration Testing
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="compliance-check" 
                    checked={formData.includeComplianceCheck}
                    onCheckedChange={(checked) => handleInputChange('includeComplianceCheck', checked as boolean)}
                  />
                  <Label htmlFor="compliance-check" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Compliance Check
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="access-review" 
                    checked={formData.includeAccessReview}
                    onCheckedChange={(checked) => handleInputChange('includeAccessReview', checked as boolean)}
                  />
                  <Label htmlFor="access-review" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Access Review
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="log-analysis" 
                    checked={formData.includeLogAnalysis}
                    onCheckedChange={(checked) => handleInputChange('includeLogAnalysis', checked as boolean)}
                  />
                  <Label htmlFor="log-analysis" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                    Log Analysis
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="generate-report" 
                  checked={formData.generateReport}
                  onCheckedChange={(checked) => handleInputChange('generateReport', checked as boolean)}
                />
                <Label htmlFor="generate-report" className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                  Generate Detailed Report
                </Label>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Shield className={`h-5 w-5 mt-0.5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    theme === 'dark' ? 'text-blue-100' : 'text-blue-800'
                  }`}>Security Audit Information</h4>
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    This audit will thoroughly examine system security, identify vulnerabilities, 
                    and provide recommendations for improvement. The process may take 15-30 minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
                {isLoading ? "Running Audit..." : "Start Security Audit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 