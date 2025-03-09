"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import Link from "next/link"
import { userService } from "@/lib/api/user-service"

type User = {
    id: string
    name: string
    email: string
    role: string
    status: "active" | "inactive"
    createdAt: string
    avatar?: string
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Inside the useEffect hook
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // This is a simplified example - you might need to implement an admin API to get all users
                const data = await userService.getAllUsers(); // You'll need to add this method to userService
                const formattedData = data.map((user: any) => ({
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    role: user.role || "user", // default role if not provided
                    status: user.status || "inactive", // default status if not provided
                    createdAt: user.createdAt || new Date().toISOString(), // default createdAt if not provided
                    avatar: user.avatar || "", // default avatar if not provided
                }));
                setUsers(formattedData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const handleDeleteUser = async (userId: string) => {
        // In a real app, this would be an API call
        // await fetch(`/api/users/${userId}`, { method: 'DELETE' })

        // Optimistic update
        setUsers(users.filter((user) => user.id !== userId))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Search users..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <div
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {user.status === "active" ? "Active" : "Inactive"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/users/${user.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

