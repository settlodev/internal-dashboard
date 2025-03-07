'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, Shield, Building, User, UserRound, AlertTriangle } from 'lucide-react';
import { getBusinessOwner } from '@/lib/actions/business-owners';
import { UUID } from 'crypto';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { ProtectedComponent } from '@/components/auth/protectedComponent';

// Define a proper type for the business owner
interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  gender: string;
  identificationId?: string;
  avatar?: string;
  isOwner: boolean;
  bio?: string;
  businessComplete: boolean;
  locationComplete: boolean;
  region: string;
  district: string;
  ward: string;
  municipal?: string;
  areaCode: string;
  isMigrated?: boolean;
  accountNumber: string;
  status: boolean;
  referredByCode?: string;
  theme: string;
}

// Separate the profile display into a client component
const ProfileDisplay = ({ businessOwner }: { businessOwner: BusinessOwner }) => {
  // Functions that were previously in the main component
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="grid gap-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Business Owner Profile</CardTitle>
          <CardDescription className="text-md">
            View and manage business owner information
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={businessOwner.avatar} 
                alt={`Profile photo of ${businessOwner.firstName} ${businessOwner.lastName}`} 
              />
              <AvatarFallback aria-label={`${businessOwner.firstName} ${businessOwner.lastName} initials`}>
                {getInitials(businessOwner.firstName, businessOwner.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                  {businessOwner.firstName} {businessOwner.lastName}
                </h2>
                {businessOwner.isOwner && (
                  <Badge variant="secondary" className="ml-2">
                    Owner
                  </Badge>
                )}
              </div>
              
              {businessOwner.bio && (
                <p className="text-gray-500 mb-3">{businessOwner.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {businessOwner.businessComplete && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Business Complete
                  </Badge>
                )}
                {businessOwner.locationComplete && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Location Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="flex-1 truncate">{businessOwner.email}</span>
                  {businessOwner.emailVerified ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Unverified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{businessOwner.phoneNumber}</span>
                  {businessOwner.phoneNumberVerified ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Unverified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-gray-500" />
                  <span>Gender: {businessOwner.gender || 'Not specified'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span>ID: {businessOwner.identificationId || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Location Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <span className="font-medium">{businessOwner.region}, {businessOwner.district}</span>
                    <p className="text-gray-600 mt-1">
                      Ward: {businessOwner.ward}
                      {businessOwner.municipal && `, ${businessOwner.municipal}`}
                    </p>
                    <p className="text-gray-600">Area Code: {businessOwner.areaCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Account Number</p>
                <p className="font-medium">{businessOwner.accountNumber}</p>
              </div>
              
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <Badge variant={businessOwner.status ? "default" : "destructive"}>
                  {businessOwner.status ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div>
                <p className="text-gray-500 mb-1">Referral Code</p>
                <p className="font-medium">{businessOwner.referredByCode || "None"}</p>
              </div>
              
              <div>
                <p className="text-gray-500 mb-1">Theme</p>
                <p className="font-medium capitalize">{businessOwner.theme || "Default"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Migrated</p>
                <p className="font-medium capitalize">{businessOwner.isMigrated ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Error display component
const ErrorDisplay = () => (
  <Card className="w-full p-6">
    <div className="flex items-center gap-4 text-red-600">
      <AlertTriangle className="h-10 w-10" />
      <div>
        <h2 className="text-xl font-bold">Failed to load profile</h2>
        <p className="text-gray-600">There was an error loading the business owner profile. Please try again later.</p>
      </div>
    </div>
  </Card>
);

// Main component with proper data fetching approach
const BusinessOwnerProfile = ({ params }: { params: { id: string } }) => {
  const [businessOwner, setBusinessOwner] = useState<BusinessOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { title: "Business Owners", link: "/owners" },
    { title: "Profile", link: "" }
  ]);

  useEffect(() => {
    const fetchBusinessOwner = async () => {
      try {
        setIsLoading(true);
        const data = await getBusinessOwner(params.id as UUID);
        setBusinessOwner(data);
        
        // Update breadcrumbs AFTER we have the data
        setBreadcrumbItems([
          { title: "Business Owners", link: "/owners" },
          { title: data.firstName || "Profile", link: "" }
        ]);
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
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !businessOwner) {
    return (
      <div className="container mx-auto p-4">
        <ErrorDisplay />
      </div>
    );
  }

  return (
    <ProtectedComponent 
            requiredPermission="view:owners" 
            fallback={<div className="p-8 text-center text-lg">You are not authorized to view this page</div>}
        >
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
      </div>
      <ProfileDisplay businessOwner={businessOwner} />
    </div>
    </ProtectedComponent>
  );
};

export default BusinessOwnerProfile;