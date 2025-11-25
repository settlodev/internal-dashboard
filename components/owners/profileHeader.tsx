import React from 'react';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from '@/components/widgets/feedback_dialog';
import Link from 'next/link';
import { Eye, Building } from 'lucide-react';
import { UserSummary } from '@/types/owners/summary';

interface ProfileHeaderProps {
    businessOwner: UserSummary;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ businessOwner }) => {
    return (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
                <BreadcrumbNav items={[
                    { title: "Business Owners", link: "/owners" },
                    { title: `${businessOwner.userDetails.firstName} ${businessOwner.userDetails.lastName}`, link: "" }
                ]} />
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-2">
                    Business Owner Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Comprehensive overview of business owner information and account details
                </p>
            </div>

            <div className="flex gap-3">
                <FeedbackDialog ownerId={businessOwner.userDetails.id} />
                {businessOwner.businessDetails && businessOwner.businessDetails.length > 0 ? (
                    <Link href={`/businesses/${businessOwner.businessDetails[0].id}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Business
                        </Button>
                    </Link>
                ) : (
                    <Button variant="outline" disabled className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        No Business
                    </Button>
                )}
            </div>
        </div>
    );
};