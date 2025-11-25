import React from 'react';
import { UserSummary } from '@/types/owners/summary';
import {ProfileHeader} from "@/components/owners/profileHeader";
import {ProfileSummaryCard} from "@/components/owners/profileSummaryCard";
import {AccountStatusCard} from "@/components/owners/accountStatusCard";
import {PersonalInfoCard} from "@/components/owners/personalInformationCard";
import {LocationCard} from "@/components/owners/locationCard";
import {AccountInfoCard} from "@/components/owners/accountCard";
import {BusinessInfoCard} from "@/components/owners/businessInfoCard";
import {FeedbackThread} from "@/components/follow-ups/feedbackThread";

interface ProfileDisplayProps {
    businessOwner: UserSummary;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ businessOwner }) => {
    return (
        <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
            <ProfileHeader businessOwner={businessOwner} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 space-y-6">
                    <ProfileSummaryCard businessOwner={businessOwner} />
                    <AccountStatusCard businessOwner={businessOwner} />
                </div>

                <div className="xl:col-span-2 space-y-6">
                    <PersonalInfoCard businessOwner={businessOwner} />
                    <LocationCard businessOwner={businessOwner} />
                    <AccountInfoCard businessOwner={businessOwner} />
                    <BusinessInfoCard businessOwner={businessOwner} />
                    <FeedbackThread userId={businessOwner.userDetails.id} />
                </div>
            </div>
        </div>
    );
};