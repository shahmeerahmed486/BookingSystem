'use client'

import { useState, useEffect } from 'react'
import { notificationService } from '@/lib/api/notification-service'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Bell } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Notification {
    id?: string;
    recipient: string;
    subject: string;
    message: string;
    timestamp?: string;
}

export function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true)
                const data = await notificationService.getAllNotifications()
                setNotifications(data)
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load notifications',
                    variant: 'destructive'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [toast])

    const filteredNotifications = notifications.filter(notification =>
        notification.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.recipient?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Search notifications..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    Loading notifications...
                                </TableCell>
                            </TableRow>
                        ) : filteredNotifications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    No notifications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredNotifications.map((notification, index) => (
                                <TableRow key={notification.id || index}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{notification.subject}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{notification.recipient}</TableCell>
                                    <TableCell>
                                        <div className="max-w-md truncate">
                                            {notification.message}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(notification.timestamp)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}