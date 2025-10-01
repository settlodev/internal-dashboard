
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar,AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building, AlertTriangle, Eye, Shield, TrendingUp, CreditCard, Mail, Phone, UserRound, Calendar, Package, Warehouse } from 'lucide-react';
import { getBusinessOwnerSummary } from '@/lib/actions/business-owners';
import { UUID } from 'crypto';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { ProtectedComponent } from '@/components/auth/protectedComponent';
import Link from 'next/link';
import { FeedbackDialog } from '@/components/widgets/feedback_dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { UserSummary } from '@/types/owners/summary';

const ProfileDisplay = ({ businessOwner }: { businessOwner: UserSummary }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const isEmailVerified = businessOwner.userDetails.emailVerified !== null;
  const hasLocation = Boolean(
    businessOwner.userDetails.region && 
    businessOwner.userDetails.district
  );

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Header Section */}
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

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="xl:col-span-1 space-y-6">
          {/* Profile Summary Card */}
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

          {/* Quick Stats Card */}
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location</span>
                <Badge variant={hasLocation ? "default" : "secondary"}>
                  {hasLocation ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Businesses</span>
                <Badge variant="outline" className="font-semibold">
                  {businessOwner.businessDetails.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="xl:col-span-2 space-y-6">
          {/* Contact Information Card */}
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

          {/* Location Information Card */}
          {hasLocation && (
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
          )}

          {/* Account Information Card */}
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

          {/* Business Details Card */}
          {businessOwner.businessDetails.length > 0 && (
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

                      {/* Locations */}
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

                      {/* Warehouses */}
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
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const ProfileSkeleton = () => (
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

// Error display component
const ErrorDisplay = () => (
  <div className="flex flex-col items-center justify-center min-h-96 gap-4">
    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl max-w-md text-center">
      <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load profile</h2>
      <p className="text-red-700 dark:text-red-300">There was an error loading the business owner profile. Please try again later.</p>
    </div>
  </div>
);

const BusinessOwnerProfile = ({ params }: { params: { id: string } }) => {
  const [businessOwner, setBusinessOwner] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBusinessOwner = async () => {
      try {
        setIsLoading(true);
        const data = await getBusinessOwnerSummary(params.id as UUID);
        console.log("The user data are", data.userDetails);
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