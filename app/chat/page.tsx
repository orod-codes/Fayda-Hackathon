'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
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
      <div className="min-h-screen bg-background text-foreground">
        <Navigation 
          title="Health Chat"
          showBack={true}
          backRoute="/patient"
          showUserMenu={false}
        >
                          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 dark:text-blue-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            AI Online
          </Badge>
        </Navigation>

        {/* Emergency Alert */}
        {isEmergency && (
          <div className="border-l-4 border-destructive p-4 bg-destructive/10">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              <div>
                <p className="font-semibold text-destructive">
                  Emergency Detected!
                </p>
                <p className="text-sm text-destructive/80">
                  Please call emergency services immediately: 911
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
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        hakim-ai AI Assistant
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Your AI health companion powered by ChatGPT
                      </p>
                    </div>
                    <Badge className="ml-auto bg-blue-500/20 text-blue-600 border-blue-500/30 dark:text-blue-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      Online
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
                                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
                                  : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
                              }
                            >
                              {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
                                : message.isEmergency
                                ? 'bg-destructive/20 border border-destructive/30 text-destructive'
                                : 'bg-muted/50 text-foreground border border-border/50'
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
                            <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg p-3 bg-muted/50 border border-border/50">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
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

                <div className="border-t border-border p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your health question..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="w-64 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/patient')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Contacts
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Medication Reminders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Health Tips
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-foreground">
                    <p className="font-semibold">Ambulance: 911</p>
                    <p className="font-semibold">Police: 991</p>
                    <p className="font-semibold">Fire: 939</p>
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
