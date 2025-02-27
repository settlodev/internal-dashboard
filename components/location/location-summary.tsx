import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SummaryCard from './summary-card';
import { Location } from '@/types/location/type';

const LocationsAnalyticsDashboard = ({ locations }: { locations: Location[] }) => {
  // Derived metrics
  const metrics = useMemo(() => {
    // Basic counts
    const totalLocations = locations.length;
    const activeLocations = locations.filter(loc => loc.subscriptionStatus === 'OK').length;
    const expiredLocations = locations.filter(loc => loc.subscriptionStatus === 'EXPIRED').length;
    const trialLocations = locations.filter(loc => loc.subscriptionStatus === 'TRIAL').length;
    console.log(activeLocations)
    const inactiveLocations = totalLocations - activeLocations;
    
    // Subscription status breakdown
    const subscriptionStatusData = locations.reduce((acc, loc) => {
      const status = loc.subscriptionStatus || 'UNKNOWN';
      if (!acc[status]) {
        acc[status] = { name: status, value: 0 };
      }
      acc[status].value += 1;
      return acc;
    }, {});
    
    // Business type distribution
    const businessTypeData = locations.reduce((acc, loc) => {
      const type = loc.locationBusinessTypeName || 'Unknown';
      if (!acc[type]) {
        acc[type] = { name: type, value: 0 };
      }
      acc[type].value += 1;
      return acc;
    }, {});
    
    // Settings usage analytics
    const settingsUsage = {
      useRecipe: 0,
      usePasscode: 0,
      useDepartments: 0,
      useCustomPrice: 0,
      useWarehouse: 0,
      useShifts: 0,
      useKds: 0,
      ecommerceEnabled: 0
    };
    
    locations.forEach(loc => {
      if (loc.settings) {
        Object.keys(settingsUsage).forEach(key => {
          if (loc.settings[key]) {
            settingsUsage[key] += 1;
          }
        });
      }
    });
    
    const settingsUsageData = Object.keys(settingsUsage).map(key => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('use ', '').replace('Kds', 'KDS').replace('ecommerce', 'E-commerce'),
      value: (settingsUsage[key] / totalLocations * 100).toFixed(1)
    })).sort((a, b) => b.value - a.value);
    
    // Operating hours analysis
    const operatingHoursData = {
      '24hours': 0,
      'standard': 0,
      'extended': 0,
      'custom': 0
    };
    
    locations.forEach(loc => {
      if (loc.openingTime === '00:00:00' && loc.closingTime === '23:59:00') {
        operatingHoursData['24hours'] += 1;
      } else if (loc.openingTime === '08:00:00' && loc.closingTime === '17:00:00') {
        operatingHoursData['standard'] += 1;
      } else if (loc.openingTime >= '06:00:00' && loc.closingTime <= '20:00:00') {
        operatingHoursData['extended'] += 1;
      } else {
        operatingHoursData['custom'] += 1;
      }
    });
    
    const operatingHoursChartData = [
      { name: '24 Hours', value: operatingHoursData['24hours'] },
      { name: 'Standard (8-5)', value: operatingHoursData['standard'] },
      { name: 'Extended', value: operatingHoursData['extended'] },
      { name: 'Custom', value: operatingHoursData['custom'] }
    ].filter(item => item.value > 0);

    return {
      totalLocations,
      activeLocations,
      expiredLocations,
      trialLocations,
      inactiveLocations,
      subscriptionStatusData: Object.values(subscriptionStatusData),
      businessTypeData: Object.values(businessTypeData),
      settingsUsageData,
      operatingHoursChartData
    };
  }, [locations]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className=" w-full space-y-6">
      {/* Summary Cards */}
        <SummaryCard metrics={metrics} />
        
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Distribution of location subscription statuses</CardDescription>
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
            <CardDescription>Breakdown of locations by business type</CardDescription>
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
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Adoption Rate</CardTitle>
            <CardDescription>Percentage of locations using each feature</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.settingsUsageData}
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Adoption Rate']} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
            <CardDescription>Distribution of business operating schedules</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.operatingHoursChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.operatingHoursChartData.map((entry, index) => (
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
  );
};

export default LocationsAnalyticsDashboard;
