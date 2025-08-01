'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  const [faydaId, setFaydaId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFaydaLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handlePhoneVerification = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleOtpVerification = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        id: 'patient-1',
        name: 'Patient User',
        email: 'patient@example.com',
        role: 'patient',
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
                  Fayda ID Authentication Required
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Fayda ID (FIN)</Label>
                  <Input
                    value={faydaId}
                    onChange={(e) => setFaydaId(e.target.value)}
                    placeholder="Enter your Fayda ID"
                  />
                  <p className="text-xs mt-1 text-muted-foreground">
                    Only patients need Fayda ID authentication
                  </p>
                </div>
                <Button
                  onClick={handleFaydaLogin}
                  disabled={isLoading || !faydaId}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Verifying...' : 'Login with Fayda'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">or</div>

                <a href={loginUrl} className="w-full block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Sign In with Fayda</Button>
                </a>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  <p className="text-xs mt-1 text-muted-foreground">
                    We'll send an OTP to verify your number
                  </p>
                </div>
                <Button
                  onClick={handlePhoneVerification}
                  disabled={isLoading || !phoneNumber}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Enter OTP</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
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
                    Check your phone for the 6-digit code
                  </p>
                </div>
                <Button
                  onClick={handleOtpVerification}
                  disabled={isLoading || !otp}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-card/30 border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Login Steps</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={step >= 1 ? 'bg-blue-500' : 'bg-muted'}>1</Badge>
                <span className="text-sm text-muted-foreground">
                  Fayda ID Verification
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={step >= 2 ? 'bg-green-500' : 'bg-muted'}>2</Badge>
                <span className="text-sm text-muted-foreground">Phone Number</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={step >= 3 ? 'bg-purple-500' : 'bg-muted'}>3</Badge>
                <span className="text-sm text-muted-foreground">
                  OTP Verification
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
