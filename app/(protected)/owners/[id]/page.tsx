// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { MapPin, Mail, Phone,Building, User, UserRound, AlertTriangle, Eye } from 'lucide-react';
// import { getBusinessOwner } from '@/lib/actions/business-owners';
// import { UUID } from 'crypto';
// import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
// import { ProtectedComponent } from '@/components/auth/protectedComponent';
// import Link from 'next/link';
// import { Business } from '@/types/business/types';
// import { FeedbackDialog } from '@/components/widgets/feedback_dialog';

// interface BusinessOwner {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   emailVerified: boolean;
//   phoneNumber: string;
//   phoneNumberVerified: boolean;
//   gender: string;
//   identificationId?: string;
//   avatar?: string;
//   isOwner: boolean;
//   bio?: string;
//   businessComplete: boolean;
//   locationComplete: boolean;
//   region: string;
//   district: string;
//   ward: string;
//   municipal?: string;
//   areaCode: string;
//   isMigrated?: boolean;
//   accountNumber: string;
//   status: boolean;
//   referredByCode?: string;
//   theme: string;
//   businesses?: Business[];
// }

// const ProfileDisplay = ({ businessOwner }: { businessOwner: BusinessOwner }) => {

//   const getInitials = (firstName: string, lastName: string) => {
//     return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
//   };

//   return (
//     <div className="flex flex-col w-full gap-6">
//       {/* Header Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg lg:text-2xl">Business Owner Profile</CardTitle>
//           <CardDescription className="text-xs font-medium lg:text-md">
//             View and manage business owner information
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       {/* Profile Card */}
//       <Card>
//         <CardHeader className="pb-4">
//           <div className="flex flex-col lg:flex-row items-start gap-6">
//             <Avatar className=" hidden lg:block h-20 w-20">
//               <AvatarImage
//                 src={businessOwner.avatar}
//                 alt={`Profile photo of ${businessOwner.firstName} ${businessOwner.lastName}`}
//               />
//               <AvatarFallback aria-label={`${businessOwner.firstName} ${businessOwner.lastName} initials`}>
//                 {getInitials(businessOwner.firstName, businessOwner.lastName)}
//               </AvatarFallback>
//             </Avatar>

//             <div className="flex-1">
//               <div className="flex  flex-row items-center gap-2 mb-2">
//                 <h2 className="text-xl lg:text-2xl font-bold">
//                   {businessOwner.firstName} {businessOwner.lastName}
//                 </h2>
//                 {businessOwner.isOwner && (
//                   <Badge variant="secondary" className="ml-2">
//                     Owner
//                   </Badge>
//                 )}
//               </div>

//               {businessOwner.bio && (
//                 <p className="text-gray-500 mb-3">{businessOwner.bio}</p>
//               )}

//               <div className="flex flex-wrap gap-2 mt-2">
//                 {businessOwner.businessComplete && (
//                   <Badge variant="outline" className="textbg-green-100 text-green-800">
//                     Business Complete
//                   </Badge>
//                 )}
//                 {businessOwner.locationComplete && (
//                   <Badge variant="outline" className="bg-green-100 text-green-800">
//                     Location Verified
//                   </Badge>
//                 )}
//               </div>

//             </div>

//             <div className='flex gap-2'>
//               <div>
//               {businessOwner.businesses && businessOwner.businesses[0] ? (
//                 <Link href={`/businesses/${businessOwner.businesses[0]}`}>
//                   <Badge variant="outline" className="text-black p-2.5 items-center w-full">
//                     <Eye className="h-4 w-4 mr-2" />
//                     <span className='text-xs font-medium'>Details</span>
//                   </Badge>
//                 </Link>
//               ) : (
//                 <Badge variant="outline" className="bg-gray-100 text-gray-500 p-4 items-center w-full">
//                   <span>No Business</span>
//                 </Badge>
//               )}

//               </div>
//               <div>
//                 <FeedbackDialog ownerId ={businessOwner.id}/>
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Personal Information Section */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Personal Information
//               </h3>

//               <div className="space-y-3">
//                 <div className="flex flex-col lg:flex-row lg:items-center gap-2">
//                   <div className='flex items-center gap-1'>
//                   <Mail className="h-4 w-4 text-gray-500" />
//                   <span className="truncate">{businessOwner.email}</span>
//                   </div>
//                   <div>
//                   {businessOwner.emailVerified ? (
//                     <Badge variant="outline" className="bg-green-50 text-green-700">
//                       Verified
//                     </Badge>
//                   ) : (
//                     <Badge variant="outline" className="bg-amber-50 text-amber-700">
//                       Unverified
//                     </Badge>
//                   )}
//                   </div>
//                 </div>

//                 <div className="flex lg:items-center gap-2">
//                   <Phone className="h-4 w-4 text-gray-500" />
//                   <span>{businessOwner.phoneNumber}</span>
//                   {businessOwner.phoneNumberVerified ? (
//                     <Badge variant="outline" className="bg-green-50 text-green-700">
//                       Verified
//                     </Badge>
//                   ) : (
//                     <Badge variant="outline" className="bg-amber-50 text-amber-700">
//                       Unverified
//                     </Badge>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <UserRound className="h-4 w-4 text-gray-500" />
//                   <span>Gender: {businessOwner.gender || 'Not specified'}</span>
//                 </div>

//               </div>
//             </div>

//             {/* Location Details Section */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold flex items-center gap-2">
//                 <Building className="h-5 w-5" />
//                 Location Details
//               </h3>

//               <div className="space-y-3">
//                 <div className="flex items-start gap-2">
//                   <MapPin className="h-4 w-4 text-gray-500 mt-1" />
//                   <div>
//                     <span className="font-medium">{businessOwner.region}, {businessOwner.district}</span>
//                     <p className="text-gray-600 mt-1">
//                       Ward: {businessOwner.ward}
//                       {businessOwner.municipal && `, ${businessOwner.municipal}`}
//                     </p>
//                     <p className="text-gray-600">Area Code: {businessOwner.areaCode}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Account Information Section */}
//           <div className="mt-8 pt-6 border-t">
//             <h3 className="text-lg font-semibold mb-4">Account Information</h3>
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-500 mb-1">Account Number</p>
//                 <p className="font-medium">{businessOwner.accountNumber}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500 mb-1">Status</p>
//                 <Badge variant={businessOwner.status ? "default" : "destructive"}>
//                   {businessOwner.status ? "Active" : "Inactive"}
//                 </Badge>
//               </div>
//               <div>
//                 <p className="text-gray-500 mb-1">Referral Code</p>
//                 <p className="font-medium">{businessOwner.referredByCode || "None"}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500 mb-1">Theme</p>
//                 <p className="font-medium capitalize">{businessOwner.theme || "Default"}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500 mb-1">Migrated</p>
//                 <p className="font-medium capitalize">{businessOwner.isMigrated ? "Yes" : "No"}</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// // Error display component
// const ErrorDisplay = () => (
//   <Card className="w-full p-6">
//     <div className="flex items-center gap-4 text-red-600">
//       <AlertTriangle className="h-10 w-10" />
//       <div>
//         <h2 className="text-xl font-bold">Failed to load profile</h2>
//         <p className="text-gray-600">There was an error loading the business owner profile. Please try again later.</p>
//       </div>
//     </div>
//   </Card>
// );

// // Main component with proper data fetching approach
// const BusinessOwnerProfile = ({ params }: { params: { id: string } }) => {
//   const [businessOwner, setBusinessOwner] = useState<BusinessOwner | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [breadcrumbItems, setBreadcrumbItems] = useState([
//     { title: "Business Owners", link: "/owners" },
//     { title: "Profile", link: "" }
//   ]);

//   useEffect(() => {
//     const fetchBusinessOwner = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getBusinessOwner(params.id as UUID);
//         setBusinessOwner(data);

        
//         setBreadcrumbItems([
//           { title: "Business Owners", link: "/owners" },
//           { title: data.firstName || "Profile", link: "" }
//         ]);
//       } catch (err) {
//         console.error("Failed to load business owner:", err);
//         setError(err instanceof Error ? err : new Error('Unknown error occurred'));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBusinessOwner();
//   }, [params.id]);

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-gray-500">Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !businessOwner) {
//     return (
//       <div className="container mx-auto p-4">
//         <ErrorDisplay />
//       </div>
//     );
//   }

//   return (
//     <ProtectedComponent
//       requiredPermission="view:owners"
//       fallback={<div className="p-8 text-center text-lg">You are not authorized to view this page</div>}
//     >
//       <div className="container mx-auto p-4">
//         <div className="flex items-center justify-between mb-4">
//           <div className="relative flex-1">
//             <BreadcrumbNav items={breadcrumbItems} />
//           </div>
//         </div>
//         <ProfileDisplay businessOwner={businessOwner} />
//       </div>
//     </ProtectedComponent>
//   );
// };

// export default BusinessOwnerProfile;

'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Building, User, UserRound, AlertTriangle, Eye, Calendar, Shield, TrendingUp, CreditCard } from 'lucide-react';
import { getBusinessOwner } from '@/lib/actions/business-owners';
import { UUID } from 'crypto';
import { BreadcrumbNav } from '@/components/layout/breadcrumbs';
import { ProtectedComponent } from '@/components/auth/protectedComponent';
import Link from 'next/link';
import { Business } from '@/types/business/types';
import { FeedbackDialog } from '@/components/widgets/feedback_dialog';
import { Skeleton } from '@/components/ui/skeleton';

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
  businesses?: Business[];
  dateCreated?: string;
}

const ProfileDisplay = ({ businessOwner }: { businessOwner: BusinessOwner }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <BreadcrumbNav items={[
            { title: "Business Owners", link: "/owners" },
            { title: `${businessOwner.firstName} ${businessOwner.lastName}`, link: "" }
          ]} />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-2">
            Business Owner Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive overview of business owner information and account details
          </p>
        </div>
        
        <div className="flex gap-3">
          <FeedbackDialog ownerId={businessOwner.id} />
          {businessOwner.businesses && businessOwner.businesses[0] ? (
            <Link href={`/businesses/${businessOwner.businesses[0]}`}>
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
                  <AvatarImage
                    src={businessOwner.avatar}
                    alt={`Profile photo of ${businessOwner.firstName} ${businessOwner.lastName}`}
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-100 to-purple-100">
                    {getInitials(businessOwner.firstName, businessOwner.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {businessOwner.firstName} {businessOwner.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{businessOwner.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {businessOwner.isOwner && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <User className="h-3 w-3 mr-1" />
                        Owner
                      </Badge>
                    )}
                    <Badge variant={businessOwner.status ? "default" : "destructive"}>
                      {businessOwner.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {businessOwner.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed">
                    {businessOwner.bio}
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
                <Badge variant={businessOwner.emailVerified ? "default" : "destructive"}>
                  {businessOwner.emailVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Phone Verification</span>
                <Badge variant={businessOwner.phoneNumberVerified ? "default" : "destructive"}>
                  {businessOwner.phoneNumberVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Business Setup</span>
                <Badge variant={businessOwner.businessComplete ? "default" : "secondary"}>
                  {businessOwner.businessComplete ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location</span>
                <Badge variant={businessOwner.locationComplete ? "default" : "secondary"}>
                  {businessOwner.locationComplete ? "Verified" : "Pending"}
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
                <User className="h-5 w-5 text-blue-600" />
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
                      <p className="font-medium">{businessOwner.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{businessOwner.phoneNumber}</p>
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
                      <p className="font-medium capitalize">{businessOwner.gender || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{formatDate(businessOwner.dateCreated)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information Card */}
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
                  <div>
                    <p className="text-sm text-gray-500">Region & District</p>
                    <p className="font-medium">{businessOwner.region}, {businessOwner.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ward & Municipal</p>
                    <p className="font-medium">
                      {businessOwner.ward}
                      {businessOwner.municipal && `, ${businessOwner.municipal}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area Code</p>
                    <p className="font-medium">{businessOwner.areaCode}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <p className="font-medium text-lg">{businessOwner.accountNumber}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Referral Code</p>
                  <p className="font-medium">{businessOwner.referredByCode || "None"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Theme Preference</p>
                  <Badge variant="outline" className="capitalize">
                    {businessOwner.theme || "Default"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Migration Status</p>
                  <Badge variant={businessOwner.isMigrated ? "default" : "secondary"}>
                    {businessOwner.isMigrated ? "Migrated" : "Not Migrated"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Identification ID</p>
                  <p className="font-medium">{businessOwner.identificationId || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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

// Main component
const BusinessOwnerProfile = ({ params }: { params: { id: string } }) => {
  const [businessOwner, setBusinessOwner] = useState<BusinessOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBusinessOwner = async () => {
      try {
        setIsLoading(true);
        const data = await getBusinessOwner(params.id as UUID);
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