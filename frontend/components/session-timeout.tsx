"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SessionTimeout() {
    const { isAuthenticated, logout } = useAuth()
    const [showWarning, setShowWarning] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(0)

    useEffect(() => {
        if (!isAuthenticated) return

        const checkSessionTimeout = () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                // Parse token to get expiration time
                const tokenData = JSON.parse(atob(token.split(".")[1]))
                const expiryTime = tokenData.exp * 1000 // Convert to milliseconds

                const now = new Date().getTime()
                const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000))

                setTimeRemaining(timeLeft)

                // Show warning when less than 5 minutes remaining
                if (timeLeft <= 300 && timeLeft > 0) {
                    setShowWarning(true)
                } else if (timeLeft <= 0) {
                    // Session expired
                    logout()
                }
            } catch (error) {
                console.error("Error checking token expiration:", error)
            }
        }

        // Check every 30 seconds
        const interval = setInterval(checkSessionTimeout, 30000)

        // Initial check
        checkSessionTimeout()

        return () => clearInterval(interval)
    }, [isAuthenticated, logout])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!showWarning) return null

    return (
        <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your session will expire in {formatTime(timeRemaining)}. Would you like to stay logged in or log out now?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={logout}>Logout Now</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setShowWarning(false)}>Stay Logged In</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}