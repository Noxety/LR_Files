import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
interface User {
    id: number;
    name: string;
    email: string;
}
interface Props {
    users: any;
    userRole: 'learner' | 'teacher' | 'admin';
}
export default function OfflinePage() {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
    ];

    return (
        <>
            <Head title="User Managements" />
            Hello, Users!
        </>
    );
}
