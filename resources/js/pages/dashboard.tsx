import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { uploadMultipleFiles } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    userRole: 'member' | 'user' | 'admin';
}

export default function Dashboard({ userRole }: Props) {
    const getDashboardContent = () => {
        switch (userRole) {
            case 'admin':
                return (
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-muted-foreground text-xs">Registered users</p>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({});

    const handleChange = (e) => {
        setPhotos(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        setLoading(true);
        await uploadMultipleFiles(photos, (index, value) => setProgress((prev) => ({ ...prev, [index]: value })));
        setLoading(false);
        alert('Upload complete!');
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening.</p>
                </div>

                {getDashboardContent()}
            </div>
            <div>
                <input type="file" multiple onChange={handleChange} />

                <div className="mt-4 grid grid-cols-5 gap-2">
                    {photos.map((photo, index) => (
                        <div key={index}>
                            <img src={URL.createObjectURL(photo)} className="h-24 w-24 rounded object-cover" />
                            <div className="text-center">{progress[index] || 0}%</div>
                        </div>
                    ))}
                </div>

                <button onClick={handleUpload} disabled={loading} className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">
                    {loading ? 'Uploading...' : 'Upload Photos'}
                </button>
            </div>
        </AppLayout>
    );
}
