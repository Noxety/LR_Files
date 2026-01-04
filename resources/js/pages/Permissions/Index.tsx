import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: {
        data: Permission[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function PermissionsIndex({ permissions }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Permissions',
            href: '/permissions',
        },
    ];

    const { data: createData, setData: setCreateData, post, processing: creating } = useForm({
        name: '',
    });

    const { data: updateData, setData: setUpdateData, put, processing: updating } = useForm({
        name: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                setCreateData({ name: '' });
                toast.success('Permission created successfully', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
            onError: () => {
                toast.error('Error creating permission', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPermission) return;

        put(route('permissions.update', editingPermission.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingPermission(null);
                setUpdateData({ name: '' });
                toast.success('Permission updated successfully', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
            onError: () => {
                toast.error('Error updating permission', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
        });
    };

    const handleDelete = (permissionId: number) => {
        if (confirm('Are you sure you want to delete this permission?')) {
            router.delete(route('permissions.destroy', permissionId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Permission deleted successfully', {
                        position: 'top-center',
                        duration: 3000,
                    });
                },
                onError: () => {
                    toast.error('Error deleting permission', {
                        position: 'top-center',
                        duration: 3000,
                    });
                },
            });
        }
    };

    const openEditDialog = (permission: Permission) => {
        setEditingPermission(permission);
        setUpdateData({
            name: permission.name,
        });
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Permissions Management" />

                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="my-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Permissions Management</h1>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Add Permission
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Permission</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Permission Name</Label>
                                        <Input
                                            id="name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Enter permission name (e.g., create-users)"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="glass"
                                            onClick={() => {
                                                setIsCreateOpen(false);
                                                setCreateData({ name: '' });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="glass-primary" disabled={creating}>
                                            {creating ? 'Creating...' : 'Create Permission'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                No permissions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        permissions.data.map((permission) => (
                                            <TableRow key={permission.id}>
                                                <TableCell>{permission.id}</TableCell>
                                                <TableCell className="font-medium">{permission.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="glass"
                                                            size="icon"
                                                            onClick={() => openEditDialog(permission)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="glass"
                                                            size="icon"
                                                            onClick={() => handleDelete(permission.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {editingPermission && (
                        <Dialog open={!!editingPermission} onOpenChange={(open) => !open && setEditingPermission(null)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Permission</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Permission Name</Label>
                                        <Input
                                            id="edit-name"
                                            value={updateData.name}
                                            onChange={(e) => setUpdateData('name', e.target.value)}
                                            placeholder="Enter permission name"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="glass"
                                            onClick={() => {
                                                setEditingPermission(null);
                                                setUpdateData({ name: '' });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="glass-primary" disabled={updating}>
                                            {updating ? 'Updating...' : 'Update Permission'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}

                    {permissions.links && permissions.links.length > 1 && (
                        <Pagination links={permissions.links} />
                    )}
                </div>
            </AppLayout>
        </>
    );
}

