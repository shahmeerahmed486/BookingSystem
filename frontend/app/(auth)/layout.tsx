import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Microservices Dashboard",
    description: "Frontend for microservices architecture",
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 flex items-center justify-center bg-muted/40">
                <div className="w-full max-w-md p-6">{children}</div>
            </main>
        </div>
    )
}

