import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, GraduationCap, Briefcase, MessageSquare, Shield, Key } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Chat Room',
            href: '/rooms/1',
            icon: MessageSquare,
          },
    ];


    // Add PMS navigation items
    // const pmsNavItems: NavItem[] = [
    //     {
    //         title: 'Projects',
    //         href: '/projects',
    //         icon: Briefcase,
    //     },
    //     {
    //         title: 'Tasks',
    //         href: '/tasks',
    //         icon: Folder,
    //     },
    // ];

    // Add admin navigation items
    const adminNavItems: NavItem[] = [
        {
            title: 'Users',
            href: '/users',
            icon: Users,
        },
        {
            title: 'Roles',
            href: '/roles',
            icon: Shield,
        },
        {
            title: 'Permissions',
            href: '/permissions',
            icon: Key,
        },
    ];

    const footerNavItems: NavItem[] = [
        
    ];

    const navGroups: NavGroup[] = [];

    // All users can access PMS features
    // navGroups.push({
    //     title: 'Project Management',
    //     items: pmsNavItems,
    // });

    // Only admins can access admin features
    if (user.role === 'admin') {
        navGroups.push({
            title: 'Administration',
            items: adminNavItems,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
