import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { SessionTimeout } from "@/components/session-timeout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Microservices Dashboard",
  description: "Frontend for microservices architecture",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <SessionTimeout />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}