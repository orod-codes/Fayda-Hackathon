"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Stethoscope, 
  Pill, 
  FileText, 
  Search, 
  Zap,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  BarChart3,
  Microscope,
  Heart,
  Eye,
  Activity as ActivityIcon
} from 'lucide-react';

interface DoctorAIToolsProps {
  onBack: () => void;
}

export default function DoctorAITools({ onBack }: DoctorAIToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const aiTools = [
    {
      id: 'diagnosis-assistant',
      title: 'AI Diagnosis Assistant',
      description: 'Get AI-powered diagnostic suggestions based on symptoms',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      placeholder: 'Describe patient symptoms...',
      examples: [
        '45-year-old male with chest pain and shortness of breath',
        '32-year-old female with severe headache and nausea',
        'Patient with fever, cough, and fatigue for 3 days'
      ]
    },
    {
      id: 'drug-interaction',
      title: 'Drug Interaction Checker',
      description: 'Check for potential drug interactions and side effects',
      icon: Pill,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      placeholder: 'Enter medications (e.g., warfarin, amoxicillin)...',
      examples: [
        'Warfarin + Aspirin',
        'Metformin + Furosemide',
        'Lisinopril + Ibuprofen'
      ]
    },
    {
      id: 'treatment-planner',
      title: 'Treatment Plan Generator',
      description: 'Generate evidence-based treatment plans',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      placeholder: 'Enter diagnosis and patient details...',
      examples: [
        'Hypertension in 55-year-old male',
        'Type 2 diabetes with renal impairment',
        'Community-acquired pneumonia'
      ]
    },
    {
      id: 'lab-interpreter',
      title: 'Lab Results Interpreter',
      description: 'AI-powered lab result analysis and interpretation',
      icon: Microscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      placeholder: 'Enter lab results...',
      examples: [
        'CBC: WBC 12,000, Hgb 11.5, Platelets 250,000',
        'CMP: Na 140, K 3.8, Creatinine 1.2, Glucose 95',
        'Lipid Panel: Total Chol 220, HDL 45, LDL 140, Trig 150'
      ]
    },
    {
      id: 'risk-calculator',
      title: 'Risk Assessment Calculator',
      description: 'Calculate patient risk scores for various conditions',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      placeholder: 'Enter patient demographics and risk factors...',
      examples: [
        '65-year-old male, smoker, HTN, diabetes',
        '45-year-old female, family history of breast cancer',
        'Patient with chest pain, risk factors for CAD'
      ]
    },
    {
      id: 'medical-literature',
      title: 'Medical Literature Search',
      description: 'Search latest medical research and guidelines',
      icon: Search,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      placeholder: 'Search medical topics...',
      examples: [
        'Latest guidelines for hypertension management',
        'Recent studies on COVID-19 long-term effects',
        'Treatment options for resistant depression'
      ]
    }
  ];

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    setResults(null);
    setInputData('');
  };

  const handleAnalyze = async () => {
    if (!inputData.trim() || !activeTool) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/doctor/ai-tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolType: activeTool,
          inputData: inputData,
          language: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const data = await response.json();
      const tool = aiTools.find(t => t.id === activeTool);

      setResults({
        tool: tool?.title || 'AI Tool',
        analysis: data.message,
        isEmergency: data.isEmergency,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      
      // Fallback response
      const tool = aiTools.find(t => t.id === activeTool);
      setResults({
        tool: tool?.title || 'AI Tool',
        analysis: "I apologize, but I'm having trouble connecting to the AI analysis service. Please try again later or consult with a colleague for immediate assistance.",
        isEmergency: false,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInputData(example);
  };

  if (!activeTool) {
    // Tool Selection View
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Medical Tools
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced AI-powered tools to assist with diagnosis, treatment, and patient care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => (
              <Card
                key={tool.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 dark:hover:border-blue-600"
                onClick={() => handleToolSelect(tool.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                      {React.createElement(tool.icon, { className: `h-6 w-6 ${tool.color}` })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tool Interface View
  const selectedTool = aiTools.find(t => t.id === activeTool);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveTool(null)}
            className="mb-4 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Tools
          </Button>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-lg ${selectedTool?.bgColor}`}>
              {selectedTool?.icon && React.createElement(selectedTool.icon, { className: `h-6 w-6 ${selectedTool?.color}` })}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedTool?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedTool?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Input Data</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Enter the information for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={selectedTool?.placeholder}
                className="min-h-[200px] resize-none"
              />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Example Queries:
                </h4>
                <div className="space-y-2">
                  {selectedTool?.examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="w-full justify-start text-left h-auto p-2"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !inputData.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <ActivityIcon className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">AI Analysis Results</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {results ? `Last updated: ${results.timestamp}` : 'No analysis performed yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Analysis Complete
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {results.tool}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {results.analysis}
                    </pre>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Save to Records
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>Enter data and click "Analyze with AI" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 