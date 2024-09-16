import MenuLink from "@/components/menu-link";
import { Settings, Users, Shield, Link, Bell, CreditCard, BarChart2, Lock, List, Archive } from 'lucide-react';


export default function SettingsLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    const { id } = params;
    const menuList = [
        { href: `/projects/${id}/settings/general`, label: 'General', icon: <Settings className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/team`, label: 'Team Members', icon: <Users className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/permissions`, label: 'Permissions', icon: <Shield className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/integrations`, label: 'Integrations', icon: <Link className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/notifications`, label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/analytics`, label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/sources`, label: 'Sources', icon: <List className="w-4 h-4" /> },
        { href: `/projects/${id}/settings/archive`, label: 'Archive Project', icon: <Archive className="w-4 h-4" /> },
    ];
    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen  p-4 border-r border-border">
                <nav>
                    <ul className="space-y-2">
                        {menuList.map((item) => (
                            <li key={item.href}>
                                <MenuLink href={item.href} label={item.label} icon={item.icon} />
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