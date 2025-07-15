"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"

const mockEmail = "maxmustermann@hwr-berlin.de"
const mockPassword = "test123"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

/*   const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "E-Mail-Adresse ist erforderlich"
    }
    if (!emailRegex.test(email)) {
      return "Bitte geben Sie eine gültige E-Mail-Adresse ein"
    }
    return ""
  }

  const validatePassword = (password) => {
    if (!password) {
      return "Passwort ist erforderlich"
    }
    if (password.length < 6) {
      return "Passwort muss mindestens 6 Zeichen lang sein"
    }
    return ""
  } */

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    //setEmailError(validateEmail(value))
    setError("")
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    //setPasswordError(validatePassword(value))
    setError("")
  }

  const handleLogin = async (e) => {
    e?.preventDefault()
/* 
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    setEmailError(emailValidation)
    setPasswordError(passwordValidation)

    if (emailValidation || passwordValidation) {
      return
    } */

    setIsLoading(true)
    setError("")

/*     // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email === mockEmail && password === mockPassword) {
      toast.success("Anmeldung erfolgreich!", {
        description: "Willkommen bei HWR-Bank. Sie werden zum Dashboard weitergeleitet.",
      })
      router.push("/dashboard")
    } else {
      setError("E-Mail-Adresse oder Passwort ist falsch. Bitte versuchen Sie es erneut.")
      setIsLoading(false)
    } */
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
    
        if (res.ok) {
          toast.success("Anmeldung erfolgreich!", {
            description: "Willkommen bei HWR-Bank. Sie werden zum Dashboard weitergeleitet.",
          })
          router.push("/dashboard")
        } else {
          const data = await res.json()
          setError(data.error || "Unbekannter Fehler bei der Anmeldung")
        }
      } catch (err) {
        setError("Verbindungsfehler. Bitte versuchen Sie es erneut.")
      } finally {
        setIsLoading(false)
      }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-100 dark:from-slate-900 dark:via-red-950 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo-hwrr.svg" alt="HWR Berlin Logo" width={200} height={60} className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">HWR-Bank</h1>
          <p className="text-slate-600 dark:text-slate-400">Sicheres Online Banking</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">
              Anmelden
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Melden Sie sich mit Ihren HWR-Zugangsdaten an
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-Mail-Adresse
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="ihre.email@hwr-berlin.de"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 h-12 ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ihr Passwort"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 pr-10 h-12 ${passwordError ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Anmeldung läuft...
                  </>
                ) : (
                  "Anmelden"
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Help Links */}
            <div className="space-y-3 text-center">
              <Button variant="link" className="text-sm text-slate-600 dark:text-slate-400 p-0 h-auto">
                Passwort vergessen?
              </Button>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                <p>Probleme beim Anmelden?</p>
                <Button variant="link" className="text-xs p-0 h-auto text-red-600 dark:text-red-400">
                  Kontaktieren Sie den HWR-Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Sicherheitshinweis</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                Ihre Daten werden verschlüsselt übertragen. Geben Sie Ihre Zugangsdaten niemals an Dritte weiter.
                HWR-Bank wird Sie niemals per E-Mail nach Ihren Zugangsdaten fragen.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Demo-Zugangsdaten:</p>
            <p>E-Mail: {mockEmail}</p>
            <p>Passwort: {mockPassword}</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2025 HWR-Bank - Hochschule für Wirtschaft und Recht Berlin</p>
          <p className="mt-1">Alle Rechte vorbehalten</p>
        </footer>
      </div>
    </div>
  )
}
