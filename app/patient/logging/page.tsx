'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const dynamic = 'force-dynamic';

export default function Logging() {
  const { translations } = useLanguage();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleLogin = async () => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phoneNumber, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    const { user, accessToken } = await res.json();

    localStorage.setItem("patient_user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);

    router.push("/patient");
  } catch (err) {
    console.error("Login error:", err);
    setError("Something went wrong.");
  }
};

  const handleCreateAccount = () => {
    router.push("/patient/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher variant="compact" />
        </div>

        <Card className="w-full shadow-xl rounded-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-400">{translations.welcome}</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              {translations.completeRegistration}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-md text-sm border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-black dark:text-white">{translations.phoneNumber}</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 0901020304"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-black dark:text-white">{translations.password}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder={translations.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 transition-colors duration-200"
            >
              {translations.submit}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {translations.alreadyHaveAccount}
              </p>
              <Button
                onClick={handleCreateAccount}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors duration-200"
              >
                {translations.getStarted}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
