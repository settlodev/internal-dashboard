import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Shield, CreditCard } from 'lucide-react';
import { UserSummary } from '@/types/owners/summary';

interface AccountInfoCardProps {
    businessOwner: UserSummary;
}

export const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ businessOwner }) => {
    const isEmailVerified = businessOwner.userDetails.emailVerified !== null;

    const formatDateTime = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Account Information
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="font-medium text-lg">{businessOwner.userDetails.accountNumber}</p>
                        </div>
                    </div>

                    {businessOwner.userDetails.identificationId && (
                        <div>
                            <p className="text-sm text-gray-500">Identification ID</p>
                            <p className="font-medium">{businessOwner.userDetails.identificationId}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-500">Email Verified</p>
                        <p className="font-medium text-sm">{isEmailVerified ? formatDateTime(businessOwner.userDetails.emailVerified) : "Not verified"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};