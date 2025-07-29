"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setError(`Authentication failed: ${error}`)
          return
        }

        if (!code || !state) {
          setStatus('error')
          setError('Missing authorization code or state parameter')
          return
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('http://localhost:3001/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            authorization_code: code,
            state: state
          })
        })

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
          setStatus('error')
          setError(tokenData.error || 'Token exchange failed')
          return
        }

        if (tokenData.success) {
          setStatus('success')
          setTimeout(() => {
            router.push('/patient')
          }, 2000)
        } else {
          setStatus('error')
          setError('Authentication failed')
        }
      } catch (err) {
        console.error('Callback error:', err)
        setStatus('error')
        setError('An unexpected error occurred')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 p-4">
      <Card className="w-full max-w-md bg-zinc-800/50 backdrop-blur-sm border-zinc-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-zinc-100">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {status === 'loading' && 'Please wait while we verify your Fayda credentials.'}
            {status === 'success' && 'Redirecting you to your dashboard...'}
            {status === 'error' && 'There was an issue with your authentication.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-zinc-300">Welcome to Hakim AI!</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-zinc-300 text-sm">{error}</p>
              <Button 
                onClick={() => router.push('/')} 
                className="bg-blue-500 hover:bg-blue-600"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
