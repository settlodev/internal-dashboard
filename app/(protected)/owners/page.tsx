
'use client';
import React, { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { getBusinessOwnerSummary } from '@/lib/actions/business-owners';
import { ProtectedComponent } from '@/components/auth/protectedComponent';

import { UserSummary } from '@/types/owners/summary';
import {ProfileSkeleton} from "@/components/owners/profileSkeleton";
import {ErrorDisplay} from "@/components/owners/errordisplay";
import {ProfileDisplay} from "@/components/owners/profileDisplay";

const BusinessOwnerProfile = ({ params }: { params: { id: string } }) => {
    const [businessOwner, setBusinessOwner] = useState<UserSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchBusinessOwner = async () => {
            try {
                setIsLoading(true);
                const data = await getBusinessOwnerSummary(params.id as UUID);
                setBusinessOwner(data);
            } catch (err) {
                console.error("Failed to load business owner:", err);
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinessOwner();
    }, [params.id]);

    if (isLoading) {
        return (
            <ProtectedComponent
                requiredPermission="view:owners"
                fallback={<div className="p-8 text-center text-lg">You are not authorized to view this page</div>}
            >
                <div className="container mx-auto p-4 lg:p-6">
                    <ProfileSkeleton />
                </div>
            </ProtectedComponent>
        );
    }

    if (error || !businessOwner) {
        return (
            <ProtectedComponent
                requiredPermission="view:owners"
                fallback={<div className="p-8 text-center text-lg">You are not authorized to view this page</div>}
            >
                <div className="container mx-auto p-4 lg:p-6">
                    <ErrorDisplay />
                </div>
            </ProtectedComponent>
        );
    }

    return (
        <ProtectedComponent
            requiredPermission="view:owners"
            fallback={<div className="p-8 text-center text-lg">You are not authorized to view this page</div>}
        >
            <div className="container mx-auto p-4 lg:p-6">
                <ProfileDisplay businessOwner={businessOwner} />
            </div>
        </ProtectedComponent>
    );
};

export default BusinessOwnerProfile;