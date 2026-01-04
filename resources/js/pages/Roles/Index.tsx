import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    roles: {
        data: Role[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    permissions: Permission[];
}

export default function RolesIndex({ roles, permissions }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: '/roles',
        },
    ];

    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: creating,
    } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const {
        data: updateData,
        setData: setUpdateData,
        put,
        processing: updating,
    } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                setCreateData({ name: '', permissions: [] });
                setSelectedPermissions([]);
                toast.success('Role created successfully', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
            onError: () => {
                toast.error('Error creating role', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;

        put(route('roles.update', editingRole.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingRole(null);
                setUpdateData({ name: '', permissions: [] });
                setSelectedPermissions([]);
                toast.success('Role updated successfully', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
            onError: () => {
                toast.error('Error updating role', {
                    position: 'top-center',
                    duration: 3000,
                });
            },
        });
    };

    const handleDelete = (roleId: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', roleId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Role deleted successfully', {
                        position: 'top-center',
                        duration: 3000,
                    });
                },
                onError: () => {
                    toast.error('Error deleting role', {
                        position: 'top-center',
                        duration: 3000,
                    });
                },
            });
        }
    };

    const openEditDialog = (role: Role) => {
        setEditingRole(role);
        setUpdateData({
            name: role.name,
            permissions: role.permissions.map((p) => p.id),
        });
        setSelectedPermissions(role.permissions.map((p) => p.id));
    };

    const togglePermission = (permissionId: number, isCreate: boolean = true) => {
        if (isCreate) {
            const newPermissions = createData.permissions.includes(permissionId)
                ? createData.permissions.filter((id) => id !== permissionId)
                : [...createData.permissions, permissionId];
            setCreateData('permissions', newPermissions);
            setSelectedPermissions(newPermissions);
        } else {
            const newPermissions = updateData.permissions.includes(permissionId)
                ? updateData.permissions.filter((id) => id !== permissionId)
                : [...updateData.permissions, permissionId];
            setUpdateData('permissions', newPermissions);
            setSelectedPermissions(newPermissions);
        }
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Roles Management" />

                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="my-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Roles Management</h1>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button  className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Add Role
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create New Role</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Role Name</Label>
                                        <Input
                                            id="name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Enter role name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Permissions</Label>
                                        <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-4">
                                            {permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`create-perm-${permission.id}`}
                                                        checked={createData.permissions.includes(permission.id)}
                                                        onCheckedChange={() => togglePermission(permission.id, true)}
                                                    />
                                                    <Label htmlFor={`create-perm-${permission.id}`} className="cursor-pointer text-sm font-normal">
                                                        {permission.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="glass"
                                            onClick={() => {
                                                setIsCreateOpen(false);
                                                setCreateData({ name: '', permissions: [] });
                                                setSelectedPermissions([]);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="glass-primary" disabled={creating}>
                                            {creating ? 'Creating...' : 'Create Role'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Roles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-muted-foreground text-center">
                                                No roles found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.data.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell>{role.id}</TableCell>
                                                <TableCell className="font-medium">{role.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions.length === 0 ? (
                                                            <span className="text-muted-foreground text-sm">No permissions</span>
                                                        ) : (
                                                            role.permissions.map((permission) => (
                                                                <Badge key={permission.id} variant="secondary">
                                                                    {permission.name}
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="glass" size="icon" onClick={() => openEditDialog(role)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="glass" size="icon" onClick={() => handleDelete(role.id)}>
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

                    {editingRole && (
                        <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
                            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Role</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Role Name</Label>
                                        <Input
                                            id="edit-name"
                                            value={updateData.name}
                                            onChange={(e) => setUpdateData('name', e.target.value)}
                                            placeholder="Enter role name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Permissions</Label>
                                        <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-4">
                                            {permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`edit-perm-${permission.id}`}
                                                        checked={updateData.permissions.includes(permission.id)}
                                                        onCheckedChange={() => togglePermission(permission.id, false)}
                                                    />
                                                    <Label htmlFor={`edit-perm-${permission.id}`} className="cursor-pointer text-sm font-normal">
                                                        {permission.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingRole(null);
                                                setUpdateData({ name: '', permissions: [] });
                                                setSelectedPermissions([]);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={updating}>
                                            {updating ? 'Updating...' : 'Update Role'}
                                        </Button>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="glass"
                                            onClick={() => {
                                                setEditingRole(null);
                                                setUpdateData({ name: '', permissions: [] });
                                                setSelectedPermissions([]);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="glass-primary" disabled={updating}>
                                            {updating ? 'Updating...' : 'Update Role'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}

                    {roles.links && roles.links.length > 1 && <Pagination links={roles.links} />}
                </div>
            </AppLayout>
        </>
    );
}
