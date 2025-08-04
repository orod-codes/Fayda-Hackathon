"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Logging() {
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


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0901020304"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            Log In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
