import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Mail, Phone, UserRound, Calendar } from 'lucide-react';
import { UserSummary } from '@/types/owners/summary';

interface PersonalInfoCardProps {
    businessOwner: UserSummary;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ businessOwner }) => {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <UserRound className="h-5 w-5 text-blue-600" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Mail className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium">{businessOwner.userDetails.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="font-medium">{businessOwner.userDetails.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <UserRound className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="font-medium capitalize">{businessOwner.userDetails.gender?.toLowerCase() || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <Calendar className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Member Since</p>
                                <p className="font-medium">{formatDate(businessOwner.userDetails.dateCreated)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};