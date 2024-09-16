"use client"

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import { LucideIcon, LucideProps } from "lucide-react";
import { usePathname } from "next/navigation";

interface SettingsMenuItemProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
}
export default function MenuLink({ icon: Icon, label, href, isActive = false }: SettingsMenuItemProps) {
    const pathname = usePathname();
    isActive = pathname.startsWith(href);
    return (
        <Link
            href={href}
            className={cn(buttonVariants({ variant: "link" }), {
                "text-primary font-semibold": isActive,
                "text-muted-foreground": !isActive,
            }, "gap-2")}
        >
            {Icon}
            {label}
        </Link>
    );
}