'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Eye, EyeOff, Phone, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function PatientLoginPage() {
  const { translations, language } = useLanguage();
  const { theme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 2 - Additional features
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const loginUrl = useMemo(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid profile email',
      acr_values: 'mosip:idp:acr:generated-code',
      code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
      code_challenge_method: 'S256',
      display: 'page',
      nonce: 'g4DEuje5Fx57Vb64dO4oqLHXGT8L8G7g',
      state: 'ptOO76SD',
      ui_locales: 'en',
    });

    return `https://esignet.ida.fayda.et/authorize?${params.toString()}`;
  }, []);

  const handlePhoneVerification = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handlePasswordCreation = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  const handleFaydaSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        id: 'patient-1',
        name: fullName || 'Patient User',
        email: email || 'patient@example.com',
        phone: phoneNumber,
        role: 'patient',
        preferences: {
          twoFactor,
          notifications
        }
      });
      router.push('/patient');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={24} height={24} />
              </div>
              <div>
                <CardTitle className="text-2xl">Patient Login</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Complete your registration and authentication
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Welcome to Hakim AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Let's get you started with your health journey
                  </p>
                </div>
                <Button
                  onClick={handlePhoneVerification}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Starting...' : 'Get Started'}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="pl-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handlePasswordCreation}
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Sign In with Fayda</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your authentication with Fayda ID to access your health data
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-semibold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">Claims Verification</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Make sure all your claims are verified and up to date. This ensures accurate health data retrieval and proper service delivery.
                      </p>
                    </div>
                  </div>
                </div>

                

                <div className="w-full">
                  <Image 
                    src="/images/make.png" 
                    alt="Claims Verification" 
                    width={400} 
                    height={300}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <a href={loginUrl} className="w-full block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isLoading ? 'Connecting to Fayda...' : 'VerificationIn with Fayda'}
                  </Button>
                </a>

              
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-card/30 border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Registration Steps</h3>
            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                  <Badge className={step >= 1 ? 'bg-blue-500' : 'bg-muted'}>1</Badge>
                  <span className="text-sm text-muted-foreground">
                    Welcome & Get Started
                  </span>
                </div>
                              <div className="flex items-center space-x-2">
                  <Badge className={step >= 2 ? 'bg-blue-500' : 'bg-muted'}>2</Badge>
                  <span className="text-sm text-muted-foreground">Create password</span>
                </div>
              <div className="flex items-center space-x-2">
                <Badge className={step >= 3 ? 'bg-blue-500' : 'bg-muted'}>3</Badge>
                <span className="text-sm text-muted-foreground">
                  Sign In with Fayda
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
