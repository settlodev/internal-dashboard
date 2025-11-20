import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { UserSummary } from '@/types/owners/summary';

interface AccountStatusCardProps {
    businessOwner: UserSummary;
}

export const AccountStatusCard: React.FC<AccountStatusCardProps> = ({ businessOwner }) => {
    const isEmailVerified = businessOwner.userDetails.emailVerified !== null;


    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Account Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email Verification</span>
                    <Badge variant={isEmailVerified ? "default" : "destructive"}>
                        {isEmailVerified ? "Verified" : "Pending"}
                    </Badge>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Business Setup</span>
                    <Badge variant={businessOwner.businessDetails.length > 0 ? "default" : "secondary"}>
                        {businessOwner.businessDetails.length > 0 ? "Complete" : "Incomplete"}
                    </Badge>
                </div>

            </CardContent>
        </Card>
    );
};