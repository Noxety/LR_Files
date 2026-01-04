import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export function Pagination({ links }: PaginationProps) {
    if (!links || links.length <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {links.map((link, index) => {
                if (index === 0) {
                    // Previous button
                    if (!link.url) {
                        return (
                            <div
                                key={index}
                                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/10 text-muted-foreground cursor-not-allowed opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </Link>
                    );
                }

                if (index === links.length - 1) {
                    // Next button
                    if (!link.url) {
                        return (
                            <div
                                key={index}
                                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/10 text-muted-foreground cursor-not-allowed opacity-50"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    );
                }

                // Page numbers
                if (!link.url) {
                    return (
                        <div
                            key={index}
                            className={`inline-flex items-center justify-center min-w-[2.5rem] h-10 rounded-lg px-3 py-2 text-sm font-medium ${
                                link.active
                                    ? 'bg-primary/20 backdrop-blur-md border-2 border-primary/50 text-primary shadow-lg ring-2 ring-primary/20'
                                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-muted-foreground cursor-not-allowed opacity-50'
                            }`}
                        >
                            {link.label}
                        </div>
                    );
                }
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`inline-flex items-center justify-center min-w-[2.5rem] h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                            link.active
                                ? 'bg-primary/20 backdrop-blur-md border-2 border-primary/50 text-primary shadow-lg ring-2 ring-primary/20'
                                : 'bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl'
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}

