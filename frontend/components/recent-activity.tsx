"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, BookOpen, Bell } from "lucide-react"

type ActivityType = "user" | "event" | "booking" | "notification"

type Activity = {
    id: string
    type: ActivityType
    description: string
    timestamp: string
    user: {
        name: string
        avatar?: string
    }
}

export function RecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate fetching recent activities
        const fetchActivities = async () => {
            try {
                setLoading(true)
                // In a real app, this would be an API call
                // const data = await fetch('/api/activities').then(res => res.json())

                // Simulated data
                setTimeout(() => {
                    setActivities([
                        {
                            id: "1",
                            type: "user",
                            description: "New user registered",
                            timestamp: "2023-06-15T10:30:00Z",
                            user: { name: "John Doe" },
                        },
                        {
                            id: "2",
                            type: "event",
                            description: 'Created new event "Product Launch"',
                            timestamp: "2023-06-15T09:45:00Z",
                            user: { name: "Sarah Johnson" },
                        },
                        {
                            id: "3",
                            type: "booking",
                            description: 'Booked 3 tickets for "Tech Conference"',
                            timestamp: "2023-06-15T08:20:00Z",
                            user: { name: "Michael Brown" },
                        },
                        {
                            id: "4",
                            type: "notification",
                            description: "Sent reminder to 150 attendees",
                            timestamp: "2023-06-15T07:15:00Z",
                            user: { name: "Emily Wilson" },
                        },
                        {
                            id: "5",
                            type: "user",
                            description: "Updated profile information",
                            timestamp: "2023-06-14T16:30:00Z",
                            user: { name: "David Lee" },
                        },
                    ])
                    setLoading(false)
                }, 1000)
            } catch (error) {
                console.error("Failed to fetch activities:", error)
                setLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case "user":
                return <User className="h-4 w-4 text-blue-500" />
            case "event":
                return <Calendar className="h-4 w-4 text-green-500" />
            case "booking":
                return <BookOpen className="h-4 w-4 text-purple-500" />
            case "notification":
                return <Bell className="h-4 w-4 text-yellow-500" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    if (loading) {
        return <div className="flex justify-center py-4">Loading recent activities...</div>
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            {getActivityIcon(activity.type)}
                            <span className="text-sm font-medium">{activity.user.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

