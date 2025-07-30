"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, User, Shield, Building, MessageSquare, Stethoscope } from "lucide-react"
import Image from "next/image"

export default function AuthPage() {
  const { translations, language } = useLanguage()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [faydaId, setFaydaId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFaydaLogin = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 2000)
  }

  const handlePhoneVerification = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
    }, 2000)
  }

  const handleCompleteRegistration = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
          className="mb-6 text-zinc-400 hover:text-zinc-100"
            >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
            </Button>

        <Card className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
                <Image src="/images/hakmin-logo.png" alt="Hakmin Logo" width={24} height={24} />
            </div>
              <div>
                <CardTitle className="text-zinc-100 text-2xl">Patient Login</CardTitle>
                <CardDescription className="text-zinc-400">Fayda ID Authentication Required</CardDescription>
        </div>
            </div>
            </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-zinc-100">Fayda ID (FIN)</Label>
                    <Input
                    value={faydaId}
                    onChange={(e) => setFaydaId(e.target.value)}
                    placeholder="Enter your Fayda ID"
                    className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Only patients need Fayda ID authentication
                  </p>
                </div>
                <Button
                  onClick={handleFaydaLogin}
                  disabled={isLoading || !faydaId}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {isLoading ? "Verifying..." : "Login with Fayda"}
                </Button>
                  </div>
                )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-zinc-100">Phone Number</Label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+251 9XXXXXXXX"
                    className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>
                <Button
                  onClick={handlePhoneVerification}
                  disabled={isLoading || !phoneNumber}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-zinc-100">OTP Code</Label>
                    <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>
                <Button
                  onClick={handleCompleteRegistration}
                  disabled={isLoading || !otp}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {isLoading ? "Completing..." : "Complete Registration"}
                </Button>
              </div>
            )}
            </CardContent>
          </Card>

        {/* Info Section */}
        <div className="mt-6 text-center">
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
            <h3 className="text-zinc-100 font-semibold mb-2">For Other Roles</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Doctors, Hospital Admins, and Super Admins can access their dashboards directly.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              >
                <Building className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
