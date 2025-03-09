import { eventApi } from './api-client';

export interface Event {
    event_id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    available_tickets: number;
}

export const eventService = {
    getAllEvents: async () => {
        const response = await eventApi.get('/events/');
        return response.data;
    },

    createEvent: async (eventData: Event) => {
        const response = await eventApi.post('/events/', eventData);
        return response.data;
    },

    getEventAvailability: async (eventId: string) => {
        const response = await eventApi.get(`/events/${eventId}/availability`);
        return response.data;
    },

    updateEventTickets: async (eventId: string, ticketsBooked: number) => {
        const response = await eventApi.put(`/events/${eventId}/update-tickets/?tickets_booked=${ticketsBooked}`);
        return response.data;
    }
};