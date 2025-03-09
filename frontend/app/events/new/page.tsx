'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { eventService } from '@/lib/api/event-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { v4 as uuidv4 } from 'uuid'

export default function CreateEventPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        event_id: uuidv4(),
        name: '',
        description: '',
        date: '',
        location: '',
        available_tickets: 100
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'available_tickets' ? parseInt(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            await eventService.createEvent(formData)
            toast({
                title: 'Success',
                description: 'Event created successfully',
            })
            router.push('/events')
        } catch (error) {
            console.error('Failed to create event:', error)
            toast({
                title: 'Error',
                description: 'Failed to create event',
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
                    <CardTitle>Create New Event</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name">Event Name</label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description">Description</label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="date">Date</label>
                            <Input
                                id="date"
                                name="date"
                                type="datetime-local"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="location">Location</label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="available_tickets">Available Tickets</label>
                            <Input
                                id="available_tickets"
                                name="available_tickets"
                                type="number"
                                min="1"
                                value={formData.available_tickets}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}