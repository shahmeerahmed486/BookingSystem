'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Users, Calendar, Bell, BookOpen } from 'lucide-react'
import { eventService } from '@/lib/api/event-service'
import { bookingService } from '@/lib/api/booking-service'
import { notificationService } from '@/lib/api/notification-service'

type StatItem = {
    title: string
    value: number
    description: string
    icon: React.ReactNode
    change: number
}

export function DashboardStats() {
    const [stats, setStats] = useState<StatItem[]>([
        {
            title: 'Total Users',
            value: 0,
            description: 'Active users in the system',
            icon: <Users className="h-5 w-5 text-blue-600" />,
            change: 0
        },
        {
            title: 'Events',
            value: 0,
            description: 'Upcoming events',
            icon: <Calendar className="h-5 w-5 text-green-600" />,
            change: 0
        },
        {
            title: 'Bookings',
            value: 0,
            description: 'Total bookings',
            icon: <BookOpen className="h-5 w-5 text-purple-600" />,
            change: 0
        },
        {
            title: 'Notifications',
            value: 0,
            description: 'Sent in last 7 days',
            icon: <Bell className="h-5 w-5 text-yellow-600" />,
            change: 0
        }
    ])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch events
                const events = await eventService.getAllEvents()

                // Fetch bookings
                const bookings = await bookingService.getAllBookings()

                // Fetch notifications
                const notifications = await notificationService.getAllNotifications()

                // Update stats
                setStats([
                    {
                        title: 'Total Users',
                        value: 2, // Hardcoded for now
                        description: 'Active users in the system',
                        icon: <Users className="h-5 w-5 text-blue-600" />,
                        change: 12
                    },
                    {
                        title: 'Events',
                        value: events.length,
                        description: 'Upcoming events',
                        icon: <Calendar className="h-5 w-5 text-green-600" />,
                        change: 8
                    },
                    {
                        title: 'Bookings',
                        value: bookings.length,
                        description: 'Total bookings',
                        icon: <BookOpen className="h-5 w-5 text-purple-600" />,
                        change: 24
                    },
                    {
                        title: 'Notifications',
                        value: notifications.length,
                        description: 'Sent in last 7 days',
                        icon: <Bell className="h-5 w-5 text-yellow-600" />,
                        change: 18
                    }
                ])
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                        <div className="mt-2 flex items-center text-xs">
                            <span className={stat.change > 0 ? 'text-green-500' : 'text-red-500'}>
                                {stat.change > 0 ? '+' : ''}{stat.change}%
                            </span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}