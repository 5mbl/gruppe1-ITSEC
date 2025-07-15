"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, ArrowDownLeft, Send, FileText, Plus, TrendingUp, Calendar, User, Bell, Settings, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation";


export default function Dashboard() {

const router = useRouter();
const [balance, setBalance] = useState(0);
const [transactions, setTransactions] = useState([]);




useEffect(() => {

    // ✅ Setz den userId Cookie
    if (!document.cookie.includes("userId=")) {
      document.cookie = "userId=2; path=/";
      console.log("Cookie gesetzt: userId=2");
    }
    console.log("GESETZE COOKIES:", document.cookie);


  const fetchBalanceAndTransactions = async () => {
    const balanceRes = await fetch("/api/balance");
    const balanceData = await balanceRes.json();
    setBalance(parseFloat(balanceData.balance));
    console.log("Balance:", balanceData.balance);

    const txRes = await fetch("/api/transactions");
    const txData = await txRes.json();
    setTransactions(txData);

    console.log("Fetched transactions:", txData);
  };
  fetchBalanceAndTransactions();
}, []);


  const [user] = useState({
    name: "Max Mustermann",
    balance: balance,
    currency: "EUR",
    accountNumber: "DE89 3704 0044 0532 0130 00",
    
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: user.currency,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    {/* Header/Navigation */}
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Bank Name */}
          <div className="flex items-center gap-4">
            <Image src="/logo-hwrr.svg" alt="HWR Berlin Logo" width={120} height={40} className="h-10 w-auto" />
            <div className="hidden sm:block">

            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 mt-10">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
              <AvatarImage src="/pfp.jpg" alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Willkommen, {user.name} 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Ihr HWR-Bank Online Banking</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Konto: {user.accountNumber}</p>
            </div>
          </div>
        </div>

        {/* Balance and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-red-600 to-red-700 border-0 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-100 text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Aktueller Kontostand
                </CardTitle>
                <div className="text-right">
                  <p className="text-red-100 text-sm">HWR-Bank</p>
                  <p className="text-red-200 text-xs">Hauptkonto</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl md:text-5xl font-bold mb-2">{formatCurrency(balance)}</div>
              <p className="text-red-100 text-sm">
                Letztes Update: {formatDate(new Date().toISOString().split("T")[0])}
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Schnellaktionen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
                size="lg"
                onClick={() => router.push("/transfer")}
              >
                <Send className="w-4 h-4 mr-2" />
                Geld überweisen
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-all duration-200"
                size="lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Kontoauszüge
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2 text-xl">
                <Calendar className="w-5 h-5" />
                Letzte Transaktionen
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                HWR-Bank Konto
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
            {transactions.map((transaction, index) => (
  <div key={transaction.id}>
    <div className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${
            transaction.amount > 0
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          {transaction.amount > 0 ? (
            <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{transaction.recipient}</p>
            <Badge
              variant={transaction.amount > 0 ? "default" : "secondary"}
              className={`text-xs ${
                transaction.amount > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {transaction.amount > 0 ? "Eingang" : "Ausgang"}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.description}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {formatDate(transaction.created_at)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-lg font-bold ${
            transaction.amount > 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {transaction.amount > 0 ? "+" : ""}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
    {index < transactions.length - 1 && <Separator className="mx-6" />}
  </div>
))}

            </div>

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-lg">Keine Transaktionen vorhanden</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm">
                  Ihre HWR-Bank Transaktionen werden hier angezeigt
                </p>
              </div>
            )}

            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" className="w-full">
                Alle Transaktionen anzeigen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2025 HWR-Bank - Hochschule für Wirtschaft und Recht Berlin</p>
          <p className="mt-1">Sicheres Online Banking für Studierende und Mitarbeiter</p>
        </footer>
      </div>
    </div>
    </div>
  )
}
