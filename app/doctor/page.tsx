"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import DoctorViewPatientForm from "@/components/DoctorViewPatientForm"
import DoctorChatInterface from "@/components/DoctorChatInterface"
import {
  Stethoscope, Users, FileText, Activity, AlertTriangle, Plus, Search, Settings, LogOut,
  BarChart3, Phone, Mail, Calendar, Clock, CheckCircle, XCircle, ArrowLeft,
  UserPlus, Edit, Eye, TrendingUp, Pill, Heart, Brain, Activity as ActivityIcon,
  MessageSquare, Upload, Download, Video, Watch, Shield, Database, Clipboard, X,
  Sun, Moon
} from "lucide-react"
import Image from "next/image"

export default function DoctorPage() {
  const { translations, language } = useLanguage()
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  
  // State for modals and forms
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showNewConsultation, setShowNewConsultation] = useState(false)
  const [showAIInput, setShowAIInput] = useState(false)
  const [aiQuery, setAiQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })
  const [consultationFilter, setConsultationFilter] = useState("all")
  const [consultationSearchQuery, setConsultationSearchQuery] = useState("")
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false)
  const [showEditConsultationModal, setShowEditConsultationModal] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [doctorProfile, setDoctorProfile] = useState({
    firstName: "Abebe",
    lastName: "Kebede",
    email: "doctor@hakim-ai.et",
    phone: "+251911234567",
    specialty: "Cardiology",
    licenseNumber: "MD-12345",
    experience: "12",
    education: "MBBS, MD Cardiology",
    hospital: "Tikur Anbessa",
    address: "123 Medical Center, Addis Ababa",
    bio: "Experienced cardiologist with 12 years of practice specializing in cardiovascular diseases and interventional cardiology.",
    languages: ["Amharic", "English"],
    certifications: ["Board Certified Cardiologist", "Advanced Cardiac Life Support"],
    availability: "Monday-Friday, 8:00 AM - 5:00 PM"
  })
  const [newConsultationData, setNewConsultationData] = useState({
    patientName: "",
    finNumber: "",
    type: "Follow-up",
    diagnosis: "",
    prescription: "",
    status: "pending"
  })
  const [showDoctorChat, setShowDoctorChat] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Notification handler
  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000)
  }

  // Patient actions
  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  const handleStartConsultation = (patient: any) => {
    showNotification(`Starting consultation with ${patient.name}`, "info")
    // Here you would typically navigate to a consultation form
    setShowNewConsultation(true)
  }

  const handleViewPatientHistory = (patient: any) => {
    showNotification(`Opening full history for ${patient.name}`, "info")
    // Here you would typically navigate to a detailed history page
  }

  const handleAddPatient = () => {
    showNotification("Opening add patient form", "info")
    // Here you would typically open a modal or navigate to add patient page
  }

  // Consultation actions
  const handleEditConsultation = (consultation: any) => {
    setEditingConsultation(consultation)
    setShowEditConsultationModal(true)
    showNotification(`Editing consultation for ${consultation.patientName}`, "info")
  }

  const handleSaveEditConsultation = () => {
    if (!editingConsultation) return
    
    setConsultations(prev => prev.map(c => 
      c.id === editingConsultation.id ? editingConsultation : c
    ))
    setShowEditConsultationModal(false)
    setEditingConsultation(null)
    showNotification("Consultation updated successfully!", "success")
  }

  const handleCancelEditConsultation = () => {
    setShowEditConsultationModal(false)
    setEditingConsultation(null)
  }

  const handleViewConsultationReport = (consultation: any) => {
    setSelectedDocument({
      type: "consultation_report",
      title: `${consultation.patientName} - Consultation Report`,
      content: `Patient: ${consultation.patientName}
FIN: ${consultation.finNumber || 'N/A'}
Date: ${consultation.date}
Type: ${consultation.type}
Status: ${consultation.status}
Diagnosis: ${consultation.diagnosis}
Prescription: ${consultation.prescription}`,
      consultation: consultation
    })
    setShowDocumentModal(true)
    showNotification(`Opening report for ${consultation.patientName}`, "info")
  }

  const handleUploadConsultation = (consultation: any) => {
    showNotification(`Opening file upload for ${consultation.patientName}`, "info")
    // Simulate file upload dialog
    setTimeout(() => {
      showNotification(`Files uploaded successfully for ${consultation.patientName}`, "success")
    }, 2000)
  }

  const handleExportConsultation = (consultation: any) => {
    showNotification(`Generating PDF for ${consultation.patientName}`, "info")
    
    // Create HTML content that can be converted to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Consultation Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin: 20px 0; }
          .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { margin-left: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CONSULTATION REPORT</h1>
          <p>Hakim AI Health Assistant</p>
        </div>
        
        <div class="section">
          <h2>Patient Information</h2>
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${consultation.patientName}</span>
          </div>
          <div class="info-row">
            <span class="label">FIN Number:</span>
            <span class="value">${consultation.finNumber || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Date:</span>
            <span class="value">${consultation.date}</span>
          </div>
          <div class="info-row">
            <span class="label">Type:</span>
            <span class="value">${consultation.type}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value">${consultation.status}</span>
          </div>
        </div>
        
        <div class="section">
          <h2>Medical Details</h2>
          <div class="info-row">
            <span class="label">Diagnosis:</span>
            <span class="value">${consultation.diagnosis}</span>
          </div>
          <div class="info-row">
            <span class="label">Prescription:</span>
            <span class="value">${consultation.prescription}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Doctor: Dr. Abebe Kebede | Hospital: Tikur Anbessa</p>
          <p>This document contains confidential medical information.</p>
        </div>
      </body>
      </html>
    `
    
    // Create a blob with HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Open in new window for printing/saving as PDF
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = `${consultation.patientName}_consultation_${consultation.date}`
      // Auto-print dialog
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
    
    setTimeout(() => {
      showNotification(`PDF ready for ${consultation.patientName}. Use browser print to save as PDF.`, "success")
    }, 1000)
  }

  const handleImportConsultation = () => {
    showNotification("Opening PDF import dialog", "info")
    
    // Create file input for PDF import
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.style.display = 'none'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        showNotification(`Processing PDF: ${file.name}`, "info")
        
        // Simulate PDF processing
        setTimeout(() => {
          // Create a sample imported consultation
          const importedConsultation = {
            id: Date.now(),
            patientName: `Imported Patient ${Math.floor(Math.random() * 1000)}`,
            finNumber: `FIN${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toISOString().split('T')[0],
            type: "Imported",
            status: "completed",
            diagnosis: "Imported from PDF",
            prescription: "Review required"
          }
          
          setConsultations(prev => [importedConsultation, ...prev])
          showNotification(`PDF imported successfully: ${file.name}`, "success")
        }, 2000)
      }
    }
    
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  const handleExportAllConsultations = () => {
    showNotification("Generating comprehensive PDF report", "info")
    
    const consultationsHtml = consultations.map(consultation => `
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
        <h3 style="color: #333; margin-bottom: 10px;">CONSULTATION ${consultation.id}</h3>
        <div style="margin: 5px 0;"><strong>Patient:</strong> ${consultation.patientName}</div>
        <div style="margin: 5px 0;"><strong>FIN:</strong> ${consultation.finNumber || 'N/A'}</div>
        <div style="margin: 5px 0;"><strong>Date:</strong> ${consultation.date}</div>
        <div style="margin: 5px 0;"><strong>Type:</strong> ${consultation.type}</div>
        <div style="margin: 5px 0;"><strong>Status:</strong> ${consultation.status}</div>
        <div style="margin: 5px 0;"><strong>Diagnosis:</strong> ${consultation.diagnosis}</div>
        <div style="margin: 5px 0;"><strong>Prescription:</strong> ${consultation.prescription}</div>
      </div>
    `).join('')
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprehensive Consultation Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPREHENSIVE CONSULTATION REPORT</h1>
          <p>Hakim AI Health Assistant</p>
        </div>
        
        <div class="summary">
          <h2>Report Summary</h2>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Consultations:</strong> ${consultations.length}</p>
          <p><strong>Completed:</strong> ${consultations.filter(c => c.status === 'completed').length}</p>
          <p><strong>Pending:</strong> ${consultations.filter(c => c.status === 'pending').length}</p>
        </div>
        
        <div>
          <h2>All Consultations</h2>
          ${consultationsHtml}
        </div>
        
        <div class="footer">
          <p>Doctor: Dr. Abebe Kebede | Hospital: Tikur Anbessa</p>
          <p>This document contains confidential medical information.</p>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = `all_consultations_${new Date().toISOString().split('T')[0]}`
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
    
    setTimeout(() => {
      showNotification("Comprehensive PDF ready. Use browser print to save as PDF.", "success")
    }, 1500)
  }

  const handleNewConsultation = () => {
    showNotification("Opening new consultation form", "info")
    setShowNewConsultationModal(true)
  }

  const handleCreateConsultation = () => {
    if (!newConsultationData.patientName.trim()) {
      showNotification("Please enter patient name", "error")
      return
    }
    if (!newConsultationData.finNumber.trim()) {
      showNotification("Please enter FIN number", "error")
      return
    }
    if (!newConsultationData.diagnosis.trim()) {
      showNotification("Please enter diagnosis", "error")
      return
    }

    const newConsultation = {
      id: Date.now(), // Simple ID generation
      patientName: newConsultationData.patientName,
      finNumber: newConsultationData.finNumber,
      date: new Date().toISOString().split('T')[0], // Today's date
      type: newConsultationData.type,
      status: newConsultationData.status,
      diagnosis: newConsultationData.diagnosis,
      prescription: newConsultationData.prescription
    }

    setConsultations(prev => [newConsultation, ...prev])
    setNewConsultationModal(false)
    setNewConsultationData({
      patientName: "",
      finNumber: "",
      type: "Follow-up",
      diagnosis: "",
      prescription: "",
      status: "pending"
    })
    showNotification("New consultation created successfully!", "success")
  }

  const handleCancelNewConsultation = () => {
    setShowNewConsultationModal(false)
    setNewConsultationData({
      patientName: "",
      finNumber: "",
      type: "Follow-up",
      diagnosis: "",
      prescription: "",
      status: "pending"
    })
  }

  const handleViewConsultationDetails = (consultation: any) => {
    setSelectedConsultation(consultation)
    setShowConsultationModal(true)
  }

  const handleDeleteConsultation = (consultation: any) => {
    showNotification(`Deleting consultation for ${consultation.patientName}`, "info")
    setConsultations(prev => prev.filter(c => c.id !== consultation.id))
    setTimeout(() => {
      showNotification("Consultation deleted successfully", "success")
    }, 1000)
  }

  const handleCompleteConsultation = (consultation: any) => {
    showNotification(`Marking consultation as completed for ${consultation.patientName}`, "info")
    setConsultations(prev => prev.map(c => 
      c.id === consultation.id ? { ...c, status: 'completed' } : c
    ))
    setTimeout(() => {
      showNotification("Consultation marked as completed", "success")
    }, 1000)
  }

  // AI Tools actions
  const handleAITool = (tool: string) => {
    showNotification(`Opening ${tool}`, "info")
    setShowAIInput(true)
  }

  const handleAIAnalysis = () => {
    if (!aiQuery.trim()) {
      showNotification("Please enter a query for AI analysis", "error")
      return
    }
    setIsLoading(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsLoading(false)
      showNotification("AI analysis completed! Check results in your inbox.", "success")
      setAiQuery("")
      setShowAIInput(false)
    }, 2000)
  }

  // Reports actions
  const handleGenerateReport = () => {
    showNotification("Generating PDF medical report...", "info")
    
    const activitiesHtml = recentActivity.slice(0, 5).map(activity => `
      <div style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 3px solid #007bff;">
        <strong>${activity.action}</strong><br>
        <small>${activity.details} - ${activity.timestamp}</small>
      </div>
    `).join('')
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin: 20px 0; }
          .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .summary-box { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MEDICAL REPORT</h1>
          <p>Hakim AI Health Assistant</p>
        </div>
        
        <div class="section">
          <h2>Report Information</h2>
          <div class="summary-box">
            <p><strong>Report Type:</strong> Comprehensive Medical Report</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Doctor:</strong> Dr. Abebe Kebede</p>
            <p><strong>Hospital:</strong> Tikur Anbessa</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Patient Summary</h2>
          <div class="summary-box">
            <p><strong>Total Patients:</strong> ${patients.length}</p>
            <p><strong>Active Consultations:</strong> ${consultations.filter(c => c.status === 'pending').length}</p>
            <p><strong>Completed Consultations:</strong> ${consultations.filter(c => c.status === 'completed').length}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Recent Activity</h2>
          ${activitiesHtml}
        </div>
        
        <div class="footer">
          <p>This report contains confidential medical information.</p>
          <p>Generated by Hakim AI Health Assistant</p>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = `medical_report_${new Date().toISOString().split('T')[0]}`
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
    
    setTimeout(() => {
      showNotification("PDF report ready. Use browser print to save as PDF.", "success")
    }, 1500)
  }

  const handleUploadReport = () => {
    showNotification("Opening PDF upload dialog", "info")
    
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.style.display = 'none'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        showNotification(`Processing uploaded PDF: ${file.name}`, "info")
        setTimeout(() => {
          showNotification(`PDF report uploaded successfully: ${file.name}`, "success")
        }, 2000)
      }
    }
    
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  const handleExportData = () => {
    showNotification("Exporting all data as PDF...", "info")
    
    const patientsHtml = patients.map(patient => `
      <div style="margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
        <h3 style="color: #333; margin-bottom: 10px;">${patient.name}</h3>
        <div style="margin: 5px 0;"><strong>FIN:</strong> ${patient.faydaId}</div>
        <div style="margin: 5px 0;"><strong>Age:</strong> ${patient.age}, <strong>Gender:</strong> ${patient.gender}</div>
        <div style="margin: 5px 0;"><strong>Blood Type:</strong> ${patient.bloodType}</div>
        <div style="margin: 5px 0;"><strong>Conditions:</strong> ${patient.conditions.join(', ')}</div>
        <div style="margin: 5px 0;"><strong>Allergies:</strong> ${patient.allergies.join(', ')}</div>
      </div>
    `).join('')
    
    const consultationsHtml = consultations.map(consultation => `
      <div style="margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
        <h3 style="color: #333; margin-bottom: 10px;">${consultation.patientName}</h3>
        <div style="margin: 5px 0;"><strong>Date:</strong> ${consultation.date}</div>
        <div style="margin: 5px 0;"><strong>Type:</strong> ${consultation.type}, <strong>Status:</strong> ${consultation.status}</div>
        <div style="margin: 5px 0;"><strong>Diagnosis:</strong> ${consultation.diagnosis}</div>
        <div style="margin: 5px 0;"><strong>Prescription:</strong> ${consultation.prescription}</div>
      </div>
    `).join('')
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Complete Data Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin: 20px 0; }
          .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPREHENSIVE DATA EXPORT</h1>
          <p>Hakim AI Health Assistant</p>
        </div>
        
        <div class="section">
          <h2>Export Information</h2>
          <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Doctor:</strong> Dr. Abebe Kebede</p>
          <p><strong>Total Patients:</strong> ${patients.length}</p>
          <p><strong>Total Consultations:</strong> ${consultations.length}</p>
        </div>
        
        <div class="section">
          <h2>Patient Data</h2>
          ${patientsHtml}
        </div>
        
        <div class="section">
          <h2>Consultation Data</h2>
          ${consultationsHtml}
        </div>
        
        <div class="footer">
          <p>This export contains all patient and consultation data.</p>
          <p>Generated by Hakim AI Health Assistant</p>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = `complete_data_export_${new Date().toISOString().split('T')[0]}`
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
    
    setTimeout(() => {
      showNotification("Complete data PDF ready. Use browser print to save as PDF.", "success")
    }, 2000)
  }

  const handleDownloadReport = (reportName: string) => {
    showNotification(`Generating PDF for ${reportName}`, "info")
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin: 20px 0; }
          .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-box { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reportName}</h1>
          <p>Hakim AI Health Assistant</p>
        </div>
        
        <div class="section">
          <h2>Report Information</h2>
          <div class="info-box">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Doctor:</strong> Dr. Abebe Kebede</p>
            <p><strong>Hospital:</strong> Tikur Anbessa</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Report Details</h2>
          <div class="info-box">
            <p>This is a detailed medical report containing patient information, diagnosis, treatment plans, and medical recommendations.</p>
            <p>The report includes comprehensive medical data and professional medical analysis.</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Confidentiality Notice</h2>
          <div class="info-box">
            <p>This document contains sensitive medical information and should be handled with appropriate confidentiality measures.</p>
            <p>Access to this report is restricted to authorized medical personnel only.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Generated by Hakim AI Health Assistant</p>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = `${reportName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}`
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
    
    setTimeout(() => {
      showNotification(`PDF ready for ${reportName}. Use browser print to save as PDF.`, "success")
    }, 1000)
  }

  // Settings actions
  const handleEditProfile = () => {
    setShowEditProfileModal(true)
    showNotification("Opening profile editor", "info")
  }

  const handleSaveProfile = () => {
    // Validate required fields
    if (!doctorProfile.firstName.trim() || !doctorProfile.lastName.trim()) {
      showNotification("First name and last name are required", "error")
      return
    }
    if (!doctorProfile.email.trim()) {
      showNotification("Email is required", "error")
      return
    }
    if (!doctorProfile.specialty.trim()) {
      showNotification("Specialty is required", "error")
      return
    }

    setShowEditProfileModal(false)
    showNotification("Profile updated successfully!", "success")
  }

  const handleCancelEditProfile = () => {
    setShowEditProfileModal(false)
  }

  const handleAddLanguage = () => {
    const newLanguage = prompt("Enter language:")
    if (newLanguage && newLanguage.trim()) {
      setDoctorProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }))
    }
  }

  const handleRemoveLanguage = (language: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }))
  }

  const handleAddCertification = () => {
    const newCertification = prompt("Enter certification:")
    if (newCertification && newCertification.trim()) {
      setDoctorProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }))
    }
  }

  const handleRemoveCertification = (certification: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certification)
    }))
  }

  const handleSecuritySettings = () => {
    showNotification("Opening security settings", "info")
  }

  const handleBackupData = () => {
    showNotification("Starting data backup...", "info")
    setTimeout(() => {
      showNotification("Backup completed successfully!", "success")
    }, 3000)
  }

  // Quick actions
  const handleSearchPatient = () => {
    showNotification("Opening patient search interface", "info")
    // Switch to patients tab and focus search
    setActiveTab("patients")
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Search patients"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  }

  const handleNewConsultationQuick = () => {
    showNotification("Opening new consultation form", "info")
    setShowNewConsultation(true)
    // You could also switch to consultations tab
    setActiveTab("consultations")
  }

  const handleAIDiagnosisHelp = () => {
    showNotification("Opening AI diagnosis assistant", "info")
    setShowAIInput(true)
    setActiveTab("ai-tools")
  }

  const handleDrugInteractionCheck = () => {
    showNotification("Opening drug interaction checker", "info")
    setActiveTab("ai-tools")
    // You could also open a specific drug interaction modal
  }

  const patients = [
    {
      id: 1,
      name: "Alemayehu Kebede",
      faydaId: "FIN123456789",
      age: 35,
      gender: "Male",
      lastVisit: "2 days ago",
      status: "active",
      emergencyContact: "+251911234567",
      bloodType: "O+",
      allergies: ["Penicillin", "Sulfa"],
      conditions: ["Hypertension", "Diabetes Type 2"]
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      faydaId: "FIN987654321",
      age: 28,
      gender: "Female",
      lastVisit: "1 week ago",
      status: "active",
      emergencyContact: "+251922345678",
      bloodType: "A-",
      allergies: ["Latex"],
      conditions: ["Asthma"]
    },
    {
      id: 3,
      name: "Tesfaye Haile",
      faydaId: "FIN456789123",
      age: 45,
      gender: "Male",
      lastVisit: "3 days ago",
      status: "emergency",
      emergencyContact: "+251933456789",
      bloodType: "B+",
      allergies: ["None"],
      conditions: ["Heart Disease", "High Cholesterol"]
    }
  ]

  const [consultations, setConsultations] = useState([
    {
      id: 1,
      patientName: "Alemayehu Kebede",
      date: "2024-01-15",
      type: "Follow-up",
      status: "completed",
      diagnosis: "Hypertension management",
      prescription: "Amlodipine 5mg daily"
    },
    {
      id: 2,
      patientName: "Fatima Ahmed",
      date: "2024-01-14",
      type: "Emergency",
      status: "completed",
      diagnosis: "Acute asthma attack",
      prescription: "Albuterol inhaler"
    },
    {
      id: 3,
      patientName: "Tesfaye Haile",
      date: "2024-01-13",
      type: "Initial",
      status: "pending",
      diagnosis: "Chest pain evaluation",
      prescription: "Pending tests"
    }
  ])

  const doctorStats = {
    totalPatients: 156,
    consultationsToday: 8,
    emergencyCases: 2,
    pendingReports: 5,
    averageRating: 4.8,
    yearsExperience: 12
  }

  const quickActionStats = {
    searchPatient: 45,
    newConsultation: 23,
    aiDiagnosis: 12,
    drugInteraction: 8
  }

  const recentActivity = [
    {
      id: 1,
      action: "Patient consultation completed",
      details: "Alemayehu Kebede - Hypertension follow-up",
      timestamp: "2 hours ago",
      type: "consultation"
    },
    {
      id: 2,
      action: "Emergency alert responded",
      details: "Fatima Ahmed - Asthma attack",
      timestamp: "4 hours ago",
      type: "emergency"
    },
    {
      id: 3,
      action: "Medical report uploaded",
      details: "Tesfaye Haile - Cardiac evaluation",
      timestamp: "1 day ago",
      type: "report"
    },
    {
      id: 4,
      action: "AI diagnosis assistance",
      details: "Drug interaction check completed",
      timestamp: "1 day ago",
      type: "ai"
    }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.faydaId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["doctor"]} loginRoute="/doctor/login">
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900'
      }`}>
      <header className={`border-b px-4 py-4 ${
        theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-blue-200 bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => router.push("/")} className={
              theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-800' : 'text-gray-700 hover:bg-blue-100'
            }>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={32} height={32} />
            <span className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-green-400' : 'text-blue-600'
            }`}>Doctor Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className={
              theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-800' : 'text-gray-700 hover:bg-blue-100'
            }>
              <AlertTriangle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className={
              theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-800' : 'text-gray-700 hover:bg-blue-100'
            }>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6">
          <div className="w-64 flex-shrink-0">
            <Card className={`${
              theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className={`${
                      theme === 'dark' ? 'bg-green-500' : 'bg-blue-500'
                    } text-white`}>
                      {doctorProfile.firstName[0]}{doctorProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>Dr. {doctorProfile.firstName} {doctorProfile.lastName}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                    }`}>{doctorProfile.specialty}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100' 
                        : activeTab === "overview"
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "patients" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100' 
                        : activeTab === "patients"
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveTab("patients")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Patients
                  </Button>
                  <Button
                    variant={activeTab === "consultations" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100' 
                        : activeTab === "consultations"
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveTab("consultations")}
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Consultations
                  </Button>
                  <Button
                    variant={activeTab === "ai-tools" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100' 
                        : activeTab === "ai-tools"
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveTab("ai-tools")}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI Tools
                  </Button>
                  <Button
                    variant={activeTab === "reports" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100' 
                        : activeTab === "reports"
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveTab("reports")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      theme === 'dark' 
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100' 
                        : activeTab === "settings"
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  
                  {/* Theme Toggle Button */}
                  <div className={`pt-4 border-t ${
                    theme === 'dark' ? 'border-zinc-600' : 'border-blue-200'
                  }`}>
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className={`${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                          }`}>{doctorStats.totalPatients}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                          }`}>Total Patients</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-8 w-8 text-green-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                          }`}>{doctorStats.consultationsToday}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                          }`}>Today's Consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                          }`}>{doctorStats.emergencyCases}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                          }`}>Emergency Cases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                          }`}>{doctorStats.pendingReports}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                          }`}>Pending Reports</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={`${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`${
                        theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                      }`}>Quick Actions</CardTitle>
                      <CardDescription className={`${
                        theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                      }`}>Common doctor tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 transform hover:scale-105" 
                        onClick={handleSearchPatient}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search Patient
                        <Badge variant="secondary" className="ml-auto text-xs">45</Badge>
                      </Button>
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-105" 
                        onClick={handleNewConsultationQuick}
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        New Consultation
                        <Badge variant="secondary" className="ml-auto text-xs">23</Badge>
                      </Button>
                      <Button 
                        className="w-full bg-purple-500 hover:bg-purple-600 transition-all duration-200 transform hover:scale-105" 
                        onClick={handleAIDiagnosisHelp}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        AI Diagnosis Help
                        <Badge variant="secondary" className="ml-auto text-xs">12</Badge>
                      </Button>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 transform hover:scale-105" 
                        onClick={handleDrugInteractionCheck}
                      >
                        <Pill className="h-4 w-4 mr-2" />
                        Drug Interaction Check
                        <Badge variant="secondary" className="ml-auto text-xs">8</Badge>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`${
                        theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                      }`}>Performance Stats</CardTitle>
                      <CardDescription className={`${
                        theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                      }`}>Your professional metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`${
                          theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                        }`}>Patient Rating</span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                        }`}>{doctorStats.averageRating}/5.0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${
                          theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                        }`}>Years Experience</span>
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                        }`}>{doctorStats.yearsExperience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${
                          theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                        }`}>Specialization</span>
                        <Badge className="bg-green-500 text-white">Cardiology</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${
                          theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                        }`}>License Status</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className={`${
                  theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={`${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>Recent Activity</CardTitle>
                    <CardDescription className={`${
                      theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                    }`}>Your latest medical activities and consultations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className={`flex items-center space-x-4 p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-zinc-700/50' : 'bg-blue-50/50'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'emergency' ? 'bg-red-500' :
                            activity.type === 'consultation' ? 'bg-green-500' :
                            activity.type === 'report' ? 'bg-blue-500' : 'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                            }`}>{activity.action}</p>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                            }`}>{activity.details}</p>
                          </div>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'
                          }`}>{activity.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "patients" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search patients by name or FIN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (searchQuery.trim()) {
                            showNotification(`Searching for: ${searchQuery}`, "info")
                          } else {
                            showNotification("Please enter a search term", "error")
                          }
                        }
                      }}
                      className="w-64 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                    />
                    <Button className="bg-sky-500 hover:bg-sky-600" onClick={() => {
                      if (searchQuery.trim()) {
                        showNotification(`Searching for: ${searchQuery}`, "info")
                      } else {
                        showNotification("Please enter a search term", "error")
                      }
                    }}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          showNotification("Search cleared", "info")
                        }}
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddPatient}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>

                {searchQuery && (
                  <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-blue-400" />
                      <span className="text-zinc-300">
                        Search results for "{searchQuery}": {filteredPatients.length} patients found
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="text-zinc-400 hover:text-zinc-100"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}

                <div className="grid gap-4">
                  {filteredPatients.length === 0 && searchQuery ? (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-zinc-300 mb-2">No patients found</h3>
                      <p className="text-zinc-500 mb-4">
                        No patients match your search for "{searchQuery}"
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchQuery("")}
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        Clear Search
                      </Button>
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                    <Card key={patient.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="bg-blue-500 text-white">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">{patient.name}</h3>
                              <p className="text-zinc-400">FIN: {patient.faydaId}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-zinc-400">{patient.age} years, {patient.gender}</span>
                                <span className="text-sm text-zinc-400">Blood: {patient.bloodType}</span>
                                <span className="text-sm text-zinc-400">Last visit: {patient.lastVisit}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {patient.conditions.map((condition, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              patient.status === 'emergency' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                            }>
                              {patient.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleViewPatient(patient)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleStartConsultation(patient)}>
                                <Stethoscope className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleViewPatientHistory(patient)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-zinc-400">Emergency Contact: {patient.emergencyContact}</p>
                              <p className="text-sm text-zinc-400">Allergies: {patient.allergies.join(', ')}</p>
                            </div>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => handleViewPatientHistory(patient)}>
                              View Full History
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                </div>
              </div>
            )}

            {activeTab === "consultations" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-zinc-100">Consultations</h2>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search consultations..."
                      value={consultationSearchQuery}
                      onChange={(e) => setConsultationSearchQuery(e.target.value)}
                      className="w-64 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                    />
                    <Button variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={handleImportConsultation}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import PDF
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-300 hover:bg-blue-700" onClick={handleExportAllConsultations}>
                      <Download className="h-4 w-4 mr-2" />
                      Export All PDF
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600" onClick={handleNewConsultation}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Consultation
                    </Button>
                  </div>
                </div>

                {/* Consultation Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-6 w-6 text-blue-400" />
                        <div>
                          <p className="text-lg font-bold text-zinc-100">{consultations.length}</p>
                          <p className="text-sm text-zinc-400">Total</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <div>
                          <p className="text-lg font-bold text-zinc-100">{consultations.filter(c => c.status === 'completed').length}</p>
                          <p className="text-sm text-zinc-400">Completed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-6 w-6 text-blue-400" />
                        <div>
                          <p className="text-lg font-bold text-zinc-100">{consultations.filter(c => c.status === 'pending').length}</p>
                          <p className="text-sm text-zinc-400">Pending</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-6 w-6 text-purple-400" />
                        <div>
                          <p className="text-lg font-bold text-zinc-100">Today</p>
                          <p className="text-sm text-zinc-400">New: 2</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filter Controls */}
                <div className="flex space-x-4">
                  <Button 
                    variant={consultationFilter === "all" ? "default" : "outline"}
                    onClick={() => setConsultationFilter("all")}
                    className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                  >
                    All ({consultations.length})
                  </Button>
                  <Button 
                    variant={consultationFilter === "completed" ? "default" : "outline"}
                    onClick={() => setConsultationFilter("completed")}
                    className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                  >
                    Completed ({consultations.filter(c => c.status === 'completed').length})
                  </Button>
                  <Button 
                    variant={consultationFilter === "pending" ? "default" : "outline"}
                    onClick={() => setConsultationFilter("pending")}
                    className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                  >
                    Pending ({consultations.filter(c => c.status === 'pending').length})
                  </Button>
                </div>

                <div className="grid gap-4">
                  {consultations
                    .filter(consultation => 
                      consultationFilter === "all" || 
                      consultation.status === consultationFilter
                    )
                    .filter(consultation =>
                      consultationSearchQuery === "" ||
                      consultation.patientName.toLowerCase().includes(consultationSearchQuery.toLowerCase()) ||
                      consultation.type.toLowerCase().includes(consultationSearchQuery.toLowerCase()) ||
                      consultation.diagnosis.toLowerCase().includes(consultationSearchQuery.toLowerCase())
                    )
                    .map((consultation) => (
                    <Card key={consultation.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">{consultation.patientName}</h3>
                              <p className="text-zinc-400">{consultation.type} Consultation</p>
                              <p className="text-sm text-zinc-500">Date: {consultation.date}</p>
                              {consultation.finNumber && (
                                <p className="text-sm text-zinc-500">FIN: {consultation.finNumber}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm text-zinc-400">Diagnosis: {consultation.diagnosis}</span>
                                <span className="text-sm text-zinc-400">•</span>
                                <span className="text-sm text-zinc-400">Prescription: {consultation.prescription}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              consultation.status === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                            }>
                              {consultation.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleViewConsultationDetails(consultation)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleEditConsultation(consultation)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleViewConsultationReport(consultation)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleUploadConsultation(consultation)}>
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-blue-600 text-blue-300 hover:bg-blue-700" onClick={() => handleExportConsultation(consultation)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              {consultation.status === 'pending' && (
                                <Button size="sm" variant="outline" className="border-green-600 text-green-300 hover:bg-green-700" onClick={() => handleCompleteConsultation(consultation)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="border-red-600 text-red-300 hover:bg-red-700" onClick={() => handleDeleteConsultation(consultation)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "ai-tools" && (
              <DoctorChatInterface onBack={() => setActiveTab("overview")} />
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Medical Reports</CardTitle>
                    <CardDescription className="text-zinc-400">Generate and manage patient reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleGenerateReport}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate PDF Report
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600" onClick={handleUploadReport}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF Report
                      </Button>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data PDF
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-zinc-100">Recent Reports</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-700/50">
                          <div>
                            <p className="text-zinc-100 font-medium">Alemayehu Kebede - Cardiac Report</p>
                            <p className="text-sm text-zinc-400">Generated 2 hours ago</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleDownloadReport("Alemayehu Kebede - Cardiac Report")}>
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-700/50">
                          <div>
                            <p className="text-zinc-100 font-medium">Fatima Ahmed - Asthma Evaluation</p>
                            <p className="text-sm text-zinc-400">Generated 1 day ago</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700" onClick={() => handleDownloadReport("Fatima Ahmed - Asthma Evaluation")}>
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className={`${
                  theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={`${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>Doctor Settings</CardTitle>
                    <CardDescription className={`${
                      theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                    }`}>Configure your professional profile and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                        }`}>Profile Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Name</span>
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                            }`}>Dr. {doctorProfile.firstName} {doctorProfile.lastName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Specialization</span>
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                            }`}>{doctorProfile.specialty}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>License Number</span>
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                            }`}>{doctorProfile.licenseNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Hospital</span>
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                            }`}>{doctorProfile.hospital}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Experience</span>
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                            }`}>{doctorProfile.experience} years</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                        }`}>Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>AI Assistance</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Emergency Alerts</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Auto Backup</span>
                            <Badge className="bg-green-500 text-white">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
                            }`}>Theme</span>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${
                                theme === 'dark' ? 'bg-zinc-600 text-zinc-100' : 'bg-blue-500 text-white'
                              }`}>
                                {theme === 'dark' ? 'Dark' : 'Light'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                                  setTheme(newTheme);
                                  showNotification(`Switched to ${newTheme} mode`, 'success');
                                }}
                                className={`${
                                  theme === 'dark' 
                                    ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleEditProfile}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button className="w-full bg-green-500 hover:bg-green-600" onClick={handleSecuritySettings}>
                        <Shield className="h-4 w-4 mr-2" />
                        Security Settings
                      </Button>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleBackupData}>
                        <Database className="h-4 w-4 mr-2" />
                        Backup Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Patient Modal */}
      {showPatientModal && selectedPatient && (
        <DoctorViewPatientForm
          patient={selectedPatient}
          onClose={() => {
            setShowPatientModal(false)
            setSelectedPatient(null)
          }}
        />
      )}

      {/* Consultation Details Modal */}
      {showConsultationModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-2xl ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-blue-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Consultation Details</CardTitle>
                <CardDescription className={`${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                  {selectedConsultation.patientName} - {selectedConsultation.type}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowConsultationModal(false)
                setSelectedConsultation(null)
              }} className={
                theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-700' : 'text-gray-700 hover:bg-blue-100'
              }>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                  }`}>Patient</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>{selectedConsultation.patientName}</p>
                </div>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                  }`}>Date</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>{selectedConsultation.date}</p>
                </div>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                  }`}>FIN Number</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>{selectedConsultation.finNumber || "Not provided"}</p>
                </div>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                  }`}>Type</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>{selectedConsultation.type}</p>
                </div>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                  }`}>Status</p>
                  <Badge className={
                    selectedConsultation.status === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }>
                    {selectedConsultation.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>Diagnosis</p>
                <p className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>{selectedConsultation.diagnosis}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>Prescription</p>
                <p className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>{selectedConsultation.prescription}</p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setShowConsultationModal(false)
                  setSelectedConsultation(null)
                }} className={
                  theme === 'dark' ? 'border-zinc-600 text-zinc-100' : 'border-gray-300 text-gray-700'
                }>
                  Close
                </Button>
                <Button onClick={() => handleEditConsultation(selectedConsultation)}>
                  Edit Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Consultation Modal */}
      {showEditConsultationModal && editingConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-2xl ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-blue-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Edit Consultation</CardTitle>
                <CardDescription className={`${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                  Update consultation for {editingConsultation.patientName}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancelEditConsultation} className={
                theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-700' : 'text-gray-700 hover:bg-blue-100'
              }>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>Patient Name</Label>
                  <Input
                    value={editingConsultation.patientName}
                    onChange={(e) => setEditingConsultation(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name"
                    className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>FIN Number</Label>
                  <Input
                    value={editingConsultation.finNumber || ""}
                    onChange={(e) => setEditingConsultation(prev => ({ ...prev, finNumber: e.target.value }))}
                    placeholder="Enter FIN number"
                    className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>Consultation Type</Label>
                  <Select value={editingConsultation.type} onValueChange={(value) => setEditingConsultation(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600' 
                        : 'bg-white border-gray-300'
                    }`}>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Initial">Initial</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>Status</Label>
                  <Select value={editingConsultation.status} onValueChange={(value) => setEditingConsultation(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600' 
                        : 'bg-white border-gray-300'
                    }`}>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Diagnosis</Label>
                <Textarea
                  value={editingConsultation.diagnosis}
                  onChange={(e) => setEditingConsultation(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Enter diagnosis"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  rows={3}
                />
              </div>
              <div>
                <Label className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Prescription</Label>
                <Textarea
                  value={editingConsultation.prescription}
                  onChange={(e) => setEditingConsultation(prev => ({ ...prev, prescription: e.target.value }))}
                  placeholder="Enter prescription"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancelEditConsultation} className={
                  theme === 'dark' ? 'border-zinc-600 text-zinc-100' : 'border-gray-300 text-gray-700'
                }>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditConsultation} className="bg-blue-500 hover:bg-blue-600">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document View Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-4xl ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-blue-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>{selectedDocument.title}</CardTitle>
                <CardDescription className={`${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                  Medical document viewer
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExportConsultation(selectedDocument.consultation)} className={
                  theme === 'dark' ? 'border-zinc-600 text-zinc-100' : 'border-gray-300 text-gray-700'
                }>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowDocumentModal(false)
                  setSelectedDocument(null)
                }} className={
                  theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-700' : 'text-gray-700 hover:bg-blue-100'
                }>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <pre className={`whitespace-pre-wrap font-mono text-sm ${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>
                  {selectedDocument.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-blue-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Edit Profile</CardTitle>
                <CardDescription className={`${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                  Update your professional information
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancelEditProfile} className={
                theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-700' : 'text-gray-700 hover:bg-blue-100'
              }>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={`${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>First Name</Label>
                    <Input
                      value={doctorProfile.firstName}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>Last Name</Label>
                    <Input
                      value={doctorProfile.lastName}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>Email</Label>
                    <Input
                      type="email"
                      value={doctorProfile.email}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, email: e.target.value }))}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <Label className={`${
                      theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                    }`}>Phone</Label>
                    <Input
                      value={doctorProfile.phone}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-100">Specialty</Label>
                    <Select value={doctorProfile.specialty} onValueChange={(value) => setDoctorProfile(prev => ({ ...prev, specialty: value }))}>
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-700 border-zinc-600">
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-zinc-100">License Number</Label>
                    <Input
                      value={doctorProfile.licenseNumber}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-100">Years of Experience</Label>
                    <Input
                      type="number"
                      value={doctorProfile.experience}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, experience: e.target.value }))}
                      className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-100">Hospital</Label>
                    <Input
                      value={doctorProfile.hospital}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, hospital: e.target.value }))}
                      className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100">Education</h3>
                <div>
                  <Label className="text-zinc-100">Education & Qualifications</Label>
                  <Textarea
                    value={doctorProfile.education}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="Enter your education and qualifications"
                    className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    rows={3}
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {doctorProfile.languages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-500 text-white">
                      {language}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-1 h-4 w-4 p-0 text-white hover:bg-blue-600"
                        onClick={() => handleRemoveLanguage(language)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Button size="sm" variant="outline" onClick={handleAddLanguage}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Language
                  </Button>
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {doctorProfile.certifications.map((certification, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-500 text-white">
                      {certification}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-1 h-4 w-4 p-0 text-white hover:bg-green-600"
                        onClick={() => handleRemoveCertification(certification)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Button size="sm" variant="outline" onClick={handleAddCertification}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Certification
                  </Button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-100">Address</Label>
                    <Input
                      value={doctorProfile.address}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, address: e.target.value }))}
                      className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-100">Availability</Label>
                    <Input
                      value={doctorProfile.availability}
                      onChange={(e) => setDoctorProfile(prev => ({ ...prev, availability: e.target.value }))}
                      className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-zinc-100">Bio</Label>
                  <Textarea
                    value={doctorProfile.bio}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Enter your professional bio"
                    className="bg-zinc-700 border-zinc-600 text-zinc-100"
                    rows={4}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancelEditProfile}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} className="bg-blue-500 hover:bg-blue-600">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Consultation Modal */}
      {showNewConsultationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-2xl ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-blue-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>New Consultation</CardTitle>
                <CardDescription className={`${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                  Create a new consultation record
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancelNewConsultation} className={
                theme === 'dark' ? 'text-zinc-100 hover:bg-zinc-700' : 'text-gray-700 hover:bg-blue-100'
              }>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>Patient Name</Label>
                  <Input
                    value={newConsultationData.patientName}
                    onChange={(e) => setNewConsultationData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name"
                    className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>FIN Number</Label>
                  <Input
                    value={newConsultationData.finNumber}
                    onChange={(e) => setNewConsultationData(prev => ({ ...prev, finNumber: e.target.value }))}
                    placeholder="Enter FIN number"
                    className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={`${
                    theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                  }`}>Consultation Type</Label>
                  <Select value={newConsultationData.type} onValueChange={(value) => setNewConsultationData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${
                      theme === 'dark' 
                        ? 'bg-zinc-700 border-zinc-600' 
                        : 'bg-white border-gray-300'
                    }`}>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Initial">Initial</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
              </div>
              <div>
                <Label className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Diagnosis</Label>
                <Textarea
                  value={newConsultationData.diagnosis}
                  onChange={(e) => setNewConsultationData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Enter diagnosis"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  rows={3}
                />
              </div>
              <div>
                <Label className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Prescription</Label>
                <Textarea
                  value={newConsultationData.prescription}
                  onChange={(e) => setNewConsultationData(prev => ({ ...prev, prescription: e.target.value }))}
                  placeholder="Enter prescription"
                  className={`${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  rows={3}
                />
              </div>
              <div>
                <Label className={`${
                  theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'
                }`}>Status</Label>
                <Select value={newConsultationData.status} onValueChange={(value) => setNewConsultationData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className={`${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${
                    theme === 'dark' 
                      ? 'bg-zinc-700 border-zinc-600' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancelNewConsultation} className={
                  theme === 'dark' ? 'border-zinc-600 text-zinc-100' : 'border-gray-300 text-gray-700'
                }>
                  Cancel
                </Button>
                <Button onClick={handleCreateConsultation} className="bg-green-500 hover:bg-green-600">
                  Create Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
} 