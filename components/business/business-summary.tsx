import React, { useMemo } from 'react'
import SummaryCard from './summary-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Business } from '@/types/business/types';

interface StatusData {
    name: string;
    value: number;
}

interface StatusAccumulator {
    [key: string]: StatusData;
}

interface BusinessWithLocations extends Business {
  allLocations: {
    subscriptionStatus: string;
  }[];
}

export default function BusinessSummary({ businesses }: { businesses: Business[] }) {
    const businessesWithLocations = businesses as BusinessWithLocations[];
    
    const metrics = useMemo(() => {
        // Basic counts
        const totalBusinesses = businesses.length;
        const businessesWithVFD = businesses.filter(bus => bus.vfdRegistrationState === true).length;
        const activeSubscription = businessesWithLocations.filter(bus => 
            bus.allLocations?.some(loc => loc.subscriptionStatus === 'OK')
        ).length;
        const trialSubscription = businessesWithLocations.filter(bus => 
            bus.allLocations?.some(loc => loc.subscriptionStatus === 'TRIAL')
        ).length;
        const almostDueSubscription = businessesWithLocations.filter(bus => 
            bus.allLocations?.some(loc => loc.subscriptionStatus === 'ALMOST_DUE')
        ).length;
        const dueSubscription = businessesWithLocations.filter(bus => 
            bus.allLocations?.some(loc => loc.subscriptionStatus === 'DUE')
        ).length;
        const expiredSubscription = businessesWithLocations.filter(bus => 
            bus.allLocations?.some(loc => loc.subscriptionStatus === 'EXPIRED')
        ).length;
        
       // Subscription status breakdown
       const subscriptionStatusData = businessesWithLocations.reduce<StatusAccumulator>((acc, bus) => {
        bus.allLocations?.forEach(loc => {
            const status = loc.subscriptionStatus || 'UNKNOWN';
            if (!acc[status]) {
                acc[status] = { name: status, value: 0 };
            }
            acc[status].value += 1;
        });
        return acc;
    }, {});
        
        //Business type distribution
        const businessTypeData = businesses.reduce<StatusAccumulator>((acc, bus) => {
          const type = bus.businessTypeName || 'Unknown';
          if (!acc[type]) {
            acc[type] = { name: type, value: 0 };
          }
          acc[type].value += 1;
          return acc;
        }, {});
            
        return {
          totalBusinesses,
          businessesWithVFD,
          activeSubscription, 
          trialSubscription,
          almostDueSubscription,
          dueSubscription, 
          expiredSubscription,
          businessTypeData: Object.values(businessTypeData),
          subscriptionStatusData: Object.values(subscriptionStatusData),
        };
      }, [businesses]);
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  return (
    <div className=" w-full p-2 space-y-6">
      <SummaryCard metrics={metrics}/>
       {/* Charts - First Row */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Status */}
        <Card className='hidden md:block lg:block'>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Distribution of subscription statuses on business locations</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.subscriptionStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.subscriptionStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Business Type */}
        <Card className='hidden md:block lg:block'>
          <CardHeader>
            <CardTitle>Business Type Distribution</CardTitle>
            <CardDescription>Breakdown of businesses by business type</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.businessTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.businessTypeData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
