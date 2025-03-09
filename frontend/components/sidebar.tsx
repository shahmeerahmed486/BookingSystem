"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, Calendar, BookOpen, Bell, Home, Settings, BarChart, LogOut } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"

const routes = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: <Home className="h-5 w-5" />,
    },
    {
        name: "Users",
        path: "/users",
        icon: <Users className="h-5 w-5" />,
    },
    {
        name: "Events",
        path: "/events",
        icon: <Calendar className="h-5 w-5" />,
    },
    {
        name: "Bookings",
        path: "/bookings",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        name: "Notifications",
        path: "/notifications",
        icon: <Bell className="h-5 w-5" />,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: <BarChart className="h-5 w-5" />,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: <Settings className="h-5 w-5" />,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
            <div className="flex h-full flex-col gap-2 p-4">
                <div className="flex flex-col gap-2">
                    {routes.map((route) => (
                        <Button
                            key={route.path}
                            variant="ghost"
                            className={cn(
                                "flex items-center justify-start gap-2 px-3",
                                pathname === route.path || pathname.startsWith(`${route.path}/`) ? "bg-muted font-medium" : "",
                            )}
                            asChild
                        >
                            <Link href={route.path}>
                                {route.icon}
                                {route.name}
                            </Link>
                        </Button>
                    ))}
                </div>

                {/* Logout button at the bottom with margin-top auto to push it to the bottom */}
                <div className="mt-auto">
                    <Separator className="my-4" />
                    <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-2 px-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    )
}