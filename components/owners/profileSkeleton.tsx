import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeleton: React.FC = () => (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="space-y-6">
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>
            <div className="xl:col-span-2 space-y-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
            </div>
        </div>
    </div>
);