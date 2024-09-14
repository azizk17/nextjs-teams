"use client"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, IdCard, Lock, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

const menuList = [
    {
        href: "/settings/profile",
        label: "Profile",
        icon: IdCard,
    },
    {
        href: "/settings/account",
        label: "Account",
        icon: Settings,
    },
    {
        href: "/settings/security",
        label: "Security",
        icon: Lock,
    },
    {
        href: "/settings/notifications",
        label: "Notifications",
        icon: Bell,
    },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen  p-4 border-r border-border">
                <nav>
                    <ul className="space-y-2">
                        {menuList.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className={cn(buttonVariants({ variant: "link" }), {
                                    "text-primary font-semibold": pathname === item.href,
                                    "text-muted-foreground": pathname !== item.href
                                })} >
                                    <item.icon className="w-4 h-4 me-2" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 ">
                {children}
            </main>
        </div>
    );
}