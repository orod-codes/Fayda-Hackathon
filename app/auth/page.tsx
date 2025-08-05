"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  User,
  Shield,
  Building,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const { translations, language } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [faydaId, setFaydaId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFaydaLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handlePhoneVerification = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  const handleCompleteRegistration = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  const loginUrl = useMemo(() => {
    console.log({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    });
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: "code",
      scope: "openid profile email",
      acr_values: "mosip:idp:acr:generated-code",
      code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
      code_challenge_method: "S256",
      display: "page",
      nonce: "g4DEuje5Fx57Vb64dO4oqLHXGT8L8G7g",
      state: "ptOO76SD",
      ui_locales: "en",
    });

    return `https://esignet.ida.fayda.et/authorize?${params.toString()}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
                <Image
                  src="/images/hakmin-logo.png"
                  alt="Hakmin Logo"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <CardTitle className="text-black dark:text-white text-2xl">
                  Patient Login
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Fayda ID Authentication Required
                </CardDescription>
                <a href={loginUrl}>
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-colors duration-200">
                    Sign In
                  </Button>
                </a>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Info Section */}
        <div className="mt-6 text-center">
          <div className="bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-black dark:text-white font-semibold mb-2">
              For Other Roles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Doctors, Hospital Admins, and Super Admins can access their
              dashboards directly.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Building className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
