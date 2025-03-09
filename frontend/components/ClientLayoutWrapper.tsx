"use client"; // Mark this as a client component

import { usePathname } from "next/navigation"; // Import usePathname
import MainLayout from "@/components/MainLayout"; // Import the MainLayout

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname(); // Get the current route

    // Define routes that should NOT use the MainLayout
    const noLayoutRoutes = ["/login", "/register", "/forgot-password"];

    // Check if the current route should use the MainLayout
    const useMainLayout = !noLayoutRoutes.includes(pathname);

    return useMainLayout ? (
        <MainLayout>{children}</MainLayout> // Wrap with MainLayout for authenticated pages
    ) : (
        children // Render children directly for non-authenticated pages (e.g., login)
    );
}