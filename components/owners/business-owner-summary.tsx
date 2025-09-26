'use client'
import React, { useMemo } from 'react'
import SummaryCard from './summary-card';
import { Owner } from '@/types/owners/type';

export default function BusinessOwnerSummary({ 
  owners,
  dateRange,
  selectedFilters = {}
 }: { 
  owners: Owner[]
  dateRange: { from: Date; to: Date }
  selectedFilters?: Record<string, string>
}) {

  console.log("The owner summary is",owners)
  
  const filteredOwners = owners.filter(own => {
    // Date range filter
    const isWithinDateRange = 
      new Date(own.dateCreated) >= dateRange.from && 
      new Date(own.dateCreated) <= dateRange.to;

    // Additional filters from selectedFilters
    const passesAdditionalFilters = Object.entries(selectedFilters).every(([key, value]) => {
      if (value === 'all') return true;
      
      if (key === 'isMigrated') {
        // Convert string "true"/"false" to boolean
        return own[key as keyof Owner] === (value === "true");
      }
      
      return own[key as keyof Owner] === value;
    });

    return isWithinDateRange && passesAdditionalFilters && own.isOwner === true;
  });
  

    
    const metrics = useMemo(() => {
        // Basic counts
        const totalBusinessesOwners = filteredOwners.length;
        
       

        // Gender distribution
      const genderDistribution = filteredOwners.reduce((acc, owner) => {
        acc[owner.gender] = (acc[owner.gender] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Profile completion
  const businessCompleted = filteredOwners.filter(owner => owner.businessComplete).length;
  const businessCompletePercentage = (businessCompleted / totalBusinessesOwners) * 100;
  const locationCompleted = filteredOwners.filter(owner => owner.locationComplete).length;
  const locationCompletePercentage = (locationCompleted / totalBusinessesOwners) * 100;
  const fullyCompleted = filteredOwners.filter(owner => owner.businessComplete && owner.locationComplete).length;
  const fullyCompletedPercentage = (fullyCompleted / totalBusinessesOwners) * 100;

   // Email verification status
   const emailVerified = filteredOwners.filter(owner => owner.emailVerified).length;
   const emailVerifiedPercentage = (emailVerified / totalBusinessesOwners) * 100;

  // Referral stats
  const referredOwners = filteredOwners.filter(owner => owner.referredByCode).length;
  const referralPercentage = (referredOwners / totalBusinessesOwners) * 100;

  
  // Migration stats
  const migratedAccounts = filteredOwners.filter(owner => owner.isMigrated).length;
  const migratedPercentage = (migratedAccounts / totalBusinessesOwners) * 100;
  // console.log("The migrated percent is ",migratedPercentage)

  //New Businesses
  const newBusinesses = totalBusinessesOwners - migratedAccounts;  
  const newBusinessesPercentage = (newBusinesses / totalBusinessesOwners) * 100;
      
      // Calculate country distribution
  const countryDistribution = filteredOwners.reduce((acc, owner) => {
    acc[owner.countryName] = (acc[owner.countryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
            
        return {
          totalBusinessesOwners,
          genderDistribution,
          businessCompleted,
          businessCompletePercentage,
          locationCompleted,
          locationCompletePercentage,
          fullyCompleted,
          fullyCompletedPercentage,
          countryDistribution,
          emailVerified,
          emailVerifiedPercentage,
          referredOwners,
          referralPercentage,
          migratedAccounts,
          migratedPercentage,
          newBusinesses,
          newBusinessesPercentage
          
        };
      }, [filteredOwners, dateRange, selectedFilters]);
    
  return (
    <div className=" w-full p-2 space-y-6">
      <SummaryCard metrics={metrics}/>
       
    </div>
  )
}
