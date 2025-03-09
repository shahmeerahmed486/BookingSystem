'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { bookingService } from '@/lib/api/booking-service'
import { eventService, Event } from '@/lib/api/event-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth-context'
import { v4 as uuidv4 } from 'uuid'

export default function CreateBookingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState<Event[]>([])
    const [formData, setFormData] = useState({
        booking_id: uuidv4(),
        user_id: '1', // Default user ID, will be updated when user is loaded
        event_id: eventId || '',
        tickets: 1
    })

    useEffect(() => {
        // Set user_id from authenticated user
        if (user?.id) {
            setFormData(prev => ({
                ...prev,
                user_id: user.id || ''
            }))
        }

        // Fetch available events
        const fetchEvents = async () => {
            try {
                const data = await eventService.getAllEvents()
                setEvents(data)
            } catch (error) {
                console.error('Failed to fetch events:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load events',
                    variant: 'destructive'
                })
            }
        }

        fetchEvents()
    }, [user, toast, eventId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'tickets' ? parseInt(value) : value
        }))
    }

    const handleSelectEvent = (value: string) => {
        setFormData(prev => ({
            ...prev,
            event_id: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.event_id) {
            toast({
                title: 'Error',
                description: 'Please select an event',
                variant: 'destructive'
            })
            return
        }

        try {
            setLoading(true)
            await bookingService.createBooking(formData)
            toast({
                title: 'Success',
                description: 'Booking created successfully',
            })
            router.push('/bookings')
        } catch (error) {
            console.error('Failed to create booking:', error)
            toast({
                title: 'Error',
                description: 'Failed to create booking',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Booking</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="event_id">Event</label>
                            <Select onValueChange={handleSelectEvent} value={formData.event_id} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent>
                                    {events.map(event => (
                                        <SelectItem key={event.event_id} value={event.event_id}>
                                            {event.name} - {event.available_tickets} tickets available
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="tickets">Number of Tickets</label>
                            <Input
                                id="tickets"
                                name="tickets"
                                type="number"
                                min="1"
                                value={formData.tickets}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Booking'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}