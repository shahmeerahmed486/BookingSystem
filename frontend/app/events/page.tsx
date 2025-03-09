import { EventList } from './event-list'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function EventsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Events</h1>
                <Button asChild>
                    <Link href="/events/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                    </Link>
                </Button>
            </div>
            <EventList />
        </div>
    )
}