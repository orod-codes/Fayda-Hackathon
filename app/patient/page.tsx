'use client';

import { useState , useRef } from 'react';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  MessageSquare,
  User,
  Shield,
  Phone,
  FileText,
  Calendar,
  AlertTriangle,
  Activity,
  Settings,
  LogOut,
  Heart,
  Pill,
  Clock,
  Bell,
  Upload,
  Download,
  Video,
  Watch,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';

export default function PatientPage() {
  const { translations, language } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  const [selectedHospital, setSelectedHospital] = useState('');
const [selectedDoctor, setSelectedDoctor] = useState('');
const [showVideo, setShowVideo] = useState(false);



// const vapidKeys = webpush.generateVAPIDKeys()
// console.log(vapidKeys)

  const meetingName = encodeURIComponent((user?.name || 'guest') + '-' + selectedDoctor);


  const medicalHistory = [
    {
      id: '1',
      date: '2024-01-15',
      hospital: 'Tikur Anbessa Hospital',
      doctor: 'Dr. Abebe Kebede',
      diagnosis: 'Hypertension',
      treatment: 'Amlodipine 5mg daily',
      status: 'Active',
    },
    {
      id: '2',
      date: '2023-12-20',
      hospital: "St. Paul's Hospital",
      doctor: 'Dr. Fatima Ahmed',
      diagnosis: 'Diabetes Type 2',
      treatment: 'Metformin 500mg twice daily',
      status: 'Active',
    },
  ];
const doctorsByHospital: Record<string, { name: string; email: string }[]> = {
  'Tikur Anbessa Hospital': [
    { name: 'Dr. Abebe Kebede', email: 'aaufresh@gmail.com' },
    { name: 'Dr. Mesfin Tesfaye', email: 'girmadorsis@gmail.com' },
  ]
  ,

  "St. Paul's Hospital": [
    { name: 'Dr. Fatima Ahmed', email: 'fatima@example.com' },
    { name: 'Dr. Hiwot Bekele', email: 'hiwot@example.com' },
  ],
}



const handleUploadClick = () => {
  fileInputRef.current?.click();
};

const fileInputRef = useRef<HTMLInputElement>(null);

const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);




const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files);

    // Save file names to local storage
    const existing = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
    const newEntries = fileArray.map(f => ({ name: f.name, type: f.type, size: f.size, time: new Date().toISOString() }));
    localStorage.setItem('uploadedDocuments', JSON.stringify([...existing, ...newEntries]));

    // Set for preview
    setUploadedFiles(prev => [...prev, ...fileArray]);
  }}

  const medications = [
    {
      id: '1',
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      time: '08:00 AM',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: '08:00 AM, 08:00 PM',
      status: 'Active',
    },
  ];

  return (
	
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50 text-zinc-900'}`}>
      {/* Header */}
	
      <header className={`border-b px-4 py-4 ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Image src="/images/hakmin-logo.png" alt="Hakmin Logo" width={32} height={32} />
            <span className="text-xl font-semibold text-sky-400">Patient Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Emergency Alert */}
      <div className="bg-red-500/10 border-l-4 border-red-500 p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <p className="text-red-300 font-semibold">Emergency Contacts</p>
            <p className="text-red-400 text-sm">Ambulance: 911 | Police: 991 | Fire: 939</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white">p</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-zinc-100">{user?.name}</p>
                      <p className="text-sm text-zinc-400">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant={activeTab === 'overview' ? 'default' : 'ghost'}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </Button>
                    <Button
                      variant={activeTab === 'chat' ? 'default' : 'ghost'}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => router.push('/chat')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Health Chat
                    </Button>
                    <Button
                      variant={activeTab === 'history' ? 'default' : 'ghost'}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab('history')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Medical History
                    </Button>
                    <Button
                      variant={activeTab === 'medications' ? 'default' : 'ghost'}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab('medications')}
                    >
                      <Pill className="h-4 w-4 mr-2" />
                      Medications
                    </Button>
                    <Button
                      variant={activeTab === 'documents' ? 'default' : 'ghost'}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab('documents')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </Button>
                    <Button
                      variant={activeTab === 'consultations' ? 'default' : 'ghost'}
                      className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                      onClick={() => setActiveTab('consultations')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Consultations
                    </Button>
                  
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* ChatGPT Chat Banner */}
                <Card className="bg-gradient-to-r from-sky-500/20 to-blue-500/20 border-sky-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-zinc-100">Chat with AI Health Assistant</h3>
                          <p className="text-zinc-300">Get instant health advice and support from our AI assistant</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push('/chat')}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-3"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Pill className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">2</p>
                          <p className="text-sm text-zinc-400">Active Medications</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-2xl font-bold text-zinc-100">3</p>
                          <p className="text-sm text-zinc-400">Upcoming Appointments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push('/chat')}
                  >
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-sky-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Health Chat</h3>
                      <p className="text-sm text-zinc-400">Chat with AI assistant</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Upload className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Upload Documents</h3>
                      <p className="text-sm text-zinc-400">Share medical files</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Video className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-zinc-100">Video Consultation</h3>
                      <p className="text-sm text-zinc-400">Schedule appointment</p>
                    </CardContent>
                  </Card>


                </div>

                {/* Recent Activity */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-4 w-4 text-sky-400" />
                          <span className="text-zinc-100">Chat session completed</span>
                        </div>
                        <span className="text-sm text-zinc-400">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Upload className="h-4 w-4 text-green-400" />
                          <span className="text-zinc-100">Medical document uploaded</span>
                        </div>
                        <span className="text-sm text-zinc-400">1 day ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Pill className="h-4 w-4 text-purple-400" />
                          <span className="text-zinc-100">Medication reminder set</span>
                        </div>
                        <span className="text-sm text-zinc-400">2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Medical History</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Your complete medical records from all hospitals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {medicalHistory.map((record) => (
                        <div key={record.id} className="border border-zinc-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-zinc-100">{record.diagnosis}</h3>
                              <p className="text-sm text-zinc-400">
                                {record.doctor} - {record.hospital}
                              </p>
                            </div>
                            <Badge variant={record.status === 'Active' ? 'default' : 'secondary'}>
                              {record.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-zinc-400">Date:</span>
                              <span className="text-zinc-100 ml-2">{record.date}</span>
                            </div>
                            <div>
                              <span className="text-zinc-400">Treatment:</span>
                              <span className="text-zinc-100 ml-2">{record.treatment}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Medication Management</CardTitle>
                    <CardDescription className="text-zinc-400">
                      AI-powered medication reminders and tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {medications.map((med) => (
                        <div key={med.id} className="border border-zinc-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-zinc-100">{med.name}</h3>
                              <p className="text-sm text-zinc-400">
                                {med.dosage} - {med.frequency}
                              </p>
                            </div>
                            <Badge variant={med.status === 'Active' ? 'default' : 'secondary'}>{med.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-zinc-400" />
                            <span className="text-zinc-400">Reminder time:</span>
                            <span className="text-zinc-100">{med.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Medical Documents</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Upload and manage your medical documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center">
                     <>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    className="hidden"
    multiple
  />

  <Card
    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer"
    onClick={handleUploadClick}
  >
    <CardContent className="p-6 text-center">
      <Upload className="h-8 w-8 text-green-400 mx-auto mb-3" />
      <h3 className="font-semibold text-zinc-100">Upload Documents</h3>
      <p className="text-sm text-zinc-400">Share medical files</p>
    </CardContent>
  </Card>

  {/* Preview Uploaded Files */}
  {uploadedFiles.map((file, index) => (
    <Card key={index} className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-4 space-y-2">
        <p className="text-zinc-100 text-sm font-medium">{file.name}</p>
        <p className="text-zinc-400 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
        {file.type.startsWith('image/') && (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="rounded max-h-48 object-contain border border-zinc-700"
          />
        )}
      </CardContent>
    </Card>
  ))}
</>

  </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
{activeTab === 'consultations' && (
  <div className="space-y-6">
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-zinc-100">Video Consultations</CardTitle>
        <CardDescription className="text-zinc-400">
          Select a hospital and doctor to begin a consultation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hospitals List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicalHistory.map((record) => (
            <Card
              key={record.hospital}
              className={`cursor-pointer p-4 border ${
                record.hospital === selectedHospital
                  ? 'border-sky-500 bg-sky-900/20'
                  : 'border-zinc-700 bg-zinc-800/50'
              }`}
              onClick={() => setSelectedHospital(record.hospital)}
            >
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">{record.hospital}</h3>
                <p className="text-sm text-zinc-400">Visited on {record.date}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Doctor Dropdown */}
        {selectedHospital && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-400">Choose a Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-md text-zinc-100"
            >
              <option value="">Select Doctor</option>
          {doctorsByHospital[selectedHospital]?.map((doc, idx) => (
  <option key={idx} value={doc.email}>
    {doc.name}
  </option>
))}

            </select>
<Button
  disabled={!selectedDoctor}
  onClick={async () => {
    setShowVideo(true);

    // Create meeting link
    const link = `https://meet.jit.si/${meetingName}`

    // Send POST request to backend
	
    await fetch("http://localhost:5000/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: selectedDoctor,  // This is now the email
        meetingLink: link,
      })
    });
  }}
  className="bg-sky-500 hover:bg-sky-600 w-full"
>

              <Video className="h-4 w-4 mr-2" />
              Start Video Consultation
            </Button>
          </div>
        )}

        {/* Video Consultation IFrame */}
        {showVideo && (
          <div className="pt-6">
          <iframe
  className="h-96 w-full border border-zinc-600 rounded-lg"
  src={`https://meet.jit.si/${meetingName}`}
  allow="camera; microphone"
/>

          </div>
        )}
      </CardContent>
    </Card>
  </div>
)}


            {activeTab === 'devices' && (
              <div className="space-y-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Health Devices</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Connect and manage wearable health devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border border-zinc-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Watch className="h-6 w-6 text-blue-400" />
                            <div>
                              <h3 className="font-semibold text-zinc-100">Smart Watch</h3>
                              <p className="text-sm text-zinc-400">Heart rate, steps, sleep tracking</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Connected</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
