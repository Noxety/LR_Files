import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { capitalizeFirst } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import OfflinePage from '../OfflinePage';
interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    users: any;
    userRole: 'learner' | 'teacher' | 'admin';
}
export default function UsersIndex({ users, userRole }: Props) {
    console.log(users);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
    ];
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        window.addEventListener('online', () => setOnline(true));
        window.addEventListener('offline', () => setOnline(false));
    }, []);

    if (!online) {
        return <OfflinePage />;
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="User Managements" />

                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="my-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <Link href={route('users.create')}>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add User
                            </Button>
                        </Link>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>

                                        <TableHead className="text-right">Active</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{capitalizeFirst(user.role)}</TableCell>
                                            <TableCell className="text-right">
                                                <Switch
                                                    checked={user.active == 'active'}
                                                    onCheckedChange={(checked) => {
                                                        router.put(
                                                            route('users.update', user.id),
                                                            { active: checked ? 'active' : 'inactive' },
                                                            {
                                                                preserveScroll: true,
                                                                onSuccess: () => {
                                                                    toast.success(`User status changed to ${checked ? 'Active' : 'Inactive'}`, {
                                                                        position: 'top-center',
                                                                        duration: 3000,
                                                                    });
                                                                },
                                                                onError: () => {
                                                                    toast.error('Error!', {
                                                                        position: 'top-center',
                                                                        duration: 3000,
                                                                    });
                                                                },
                                                            },
                                                        );
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {users.links && users.links.length > 1 && <Pagination links={users.links} />}
                </div>
            </AppLayout>
        </>
    );
}
