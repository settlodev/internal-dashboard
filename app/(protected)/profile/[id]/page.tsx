'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share, RefreshCw } from 'lucide-react';
import { fetchBusinessesByReferralCode, fetchProfileDataById, getOwnerDetails } from '@/lib/actions/user-actions';
import { Business } from '@/types/business/types';
import { role } from '@/types/users/type';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role:role,
  user_type: string;
  avatar_url?: string;
  referral_code?: string;
  commission_earned?: number;
  created_at: string;
  updated_at: string;
}

interface ProfileError {
  message: string;
}

const ReferralCodeSection = ({ referralCode }: { referralCode: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyReferral = () => {
    const referralLink = `https://settlo.co.tz/register?referredByCode=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-secondary/20 p-4 rounded-lg relative">
      <p className="text-sm text-muted-foreground">Referral Code</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold tracking-wider">
          {referralCode || 'N/A'}
        </p>
        {referralCode && (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyReferral}
              className="h-8 px-2 flex items-center gap-1"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShareReferral}
              className="h-8 px-2 flex items-center gap-1"
            >
              <Share size={16} />
              Share
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const OwnerDisplayCell = ({ ownerName }: { ownerName: string }) => {
  return <span>{ownerName}</span>;
};

const ProfileSkeleton = () => (
  <div className="container mx-auto p-4 space-y-6 max-w-6xl">
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  </div>
);

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<ProfileError | null>(null);
  const [referredBusinesses, setReferredBusinesses] = useState<Business[] | null>(null);
  const [ownersMap, setOwnersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadProfileData = async () => {
    try {
      const profileData = await fetchProfileDataById(params.id);
      
      
      if (!profileData) {
        setError({ message: 'Profile not found or you do not have permission to view it.' });
        return;
      }
      
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error("Error loading profile:", err);
      setError({ message: 'Failed to load profile data. Please try again.' });
      return null;
    }
  };

  const loadBusinessData = async (referralCode: string) => {
    try {
      const businesses = await fetchBusinessesByReferralCode(referralCode);
      setReferredBusinesses(businesses || []);
      
      // Fetch owner details for each business
      const ownersData: Record<string, string> = {};
      if (businesses && businesses.length > 0) {
        const ownerPromises = businesses.map(async (business) => {
          try {
            const ownerName = await getOwnerDetails(business.owner);
            ownersData[business.owner] = ownerName;
          } catch (error) {
            console.error(`Error fetching owner details for ${business.owner}:`, error);
            ownersData[business.owner] = 'Unknown';
          }
        });
        
        await Promise.all(ownerPromises);
        setOwnersMap(ownersData);
      }
    } catch (err) {
      console.error("Error fetching referred businesses:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const profileData = await loadProfileData();
      
      if (profileData?.referral_code) {
        await loadBusinessData(profileData.referral_code);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error.message || 'There was an error loading the profile. Please try again later.'}</span>
            <Button onClick={handleRefresh} variant="outline" size="sm">Retry</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Alert>
          <AlertDescription>Profile not found. It may have been deleted or you don't have permission to view it.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const initials = `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`.toUpperCase();
  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                {profile.avatar_url && (
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={`${profile.first_name}'s avatar`}
                  />
                )}
                <AvatarFallback className="text-xl bg-primary/10">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {profile.first_name} {profile.last_name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {profile.user_type?.toUpperCase() || 'STAFF'}
                  </Badge>
                  <CardDescription className="text-base">
                    {profile?.phone || 'No phone number'}
                  </CardDescription>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="hidden md:block h-9 px-3  items-center gap-1"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
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
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <div className="w-full flex justify-between">
            <span>Member since: {joinDate}</span>
            <span>Last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</span>
          </div>
        </CardFooter>
      </Card>

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
              <div className="overflow-x-auto">
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
                    {referredBusinesses.map((business) => (
                      <TableRow key={business.id} className="hover:bg-secondary/10">
                        <TableCell className="font-medium">{business.name}</TableCell>
                        <TableCell>{business.businessTypeName || 'N/A'}</TableCell>
                        <TableCell>{business.totalLocations || 0}</TableCell>
                        <TableCell>{business.countryName || 'N/A'}</TableCell>
                        <TableCell>
                          <OwnerDisplayCell 
                            ownerName={
                              ownersMap[business.owner] || 'N/A'
                            } 
                          />
                        </TableCell>
                   
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16 bg-secondary/5 rounded-lg">
                <p className="text-muted-foreground mb-2">
                  No businesses have used your referral code yet
                </p>
                <p className="text-sm">
                  Share your referral code with potential business owners to start earning commissions
                </p>
              </div>
            )}
          </CardContent>
          {referredBusinesses && referredBusinesses.length > 0 && (
            <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Showing {referredBusinesses.length} businesses</span>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;