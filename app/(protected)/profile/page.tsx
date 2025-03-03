import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Business } from '@/types/users/type';
import { fetchBusinessesByReferralCode, fetchProfileData, getOwnerDetails } from '@/lib/actions/user-actions';
import { Business } from '@/types/business/types';

const ProfileSkeleton = () => (
  <div className="container mx-auto p-4 space-y-6">
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// First, let's define some interfaces based on the sample data



// Get owner details for display purposes


// Updated Profile Page component
async function ProfilePage() {
  const { profile, error } = await fetchProfileData();

  // Initialize referred businesses as empty array
  let referredBusinesses: Business[] = [];
  
  // Fetch businesses referred by this user's referral code
  if (profile?.referral_code) {
    try {
      referredBusinesses = await fetchBusinessesByReferralCode(profile.referral_code);
    } catch (error) {
      console.error("Error fetching referred businesses:", error);
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {error.message || 'There was an error loading your profile. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return <ProfileSkeleton />;
  }

  const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {profile.avatar_url && (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={`${profile.first_name}'s avatar`}
                />
              )}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              <CardDescription className="text-lg">
                {profile.role.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Referral Code</p>
              <p className="text-2xl font-semibold">
                {profile.referral_code || 'N/A'}
              </p>
            </div>
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Businesses Registered</p>
              <p className="text-2xl font-semibold">
                {referredBusinesses.length || 0}
              </p>
            </div>
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Commission Earned</p>
              <p className="text-2xl font-semibold">
                ${(profile.commission_earned || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

     
      {/* Add a new card for businesses tied to referral code */}
      {profile.referral_code && (
        <Card>
          <CardHeader>
            <CardTitle>Businesses Using Your Referral Code</CardTitle>
            <CardDescription>
              These businesses were registered using your referral code ({profile.referral_code})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referredBusinesses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referredBusinesses.map((business: Business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell>{business.businessTypeName || 'N/A'}</TableCell>
                      <TableCell>{business.totalLocations || 'N/A'}</TableCell>
                      <TableCell>{business.countryName || 'N/A'}</TableCell>
                      <TableCell>
                        <OwnerDisplayCell ownerId={business.owner} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No businesses have used your referral code yet
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// A separate component to handle fetching and displaying owner details
const OwnerDisplayCell = async ({ ownerId }: { ownerId: string }) => {
  const ownerName = await getOwnerDetails(ownerId);
  return <span>{ownerName}</span>;
};

export default ProfilePage;