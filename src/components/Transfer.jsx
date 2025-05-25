"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Send,
  Shield,
  AlertCircle,
  CheckCircle,
  Euro,
  User,
  Clock,
  Loader2,
  CreditCard,
  Building,
} from "lucide-react"
import Image from "next/image"

export default function TransferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawNote = searchParams.get("note") || ""
  const [formData, setFormData] = useState({
    recipient: "",
    iban: "",
    amount: "",
    purpose: "",
    reference: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const userBalance = 10420.0
  const dailyLimit = 5000.0
  const usedToday = 1200.0

  const recentRecipients = [
    { id: "1", name: "John Doe", iban: "DE89 3704 0044 0532 0130 01" },
    { id: "2", name: "Alice Smith", iban: "DE89 3704 0044 0532 0130 02" },
    { id: "3", name: "HWR Cafeteria", iban: "DE89 3704 0044 0532 0130 03" },
  ]

  const validateIBAN = (iban) => {
    const ibanRegex = /^DE\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/
    return ibanRegex.test(iban.replace(/\s/g, ""))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatIBAN = (iban) => {
    const cleaned = iban.replace(/\s/g, "")
    return cleaned.replace(/(.{4})/g, "$1 ").trim()
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.recipient.trim()) {
      newErrors.recipient = "Empfängername ist erforderlich"
    }

    if (!formData.iban.trim()) {
      newErrors.iban = "IBAN ist erforderlich"
    } else if (!validateIBAN(formData.iban)) {
      newErrors.iban = "Bitte geben Sie eine gültige deutsche IBAN ein"
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Betrag ist erforderlich"
    } else {
      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Bitte geben Sie einen gültigen Betrag ein"
      } else if (amount > userBalance) {
        newErrors.amount = "Unzureichender Kontostand"
      } else if (amount > dailyLimit - usedToday) {
        newErrors.amount = `Tageslimit überschritten (verfügbar: ${formatCurrency(dailyLimit - usedToday)})`
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Verwendungszweck ist erforderlich"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleIBANChange = (value) => {
    const formatted = formatIBAN(value)
    handleInputChange("iban", formatted)
  }

  const selectRecipient = (recipient) => {
    setFormData((prev) => ({
      ...prev,
      recipient: recipient.name,
      iban: recipient.iban,
    }))
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  const confirmTransfer = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setShowConfirmation(false)
    setIsLoading(false)

    toast.success("Überweisung erfolgreich!", {
      description: `${formatCurrency(Number.parseFloat(formData.amount || "0"))} wurde an ${formData.recipient} überwiesen.`,
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Image src="/logo-hwrr.svg" alt="HWR Berlin Logo" width={80} height={30} className="h-8 w-auto" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Geld überweisen</h1>
              <p className="text-slate-600 dark:text-slate-400">HWR-Bank Überweisung</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transfer Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Verfügbarer Saldo</p>
                    <p className="text-2xl font-bold">{formatCurrency(userBalance)}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-200" />
                </div>
              </CardContent>
            </Card>

            {/* Transfer Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Überweisungsdetails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipient */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Empfänger</Label>
                    <Input
                      id="recipient"
                      placeholder="Name des Empfängers"
                      value={formData.recipient}
                      onChange={(e) => handleInputChange("recipient", e.target.value)}
                      className={errors.recipient ? "border-red-500" : ""}
                    />
                    {errors.recipient && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.recipient}
                      </p>
                    )}
                  </div>

                  {/* IBAN */}
                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="iban"
                        placeholder="DE89 3704 0044 0532 0130 00"
                        value={formData.iban}
                        onChange={(e) => handleIBANChange(e.target.value)}
                        className={`pl-10 ${errors.iban ? "border-red-500" : ""}`}
                        maxLength={27}
                      />
                    </div>
                    {errors.iban && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.iban}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Betrag</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0,00"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  {/* Purpose */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Verwendungszweck</Label>
                    <Select onValueChange={(value) => handleInputChange("purpose", value)}>
                      <SelectTrigger className={errors.purpose ? "border-red-500" : ""}>
                        <SelectValue placeholder="Verwendungszweck auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private Überweisung</SelectItem>
                        <SelectItem value="rent">Miete</SelectItem>
                        <SelectItem value="utilities">Nebenkosten</SelectItem>
                        <SelectItem value="groceries">Lebensmittel</SelectItem>
                        <SelectItem value="education">Bildung/Studium</SelectItem>
                        <SelectItem value="other">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.purpose && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  {/* Reference */}
                  <div className="space-y-2">
                    <Label htmlFor="reference">Referenz (optional)</Label>
                    <Textarea
                      id="reference"
                      placeholder="Zusätzliche Informationen..."
                      value={formData.reference}
                      onChange={(e) => handleInputChange("reference", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Überweisung prüfen
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Letzte Empfänger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    onClick={() => selectRecipient(recipient)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={recipient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{recipient.name}</p>
                      <p className="text-xs text-slate-500 truncate">{recipient.iban}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Transfer Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Tageslimits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Heute verwendet</span>
                    <span>{formatCurrency(usedToday)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(usedToday / dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Verfügbar: {formatCurrency(dailyLimit - usedToday)}</span>
                    <span>Limit: {formatCurrency(dailyLimit)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Alle Überweisungen werden verschlüsselt übertragen und sind durch modernste Sicherheitstechnologie
                geschützt.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Überweisung bestätigen
              </DialogTitle>
              <DialogDescription>Bitte überprüfen Sie die Details Ihrer Überweisung.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Empfänger:</span>
                  <span className="font-medium">{formData.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">IBAN:</span>
                  <span className="font-mono text-sm">{formData.iban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Betrag:</span>
                  <span className="font-bold text-lg">{formatCurrency(Number.parseFloat(formData.amount || "0"))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Verwendungszweck:</span>
                  <span className="font-medium">{formData.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Notiz:</span>
                  <span dangerouslySetInnerHTML={{ __html: rawNote }} />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isLoading}>
                Abbrechen
              </Button>
              <Button onClick={confirmTransfer} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird übertragen...
                  </>
                ) : (
                  "Jetzt überweisen"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
