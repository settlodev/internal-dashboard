'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Payment } from '@/types/location/type';

interface SubscriptionTypeData {
  [key: string]: {
    name: string;
    value: number;
    revenue: number;
    quantity: number;
    count: number;
  }
}

interface ProviderData {
  [key: string]: {
    name: string;
    revenue: number;
    value: number;
  }
}

interface TimeSeriesData {
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

const SubscriptionAnalytics = ({ 
  subscriptions, 
  dateRange,
  selectedFilters = {} 
}: { 
  subscriptions: Payment[], 
  dateRange: { from: Date; to: Date },
  selectedFilters?: Record<string, string>
}) => {
  // Filter subscriptions based on multiple criteria
  const filteredSubscriptions = subscriptions.filter(sub => {
    // Date range filter
    const isWithinDateRange = 
      new Date(sub.dateCreated) >= dateRange.from && 
      new Date(sub.dateCreated) <= dateRange.to;

    // Additional filters from selectedFilters
    const passesAdditionalFilters = Object.entries(selectedFilters).every(([key, value]) => 
      value === 'all' || sub[key as keyof Payment] === value
    );

    return isWithinDateRange && passesAdditionalFilters && sub.status === 'SUCCESS';
  });

  // Extract basic metrics
  const totalRevenue = filteredSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalSubscriptions = filteredSubscriptions.length;
  
  // Group by subscription type
  const subscriptionTypeData = filteredSubscriptions.reduce<SubscriptionTypeData>((acc, sub) => {
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
  const providerData = filteredSubscriptions.reduce<ProviderData>((acc, sub) => {
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
  const timeSeriesData = filteredSubscriptions.reduce<TimeSeriesData>((acc, sub) => {
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

  // Top businesses by revenue
  const businessData = filteredSubscriptions.reduce<BusinessData>((acc, sub) => {
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
            <p className='text-sm text-gray-500 mt-2'>Sum of all filtered successful subscription payments</p>
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
            <p className='text-sm text-gray-500 mt-2'>Number of filtered successful transactions</p>
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
            <p className='text-sm text-gray-500 mt-2'>Average amount per filtered subscription</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue By Package Type */}
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
                  {subscriptionTypeChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} TZS`} />
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
                  {providerChartData.map((_entry, index) => (
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

      {/* Rest of the component remains the same as in the previous version */}
      {/* ... (all the chart components) ... */}
    </div>
  );
};

export default SubscriptionAnalytics;