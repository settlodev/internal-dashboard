import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SummaryCard from './summary-card';
import { Location } from '@/types/location/type';

interface StatusData {
    name: string;
    value: number;
}

interface StatusAccumulator {
    [key: string]: StatusData;
}

interface Settings {
    useRecipe: boolean;
    usePasscode: boolean;
    useDepartments: boolean;
    useCustomPrice: boolean;
    useWarehouse: boolean;
    useShifts: boolean;
    useKds: boolean;
    ecommerceEnabled: boolean;
}

interface SettingsUsage {
    useRecipe: number;
    usePasscode: number;
    useDepartments: number;
    useCustomPrice: number;
    useWarehouse: number;
    useShifts: number;
    useKds: number;
    ecommerceEnabled: number;
}

const LocationsAnalyticsDashboard = ({ 
  locations,
 
 }: { 
  locations: Location[],
  
 }) => {
  // console.log(locations)
  // Derived metrics
  const metrics = useMemo(() => {
    // Basic counts
    const totalLocations = locations.length;
    const activeLocations = locations.filter(loc => loc.subscriptionStatus === 'OK').length;
    const expiredLocations = locations.filter(loc => loc.subscriptionStatus === 'EXPIRED').length;
    const trialLocations = locations.filter(loc => loc.subscriptionStatus === 'TRIAL').length;
    const almostDueLocations = locations.filter(loc => loc.subscriptionStatus === 'ALMOST_DUE').length;
    const dueLocations = locations.filter(loc => loc.subscriptionStatus === 'DUE').length;
    const inactiveLocations = totalLocations - activeLocations;
    
    // Subscription status breakdown
    const subscriptionStatusData = locations.reduce<StatusAccumulator>((acc, loc) => {
      const status = loc.subscriptionStatus || 'UNKNOWN';
      if (!acc[status]) {
        acc[status] = { name: status, value: 0 };
      }
      acc[status].value += 1;
      return acc;
    }, {});
    
    // Business type distribution
    const businessTypeData = locations.reduce<StatusAccumulator>((acc, loc) => {
      const type = loc.locationBusinessTypeName || 'Unknown';
      if (!acc[type]) {
        acc[type] = { name: type, value: 0 };
      }
      acc[type].value += 1;
      return acc;
    }, {});
    
    // Settings usage analytics
    const settingsUsage: SettingsUsage = {
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
        (Object.keys(settingsUsage) as Array<keyof Settings>).forEach(key => {
          if (loc.settings[key]) {
            settingsUsage[key] += 1;
          }
        });
      }
    });
    
    const settingsUsageData = (Object.keys(settingsUsage) as Array<keyof SettingsUsage>).map(key => ({
      name: key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('use ', '')
        .replace('Kds', 'KDS')
        .replace('ecommerce', 'E-commerce'),
      value: Number((settingsUsage[key] / totalLocations * 100).toFixed(1))
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
      almostDueLocations,
      dueLocations,
      inactiveLocations,
      subscriptionStatusData: Object.values(subscriptionStatusData),
      businessTypeData: Object.values(businessTypeData),
      settingsUsageData,
      operatingHoursChartData
    };
  }, [locations]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="w-full p-2 space-y-4 md:space-y-6">
  {/* Summary Cards */}
  <SummaryCard metrics={metrics} />
  
  {/* Charts - First Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
    {/* Subscription Status */}
    <Card className="hidden w-full lg:block">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Subscription Status</CardTitle>
        <CardDescription className="text-sm">Distribution of location subscription statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-64 md:h-72 p-2 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metrics.subscriptionStatusData}
              cx="50%"
              cy="50%"
              outerRadius={window?.innerWidth < 768 ? 60 : 80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => 
                window?.innerWidth < 640 
                  ? `${(percent * 100).toFixed(0)}%`
                  : `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {metrics.subscriptionStatusData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout={window?.innerWidth < 768 ? "horizontal" : "vertical"} 
                   align={window?.innerWidth < 768 ? "center" : "right"}
                   verticalAlign={window?.innerWidth < 768 ? "bottom" : "middle"} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    
    {/* Business Type */}
    <Card className="hidden w-full lg:block">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Business Type Distribution</CardTitle>
        <CardDescription className="text-sm">Breakdown of locations by business type</CardDescription>
      </CardHeader>
      <CardContent className="h-64 md:h-72 p-2 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metrics.businessTypeData}
              cx="50%"
              cy="50%"
              outerRadius={window?.innerWidth < 768 ? 60 : 80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => 
                window?.innerWidth < 640 
                  ? `${(percent * 100).toFixed(0)}%`
                  : `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {metrics.businessTypeData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout={window?.innerWidth < 768 ? "horizontal" : "vertical"}
                   align={window?.innerWidth < 768 ? "center" : "right"}
                   verticalAlign={window?.innerWidth < 768 ? "bottom" : "middle"} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
  
  {/* Charts - Second Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
    {/* Feature Usage */}
    <Card className="hidden w-full lg:block">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Feature Adoption Rate</CardTitle>
        <CardDescription className="text-sm">Percentage of locations using each feature</CardDescription>
      </CardHeader>
      <CardContent className="h-64 md:h-80 p-2 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={metrics.settingsUsageData}
            margin={window?.innerWidth < 768 
              ? { top: 5, right: 20, left: 50, bottom: 5 }
              : { top: 5, right: 30, left: 80, bottom: 5 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" 
                  tick={{ fontSize: window?.innerWidth < 640 ? 10 : 12 }} />
            <YAxis dataKey="name" type="category" 
                  width={window?.innerWidth < 768 ? 50 : 80} 
                  tick={{ fontSize: window?.innerWidth < 640 ? 10 : 12 }} />
            <Tooltip formatter={(value) => [`${value}%`, 'Adoption Rate']} />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    
    {/* Operating Hours */}
    <Card className="hidden w-full lg:block">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Operating Hours</CardTitle>
        <CardDescription className="text-sm">Distribution of business operating schedules</CardDescription>
      </CardHeader>
      <CardContent className="h-64 md:h-80 p-2 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metrics.operatingHoursChartData}
              cx="50%"
              cy="50%"
              outerRadius={window?.innerWidth < 768 ? 60 : 80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => 
                window?.innerWidth < 640 
                  ? `${(percent * 100).toFixed(0)}%`
                  : `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {metrics.operatingHoursChartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout={window?.innerWidth < 768 ? "horizontal" : "vertical"}
                   align={window?.innerWidth < 768 ? "center" : "right"}
                   verticalAlign={window?.innerWidth < 768 ? "bottom" : "middle"} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
</div>
  );
};

export default LocationsAnalyticsDashboard;
