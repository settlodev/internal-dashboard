'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchBusinessesByReferralCode, fetchProfileData, getOwnerDetails } from '@/lib/actions/user-actions';
import { Business } from '@/types/business/types';

interface ProfileData {
  first_name: string;
  last_name: string;
  role: {
    name: string;
  };
  avatar_url?: string;
  referral_code?: string;
  commission_earned?: number;
}

interface ProfileError {
  message: string;
}
const ReferralCodeSection = ({ referralCode }: { referralCode: string }) => {
  const handleCopyReferral = () => {
    const referralLink = `https://settlo.co.tz/register?referredByCode=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const handleShareReferral = () => {
    const referralLink = `https://settlo.co.tz/register?referredByCode=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join Settlo with my referral code',
        text: `Use my referral code ${referralCode} to join Settlo!`,
        url: referralLink
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard! Share it with your friends.');
    }
  };

  return (
    <div className="bg-secondary/20 p-4 rounded-lg relative">
      <p className="text-sm text-muted-foreground">Referral Code</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold">
          {referralCode || 'N/A'}
        </p>
        {referralCode && (
          <div className="flex space-x-2">
            <button
              onClick={handleCopyReferral}
              className="p-1 rounded-md hover:bg-secondary/50 transition-colors"
              title="Copy referral link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button
              onClick={handleShareReferral}
              className="p-1 rounded-md hover:bg-secondary/50 transition-colors"
              title="Share referral link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
// Client component for the table row that displays owner info
const OwnerDisplayCell = ({ ownerName }: { ownerName: string }) => {
  return <span>{ownerName}</span>;
};

// Profile Skeleton component
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

// Main client component - convert the server component to a client component
const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<ProfileError | null>(null);
  const [referredBusinesses, setReferredBusinesses] = useState<Business[] | null>();
  const [ownersMap, setOwnersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch profile data
        const profileData = await fetchProfileData();
        
        if (profileData.error) {
          setError(profileData?.error);
          setLoading(false);
          return;
        }
        
        setProfile(profileData.profile);
        
        // Fetch referred businesses if profile has a referral code
        if (profileData.profile?.referral_code) {
          try {
            const businesses = await fetchBusinessesByReferralCode(profileData.profile.referral_code);
            setReferredBusinesses(businesses);
            
            // Fetch owner details for each business
            const ownersData: Record<string, string> = {};
            for (const business of businesses) {
              const ownerName = await getOwnerDetails(business.owner);
              ownersData[business.owner] = ownerName;
            }
            setOwnersMap(ownersData);
          } catch (err) {
            console.error("Error fetching referred businesses:", err);
          }
        }
      } catch (err) {
        setError({ message: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
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

  const initials = `${profile?.first_name?.charAt(0)}${profile?.last_name?.charAt(0)}`.toUpperCase();

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
            <ReferralCodeSection referralCode={profile.referral_code || ''} />
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Businesses Registered</p>
              <p className="text-2xl font-semibold">
                {referredBusinesses ? referredBusinesses.length : 0}
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
            {referredBusinesses && referredBusinesses.length > 0 ? (
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
                        <OwnerDisplayCell ownerName={ownersMap[business.owner as keyof typeof ownersMap] || 'Loading...'} />
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
};

export default ProfilePage;