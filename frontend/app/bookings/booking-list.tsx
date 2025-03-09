'use client'
import { useState, useEffect } from 'react'
import { bookingService } from '@/lib/api/booking-service'
import { eventService } from '@/lib/api/event-service'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { bookingApi, userApi } from '@/lib/api/api-client';

export interface Booking {
    booking_id: string;
    user_id: string;
    event_id: string;
    tickets: number;
    status: string;
}

export const localBookingService = {
    getAllBookings: async (): Promise<Booking[]> => {
        try {
            const response = await bookingApi.get('/bookings');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    },
};

interface BookingWithDetails {
    booking_id: string;
    user_id: string;
    event_id: string;
    tickets: number;
    status: string;
    eventName?: string;
}

export function BookingList() {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([])
    const [events, setEvents] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch events first to get event names
                const eventsData = await eventService.getAllEvents();
                const eventsMap = eventsData.reduce((acc: Record<string, any>, event: any) => {
                    acc[event.event_id] = event;
                    return acc;
                }, {});
                setEvents(eventsMap);

                // Fetch bookings
                const bookingsData = await localBookingService.getAllBookings();

                // Enrich bookings with event names
                const enrichedBookings = bookingsData.map((booking: BookingWithDetails) => ({
                    ...booking,
                    eventName: eventsMap[booking.event_id]?.name || 'Unknown Event',
                }));

                setBookings(enrichedBookings);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to load bookings',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    const filteredBookings = bookings.filter(booking =>
        booking.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>
            case 'PENDING':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
            case 'CANCELLED':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Search bookings..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Tickets</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    Loading bookings...
                                </TableCell>
                            </TableRow>
                        ) : filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.booking_id}>
                                    <TableCell>{booking.booking_id}</TableCell>
                                    <TableCell>{booking.eventName}</TableCell>
                                    <TableCell>{booking.tickets}</TableCell>
                                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}