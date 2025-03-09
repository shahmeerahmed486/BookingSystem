"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function Header() {
    const { isAuthenticated, logout, loading } = useAuth()

    if (loading) {
        return (
            <header className="sticky top-0 z-10 border-b bg-background">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="text-xl font-bold">
                            Microservices Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="text-xl font-bold">
                        Microservices Dashboard
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {isAuthenticated ? (
                        <Button size="sm" onClick={logout}>
                            Logout
                        </Button>
                    ) : (
                        <Button size="sm" onClick={logout}>
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}