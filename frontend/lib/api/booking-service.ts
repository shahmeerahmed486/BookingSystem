import { bookingApi } from "./api-client"
import { notificationService } from "./notification-service"
import { userService } from "./user-service"

export interface Booking {
    booking_id: string
    user_id: string
    event_id: string
    tickets: number
    status?: string
}

export const bookingService = {
    createBooking: async (bookingData: Partial<Booking>) => {
        try {
            // Ensure all required fields are present and correctly typed
            const payload = {
                user_id: String(bookingData.user_id), // Ensure user_id is a string
                event_id: String(bookingData.event_id), // Ensure event_id is a string
                tickets: Number(bookingData.tickets), // Ensure tickets is a number
                status: bookingData.status ?? "PENDING", // Default to "PENDING" if not provided
            };

            console.log("🚀 Sending booking request:", JSON.stringify(payload, null, 2));

            const response = await bookingApi.post("/bookings/", payload);

            // Fetch user info for notification
            const user = await userService.getUserById(payload.user_id!).catch(() => null);

            if (user?.email) {
                await notificationService.sendNotification({
                    recipient: user.email,
                    subject: "Booking Confirmation",
                    message: `Your booking for ${payload.tickets} ticket(s) has been confirmed.`,
                }).catch((err) => console.error("Failed to send notification:", err));
            }

            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error("Error response:", {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                });
            }
            console.error("❌ Failed to create booking:", error);
            throw error;
        }
    },
    getAllBookings: async () => {
        // implementation to fetch all bookings
        return []; // replace with actual fetch logic
    }
};