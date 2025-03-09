import { userApi } from "./api-client"
import { jwtDecode } from "jwt-decode"

export interface User {
    id?: string
    username: string
    email: string
    role?: string
    status?: string
    createdAt?: string
    avatar?: string
}

export interface UserCreate {
    username: string
    email: string
    password: string
}

export interface UserLogin {
    email: string
    password: string
}

export const userService = {
    register: async (userData: UserCreate) => {
        try {
            const response = await userApi.post("/register", userData)
            return response.data
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    },

    login: async (credentials: UserLogin) => {
        try {
            const response = await userApi.post("/login", credentials)
            return response.data
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    },

    getProfile: async (email: string) => {
        try {
            const response = await userApi.get(`/profile?email=${email}`)
            return response.data
        } catch (error) {
            console.error("Get profile error:", error)
            throw error
        }
    },

    getUserById: async (userId: string) => {
        try {
            const response = await userApi.get(`/users/${userId}`)
            return response.data
        } catch (error) {
            console.error(`Failed to get user with ID ${userId}:`, error)
            return null
        }
    },

    getCurrentUser: async () => {
        const token = localStorage.getItem("token")
        if (!token) return null

        try {
            const decoded = jwtDecode<{ sub: string }>(token)
            if (decoded.sub) {
                return await userService.getProfile(decoded.sub)
            }
            return null
        } catch (error) {
            console.error("Failed to decode token:", error)
            localStorage.removeItem("token")
            return null
        }
    },

    logout: () => {
        localStorage.removeItem("token")
    },

    getAllUsers: async () => {
        try {
            // Since your backend doesn't have this endpoint yet, we'll return mock data
            // In a real application, you would implement this endpoint in your backend
            return [
                {
                    id: "1",
                    username: "admin",
                    email: "admin@example.com",
                    role: "admin",
                    status: "active",
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "2",
                    username: "user1",
                    email: "user1@example.com",
                    role: "user",
                    status: "active",
                    createdAt: new Date().toISOString(),
                },
            ]
        } catch (error) {
            console.error("Failed to get all users:", error)
            return []
        }
    },
}

