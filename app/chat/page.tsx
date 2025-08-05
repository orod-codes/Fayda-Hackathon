'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Send,
  ArrowLeft,
  Bot,
  User,
  AlertTriangle,
  Phone,
  FileText,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEmergency?: boolean;
}

export default function ChatPage() {
  const { translations, language } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const router = useRouter();
 const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    content: `Hello ${user?.name ?? 'there'}, I'm hakim-ai, your AI health assistant. How can I help you today?`,
    role: 'assistant',
    timestamp: new Date(),
  },
]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the real ChatGPT API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        isEmergency: data.isEmergency,
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (data.isEmergency) {
        setIsEmergency(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again later or contact a healthcare professional for immediate assistance.",
        role: 'assistant',
        timestamp: new Date(),
        isEmergency: false,
      };

      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ProtectedRoute allowedRoles={['patient']} loginRoute="/patient/login">
      <div
        className={`min-h-screen ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-100 text-black'
        }`}
      >
        {/* Header */}
        <header
          className={`border-b backdrop-blur-sm px-6 py-4 ${
            theme === 'dark' ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/50 bg-white/50'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.push('/patient')}
                className={`${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                } transition-colors duration-200`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {translations.backToDashboard}
              </Button>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'shadow-lg' : 'shadow-md'
                  }`}
                >
                  <Image src="/images/hakmin-logo.png" alt="Hakmin Logo" width={24} height={24} />
                </div>
                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {translations.healthChat}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                className={`${
                  theme === 'dark'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {translations.aiOnline}
              </Badge>
            </div>
          </div>
        </header>

        {/* Emergency Alert */}
        {isEmergency && (
          <div className={`border-l-4 border-red-500 p-4 ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-100'}`}>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className={`font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
                  {translations.emergencyDetected}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                  {translations.emergencyCall}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex space-x-6">
            {/* Chat Area */}
            <div className="flex-1">
              <Card
                className={`h-[700px] flex flex-col ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                    : 'bg-white/50 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                }`}
              >
                <CardHeader className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {translations.hakminAI}
                      </CardTitle>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {translations.aiHealthCompanion}
                      </p>
                    </div>
                    <Badge
                      className={`ml-auto ${
                        theme === 'dark'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-green-100 text-green-700 border-green-200'
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      {translations.online}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback
                              className={
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                  : 'bg-gradient-to-r from-sky-400 to-blue-600 text-white'
                              }
                            >
                              {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                : message.isEmergency
                                ? theme === 'dark'
                                  ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                                  : 'bg-red-100 border border-red-300 text-red-800'
                                : theme === 'dark'
                                ? 'bg-gray-700/50 text-white border border-gray-600/50'
                                : 'bg-gray-100 text-black'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${message.role === 'user' ? 'opacity-80' : 'opacity-60'}`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-600 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 ${
                              theme === 'dark' ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-100'
                            }`}
                          >
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className={`border-t p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={translations.typeMessage}
                      className={`flex-1 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-500'
                      } transition-colors duration-200`}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="w-64 space-y-4">
              <Card
                className={`${
                  theme === 'dark'
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                    : 'bg-white/50 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                }`}
              >
                <CardHeader>
                  <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {translations.quickActions}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      theme === 'dark'
                        ? 'border-gray-600 text-white hover:bg-gray-700'
                        : 'border-gray-300 text-black hover:bg-gray-50'
                    } transition-colors duration-200`}
                    onClick={() => router.push('/patient')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {translations.emergencyContacts}
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      theme === 'dark'
                        ? 'border-gray-600 text-white hover:bg-gray-700'
                        : 'border-gray-300 text-black hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {translations.uploadDocuments}
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      theme === 'dark'
                        ? 'border-gray-600 text-white hover:bg-gray-700'
                        : 'border-gray-300 text-black hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {translations.medicationReminders}
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      theme === 'dark'
                        ? 'border-gray-600 text-white hover:bg-gray-700'
                        : 'border-gray-300 text-black hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {translations.healthTips}
                  </Button>
                </CardContent>
              </Card>

              <Card
                className={`${
                  theme === 'dark'
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                    : 'bg-white/50 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300'
                }`}
              >
                <CardHeader>
                  <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {translations.emergencyNumbers}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="font-semibold">{translations.ambulance}</p>
                    <p className="font-semibold">{translations.police}</p>
                    <p className="font-semibold">{translations.fire}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
