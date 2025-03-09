import { UserList } from './user-list'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Users</h1>
                <Button asChild>
                    <Link href="/users/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Link>
                </Button>
            </div>
            <UserList />
        </div>
    )
}