'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Eye, EyeOff, Phone, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const dynamic = 'force-dynamic';

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
      ui_locales: language,
    });

    return `https://esignet.ida.fayda.et/authorize?${params.toString()}`;
  }, [language]);

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

    localStorage.setItem('temp_password', password);

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
          notifications,
        },
      });
      router.push('/patient');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher variant="compact" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push('/')} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {translations.back}
          </Button>
          <ThemeToggle />
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={24} height={24} />
              </div>
              <div>
                <CardTitle className="text-2xl text-black dark:text-white">{translations.patientLogin}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {translations.completeRegistration}
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
                  <h3 className="text-lg font-semibold text-black dark:text-white">{translations.welcome}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.healthAssistant}
                  </p>
                </div>
                <Button
                  onClick={handlePhoneVerification}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
                >
                  {isLoading ? translations.starting : translations.getStarted}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-black dark:text-white">{translations.createPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={translations.createStrongPassword}
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {translations.passwordRequirements}
                  </p>
                </div>

                <div>
                  <Label className="text-black dark:text-white">{translations.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={translations.confirmYourPassword}
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handlePasswordCreation}
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
                >
                  {isLoading ? translations.creatingAccount : translations.createPassword}
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">{translations.signInWithFayda}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.completeAuthentication}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-semibold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">{translations.claimsVerification}</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {translations.claimsVerificationDesc}
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200">
                    {isLoading ? translations.connectingToFayda : translations.verificationWithFayda}
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-semibold mb-2 text-black dark:text-white">{translations.registrationSteps}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={step >= 1 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}>1</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">{translations.welcomeGetStarted}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={step >= 2 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}>2</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">{translations.createPasswordStep}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={step >= 3 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}>3</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">{translations.signInFaydaStep}</span>
              </div>
            </div>
          </div>

          {/* ✅ Moved this inside the same layout block */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {translations.alreadyHaveAccount}{' '}
              <button
                onClick={() => router.push('/patient/logging')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                {translations.logInHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
