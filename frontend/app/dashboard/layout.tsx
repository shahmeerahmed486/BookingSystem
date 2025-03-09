"use client" // Add this directive to mark the component as a client component

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login") // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router])

    // if (!isAuthenticated) {
    //     return null // Render nothing while redirecting
    // }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>
        </div>
    )
}