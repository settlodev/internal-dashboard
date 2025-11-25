import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserSummary } from '@/types/owners/summary';

interface ProfileSummaryCardProps {
    businessOwner: UserSummary;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ businessOwner }) => {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-100 to-purple-100">
                            {getInitials(businessOwner.userDetails.firstName, businessOwner.userDetails.lastName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="mt-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {businessOwner.userDetails.firstName} {businessOwner.userDetails.lastName}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{businessOwner.userDetails.email}</p>

                        <div className="flex items-center justify-center gap-2 mt-3">
                            <Badge variant={businessOwner.userDetails.gender ? "secondary" : "outline"} className="capitalize">
                                {businessOwner.userDetails.gender?.toLowerCase() || "Not specified"}
                            </Badge>
                        </div>
                    </div>

                    {businessOwner.userDetails.bio && (
                        <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed">
                            {businessOwner.userDetails.bio}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};