import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building, MapPin, Package, Warehouse, Eye } from 'lucide-react';
import { UserSummary } from '@/types/owners/summary';

interface BusinessInfoCardProps {
    businessOwner: UserSummary;
}

export const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({ businessOwner }) => {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (businessOwner.businessDetails.length === 0) return null;

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5 text-orange-600" />
                    Business Information
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {businessOwner.businessDetails.map((business) => (
                        <div key={business.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{business.name}</h3>
                                    <p className="text-sm text-gray-500">Created: {formatDate(business.businessCreationDate)}</p>
                                </div>
                                <Link href={`/businesses/${business.id}`}>
                                    <Button size="sm" variant="outline">
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </Button>
                                </Link>
                            </div>

                            {business.locationDetails.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Locations ({business.locationDetails.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                        {business.locationDetails.map((location) => (
                                            <div key={location.locationId} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <p className="font-medium text-sm">{location.locationName}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {location.lastSubscriptionPackageName ? (
                                                        <>
                                                            <Package className="h-3 w-3 inline mr-1" />
                                                            {location.lastSubscriptionPackageName}
                                                        </>
                                                    ) : (
                                                        "No subscription"
                                                    )}
                                                </p>
                                                {location.lastSubscriptionEndDate && (
                                                    <p className="text-xs text-gray-500">
                                                        Expires: {formatDate(location.lastSubscriptionEndDate)}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {business.warehouseDetails.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Warehouse className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium">Warehouses ({business.warehouseDetails.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                        {business.warehouseDetails.map((warehouse) => (
                                            <div key={warehouse.warehouseId} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <p className="font-medium text-sm">{warehouse.warehouseName}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Created: {formatDate(warehouse.warehouseCreationDate)}
                                                </p>
                                                {warehouse.lastSubscriptionEndDate && (
                                                    <p className="text-xs text-gray-500">
                                                        Subscription: {formatDate(warehouse.lastSubscriptionEndDate)}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};