import React, { useMemo } from 'react'
import SummaryCard from './summary-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function BusinessSummary({ businesses }) {
    const metrics = useMemo(() => {
        // Basic counts
        const totalBusinesses = businesses.length;
        const businessesWithVFD = businesses.filter(bus => bus.vfdRegistrationState === true).length;
        const activeSubscription = businesses.filter(bus => 
            bus.allLocations.some(loc => loc.subscriptionStatus === 'OK')
        ).length;
        const trialSubscription = businesses.filter(bus => 
            bus.allLocations.some(loc => loc.subscriptionStatus === 'TRIAL')
        ).length;
        const expiredSubscription = businesses.filter(bus => 
            bus.allLocations.some(loc => loc.subscriptionStatus === 'EXPIRED')
        ).length;
        
       // Subscription status breakdown
       const subscriptionStatusData = businesses.reduce((acc, bus) => {
        // Iterate over each location in the business
        bus.allLocations.forEach(loc => {
            const status = loc.subscriptionStatus || 'UNKNOWN'; // Get the subscription status for the location
            if (!acc[status]) {
                acc[status] = { name: status, value: 0 }; 
            }
            acc[status].value += 1; // Increment the count for this status
        });
        return acc;
    }, {});
        
        //Business type distribution
        const businessTypeData = businesses.reduce((acc, bus) => {
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
          expiredSubscription,
          businessTypeData: Object.values(businessTypeData),
          subscriptionStatusData: Object.values(subscriptionStatusData),
        };
      }, [businesses]);
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  return (
    <div className=" w-full space-y-6">
      <SummaryCard metrics={metrics}/>
       {/* Charts - First Row */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Status */}
        <Card>
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
                  {metrics.subscriptionStatusData.map((entry, index) => (
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
        <Card>
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
                  {metrics.businessTypeData.map((entry, index) => (
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
