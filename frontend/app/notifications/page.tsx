import { NotificationList } from "./notification-list"

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">Notifications are automatically sent when bookings are created</p>
            </div>
            <NotificationList />
        </div>
    )
}

