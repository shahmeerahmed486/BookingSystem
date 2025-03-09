import { BookingList } from "./booking-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <Button asChild>
                    <Link href="/bookings/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Booking
                    </Link>
                </Button>
            </div>
            <BookingList />
        </div>
    )
}

