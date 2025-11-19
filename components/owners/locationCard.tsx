import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { MapPin, Building } from 'lucide-react';
import { UserSummary } from '@/types/owners/summary';

interface LocationCardProps {
    businessOwner: UserSummary;
}

export const LocationCard: React.FC<LocationCardProps> = ({ businessOwner }) => {
    const hasLocation = Boolean(
        businessOwner.userDetails.region &&
        businessOwner.userDetails.district
    );

    if (!hasLocation) return null;

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Location Details
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mt-1">
                        <Building className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {businessOwner.userDetails.region && (
                            <div>
                                <p className="text-sm text-gray-500">Region</p>
                                <p className="font-medium">{businessOwner.userDetails.region}</p>
                            </div>
                        )}
                        {businessOwner.userDetails.district && (
                            <div>
                                <p className="text-sm text-gray-500">District</p>
                                <p className="font-medium">{businessOwner.userDetails.district}</p>
                            </div>
                        )}
                        {businessOwner.userDetails.ward && (
                            <div>
                                <p className="text-sm text-gray-500">Ward</p>
                                <p className="font-medium">{businessOwner.userDetails.ward}</p>
                            </div>
                        )}
                        {businessOwner.userDetails.municipal && (
                            <div>
                                <p className="text-sm text-gray-500">Municipal</p>
                                <p className="font-medium">{businessOwner.userDetails.municipal}</p>
                            </div>
                        )}
                        {businessOwner.userDetails.areaCode && (
                            <div>
                                <p className="text-sm text-gray-500">Area Code</p>
                                <p className="font-medium">{businessOwner.userDetails.areaCode}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};