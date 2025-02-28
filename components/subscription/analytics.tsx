import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, TrendingUp, Users, DollarSign, Calendar, Award } from 'lucide-react';
import { Payment } from '@/types/location/type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add date filter options
const dateFilters = {
  today: 'Today',
  yesterday: 'Yesterday',
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
} as const;

type DateFilterType = keyof typeof dateFilters;

interface SubscriptionTypeData {
  [key: string]: {
    name: string;
    value: number;
    revenue: number;
    quantity: number;
    count: number;
  }
}
interface ProviderData{
  [key: string]: {
    name: string;
    revenue: number;
    value: number;
  }
}
interface TimeSeriesData{
  [key: string]: {
    date: string;
    revenue: number;
    subscriptions: number;
  }
}
interface BusinessData {
  [key: string]: {
    name: string;
    revenue: number;
    quantity: number;
  }
}
const SubscriptionAnalytics = ({ subscriptions }: { subscriptions: Payment[] }) => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');

  // Filter data based on selected date range
  const filterDataByDate = (data: Payment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return data.filter(sub => {
      const date = new Date(sub.dateCreated);
      
      switch (dateFilter) {
        case 'today':
          return date >= today;
        case 'yesterday':
          return date >= yesterday && date < today;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - 7);
          return date >= weekStart;
        case 'month':
          const monthStart = new Date(today);
          monthStart.setMonth(today.getMonth() - 1);
          return date >= monthStart;
        case 'year':
          const yearStart = new Date(today);
          yearStart.setFullYear(today.getFullYear() - 1);
          return date >= yearStart;
        default:
          return true;
      }
    });
  };

  // Filter only SUCCESS status transactions and apply date filter
  const successSubscriptions = filterDataByDate(
    subscriptions.filter(sub => sub.status === 'SUCCESS')
  );
  
  // Extract basic metrics
  const totalRevenue = successSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalSubscriptions = successSubscriptions.length;
  const totalQuantity = successSubscriptions.reduce((sum, sub) => sum + sub.quantity, 0);
  const uniqueBusinesses = [...new Set(successSubscriptions.map(sub => sub.business))].length;
  const uniqueLocations = [...new Set(successSubscriptions.map(sub => sub.location))].length;
  
  // Group by subscription type
  const subscriptionTypeData = successSubscriptions.reduce<SubscriptionTypeData>((acc, sub) => {
    const type = sub.subscriptionPackageName;
    if (!acc[type]) {
      acc[type] = {
        name: type,
        value: 0,
        revenue: 0,
        quantity: 0,
        count: 0
      };
    }
    acc[type].value++;
    acc[type].revenue += sub.amount;
    acc[type].quantity += sub.quantity;
    acc[type].count++;
    return acc;
  }, {});
  
  const subscriptionTypeChartData = Object.values(subscriptionTypeData);
  
  // Group by payment provider
  const providerData = successSubscriptions.reduce<ProviderData>((acc, sub) => {
    const provider = sub.provider;
    if (!acc[provider]) {
      acc[provider] = {
        name: provider,
        value: 0,
        revenue: 0
      };
    }
    acc[provider].value++;
    acc[provider].revenue += sub.amount;
    return acc;
  }, {});
  
  const providerChartData = Object.values(providerData);
  
  // Group by day for time series
  const timeSeriesData = successSubscriptions.reduce<TimeSeriesData>((acc, sub) => {
    const date = new Date(sub.dateCreated);
    const formattedDate = date.toLocaleDateString('en-GB', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    if (!acc[formattedDate]) {
      acc[formattedDate] = {
        date: formattedDate,
        revenue: 0,
        subscriptions: 0
      };
    }
    acc[formattedDate].revenue += sub.amount;
    acc[formattedDate].subscriptions += 1;
    return acc;
  }, {});

  const timeSeriesChartData = Object.values(timeSeriesData)
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateB.getTime() - dateA.getTime(); // Reverse sort (newest first)
    });
  console.log(timeSeriesChartData)
  
  // Top businesses by revenue
  const businessData = successSubscriptions.reduce<BusinessData>((acc, sub) => {
    const businessName = sub.locationName; 
    if (!acc[businessName]) {
      acc[businessName] = {
        name: businessName,
        revenue: 0,
        quantity: 0
      };
    }
    acc[businessName].revenue += sub.amount;
    acc[businessName].quantity += sub.quantity;
    return acc;
  }, {});

  const topBusinessesData = Object.values(businessData)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Average deal size
  const averageDealSize = totalRevenue / totalSubscriptions || 0;
  
  return (
    <div className="space-y-6">
      {/* Add Date Filter */}
      <div className="flex justify-end">
        <Select
          value={dateFilter}
          onValueChange={(value: DateFilterType) => setDateFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(dateFilters).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">{(totalRevenue).toLocaleString()} TZS</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className='text-sm text-gray-500 mt-2'>Sum of all successful subscription payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Subscriptions</p>
                <h3 className="text-2xl font-bold">{totalSubscriptions}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className='text-sm text-gray-500 mt-2'>Number of successful transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Deal Size</p>
                <h3 className="text-2xl font-bold">{Math.round(averageDealSize).toLocaleString()} TZS</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              
            </div>
            <p className='text-sm text-gray-500 mt-2'>Average amount per subscription</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue By Package Type */}
        {/* <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue by Package Type</CardTitle>
            <CardDescription>Distribution of revenue across subscription packages</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionTypeChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {subscriptionTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} TZS`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

<Card className="col-span-1">
  <CardHeader>
    <CardTitle>Revenue by Package Type</CardTitle>
    <CardDescription>Distribution of revenue across subscription packages</CardDescription>
  </CardHeader>
  <CardContent className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={subscriptionTypeChartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="revenue"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {subscriptionTypeChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toLocaleString()} TZS`} />
        {/* <Legend /> */}
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
  {/* Custom detailed legend */}
  <div className="px-6 pb-6">
    <div className="mt-2 space-y-2">
      {subscriptionTypeChartData.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-sm" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="font-medium">{entry.name}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{entry.count}</span> subscriptions
            <span className="mx-1">•</span>
            <span className="font-medium text-foreground">{entry.revenue.toLocaleString()}</span> TZS
          </div>
        </div>
      ))}
    </div>
  </div>
</Card>
        
        {/* Subscriptions Over Time */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Subscriptions Over Time</CardTitle>
            <CardDescription>Trend of subscription activity and revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return `${Number(value).toLocaleString()} TZS`;
                    return value;
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="subscriptions" 
                  stroke="#8884d8" 
                  name="Subscriptions"
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d" 
                  name="Revenue"
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Provider Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Payment Provider Distribution</CardTitle>
            <CardDescription>Breakdown of subscriptions by payment method</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {providerChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Top Locations by Revenue */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Locations by Revenue</CardTitle>
            <CardDescription>Highest revenue generating locations</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBusinessesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} TZS`} />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Quantity of Subscriptions</p>
                <h3 className="text-2xl font-bold">{totalQuantity}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unique Businesses count</p>
                <h3 className="text-2xl font-bold">{uniqueBusinesses}</h3>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unique Locations count</p>
                <h3 className="text-2xl font-bold">{uniqueLocations}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <ArrowUpCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default SubscriptionAnalytics;