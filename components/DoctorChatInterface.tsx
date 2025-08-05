"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Send, 
  MessageSquare,
  ArrowLeft,
  Bot,
  User,
  Stethoscope,
  BookOpen,
  FileText,
  Zap,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  chatType?: string;
}

interface DoctorChatProps {
  onBack: () => void;
}

export default function DoctorChatInterface({ onBack }: DoctorChatProps) {
  const { user } = useAuth();
  const [selectedChatType, setSelectedChatType] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatTypes = [
    {
      id: 'diagnosis',
      title: 'Diagnosis Assistant',
      description: 'AI-powered diagnostic support and symptom analysis',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      suggestions: [
        'Analyze symptoms: fever, cough, shortness of breath',
        'Differential diagnosis for chest pain in 45-year-old male',
        'What are the key signs of sepsis to watch for?'
      ]
    },
    {
      id: 'treatment',
      title: 'Treatment Suggestions',
      description: 'Evidence-based treatment recommendations and protocols',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      suggestions: [
        'Treatment protocol for acute myocardial infarction',
        'Antibiotic selection for community-acquired pneumonia',
        'Management guidelines for diabetic ketoacidosis'
      ]
    },
    {
      id: 'literature',
      title: 'Medical Literature',
      description: 'Access to latest research and medical studies',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      suggestions: [
        'Latest research on COVID-19 long-term effects',
        'Recent studies on hypertension management',
        'New guidelines for diabetes treatment 2024'
      ]
    },
    {
      id: 'consultation',
      title: 'Quick AI Consultation',
      description: 'Rapid clinical decision support and guidance',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      suggestions: [
        'Emergency management of anaphylaxis',
        'Drug interaction check: warfarin and amoxicillin',
        'When to refer patient to cardiology?'
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChatType) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
      chatType: selectedChatType
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/doctor/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') || 'demo-token'}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage,
          userId: user?.id || 'demo-doctor',
          chatType: selectedChatType
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
        chatType: selectedChatType
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);

      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date(),
        chatType: selectedChatType
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

  const handleChatTypeSelect = (chatTypeId: string) => {
    setSelectedChatType(chatTypeId);
    const chatType = chatTypes.find(ct => ct.id === chatTypeId);
    if (chatType) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Welcome to ${chatType.title}! I'm here to help you with ${chatType.description.toLowerCase()}. How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date(),
        chatType: chatTypeId
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (!selectedChatType) {
    // Chat Type Selection View
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Doctor AI Chat Assistant
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Choose your specialized AI assistant for medical support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chatTypes.map((chatType) => {
              const IconComponent = chatType.icon;
              return (
                <Card 
                  key={chatType.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                  onClick={() => handleChatTypeSelect(chatType.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 ${chatType.bgColor} rounded-lg`}>
                        <IconComponent className={`h-8 w-8 ${chatType.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                          {chatType.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                          {chatType.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Example queries:
                      </p>
                      {chatType.suggestions.slice(0, 2).map((suggestion, index) => (
                        <p key={index} className="text-xs text-zinc-500 dark:text-zinc-400">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentChatType = chatTypes.find(ct => ct.id === selectedChatType);
  const IconComponent = currentChatType?.icon || Brain;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedChatType(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat Types
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 ${currentChatType?.bgColor} rounded-lg`}>
              <IconComponent className={`h-6 w-6 ${currentChatType?.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {currentChatType?.title}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {currentChatType?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {currentChatType?.title} AI
                    </CardTitle>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Specialized medical AI assistant
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-700 border-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
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
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
                        <div className="bg-zinc-100 dark:bg-zinc-800 border rounded-lg p-3">
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

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask your ${currentChatType?.title.toLowerCase()} question...`}
                    className="flex-1 min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Suggested Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentChatType?.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left justify-start h-auto py-2 px-3 whitespace-normal"
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Quick Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
                  <p><strong>Response Time:</strong> ~2-5 seconds</p>
                  <p><strong>Accuracy:</strong> Evidence-based</p>
                  <p><strong>Sources:</strong> Medical literature</p>
                  <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                    <strong>Disclaimer:</strong> AI responses are for informational purposes only. 
                    Always verify with medical literature and use clinical judgment.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}