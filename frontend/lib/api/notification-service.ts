import { notificationApi } from "./api-client"

export interface Notification {
    id?: string
    recipient: string
    subject: string
    message: string
    timestamp?: string
}

export const notificationService = {
    getAllNotifications: async () => {
        try {
            const response = await notificationApi.get("/notifications/")
            return response.data.notifications || []
        } catch (error) {
            console.error("Failed to get all notifications:", error)
            // Return fallback data
            return []
        }
    },

    sendNotification: async (notification: Notification) => {
        const response = await notificationApi.post("/send-notification/", notification)
        return response.data
    },

    checkHealth: async () => {
        const response = await notificationApi.get("/health/")
        return response.data
    },
}

