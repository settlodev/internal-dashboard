'use client';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, Shield, Building, User } from 'lucide-react';
import { getBusinessOwner } from '@/lib/actions/business-owners';
import { UUID } from 'crypto';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';

const BusinessOwnerProfile = async ({params}:{params:{id:string}})=> {

  const businessOwner = await getBusinessOwner(params.id as UUID)
    console.log(businessOwner)

    const breadcrumbItems = [
        { title: "Business Owner", link: "/owners" },
        { title: businessOwner.firstName, link: "" },
    ]
  // Dummy businessOwner
 

  const getInitials = (firstName: any[], lastName: any[]) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>
    <div className="flex flex-col mx-auto p-4">

    <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Business Owner Profile</CardTitle>
          <CardDescription className="text-lg">View and manage your business owner profile.</CardDescription>
        </CardHeader> 
    </Card>
     <Card className="w-full mt-6">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={businessOwner.avatar} alt={`${businessOwner.firstName} ${businessOwner.lastName}`} />
              <AvatarFallback>{getInitials(businessOwner.firstName, businessOwner.lastName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                  {businessOwner.firstName} {businessOwner.lastName}
                </h2>
                {businessOwner.isOwner && (
                  <Badge variant="secondary" className="ml-2">
                    Owner
                  </Badge>
                )}
              </div>
              <p className="text-gray-500">{businessOwner.bio}</p>
              <div className="flex gap-2 mt-2">
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{businessOwner.email}</span>
                  {businessOwner.emailVerified && (
                    <Badge variant="outline" className="ml-2">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{businessOwner.phoneNumber}</span>
                  {businessOwner.phoneNumberVerified && (
                    <Badge variant="outline" className="ml-2">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span>ID: {businessOwner.identificationId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Location Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{businessOwner.region}, {businessOwner.district}</span>
                </div>
                <div className="pl-6">
                  <p className="text-gray-600">
                    Ward: {businessOwner.ward}
                    {businessOwner.municipal && `, ${businessOwner.municipal}`}
                  </p>
                  <p className="text-gray-600">Area Code: {businessOwner.areaCode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Account Number</p>
                <p className="font-medium">{businessOwner.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge variant={businessOwner.status ? "outline" : "destructive"}>
                  {businessOwner.status ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Referral Code</p>
                <p className="font-medium">{businessOwner.referredByCode || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Theme</p>
                <p className="font-medium capitalize">{businessOwner.theme}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    
    </div>
    </div>
  );
};

export default BusinessOwnerProfile;