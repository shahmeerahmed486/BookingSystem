"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { userService, type User } from "@/lib/api/user-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type AuthContextType = {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    // Setup event listeners for window/tab close
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // User returned to the tab - verify the token is still valid
                checkAuth()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    // Check if user is already logged in
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("token")
            if (token) {
                // Check if token is expired
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        // Token expired, clear it
                        localStorage.removeItem("token")
                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                        setUser(null)
                        setIsAuthenticated(false)
                        return
                    }
                } catch (e) {
                    console.error("Error parsing token:", e)
                }

                const userData = await userService.getCurrentUser()
                if (userData) {
                    setUser(userData)
                    setIsAuthenticated(true)
                } else {
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } else {
                setUser(null)
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error("Authentication error:", error)
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            const response = await userService.login({ email, password })

            // Store token in localStorage and cookies for SSR
            localStorage.setItem("token", response.access_token)
            document.cookie = `token=${response.access_token}; path=/; max-age=86400; SameSite=Lax`

            // Store email for session renewal (but not password)
            localStorage.setItem("userEmail", email)

            const userData = await userService.getCurrentUser()
            setUser(userData)
            setIsAuthenticated(true)

            toast({
                title: "Logged in successfully",
                description: `Welcome back, ${userData?.username || 'User'}!`,
            })

            return userData
        } catch (error) {
            console.error("Login error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const register = async (username: string, email: string, password: string) => {
        try {
            setLoading(true)
            await userService.register({ username, email, password })

            toast({
                title: "Registration successful",
                description: "Your account has been created. You can now log in.",
            })

            // Automatically log in after registration
            return await login(email, password)
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        userService.logout()
        setUser(null)
        setIsAuthenticated(false)

        // Clear all session data
        localStorage.removeItem("token")
        localStorage.removeItem("userEmail")
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

        // Redirect to login page
        router.push("/login")

        toast({
            title: "Logged out",
            description: "You have been successfully logged out",
        })
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            loading,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}