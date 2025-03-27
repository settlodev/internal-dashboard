'use client'
import { ProtectedComponent } from "@/components/auth/protectedComponent";
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import Loading from "@/components/widgets/loader";
import { getDashboardSummaries } from "@/lib/actions/dashboard-actions";
import { SummaryResponse } from "@/types/dashboard/type";
import { useEffect, useState } from "react";
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserIcon, MapPinIcon, UserPlusIcon, UserMinusIcon, MinusIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import Unauthorized from "@/components/code/401";
import { DatePickerWithRange } from "@/components/widgets/date-range-picker";
import { DateRange } from "react-day-picker";


const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
]

export default function Dashboard() {
    const [stats, setStats] = useState<SummaryResponse >();
    const [isLoading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
        to: new Date()
      });
    

      const getSummary = async (dateRange?: DateRange) => {
        setLoading(true);
        try {
          const data = await getDashboardSummaries(
            dateRange?.from,
            dateRange?.to
          );
          console.log("The data is", data)
          setStats(data as SummaryResponse);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          // toast.error("Failed to load dashboard data");
        } finally {
          setLoading(false);
        }
      };

    const handleDateChange = (newDateRange: DateRange) => {
        setDateRange(newDateRange);
        getSummary(newDateRange);
      };

    useEffect(() => {
        getSummary();
    }, []);

    // Calculate growth rates and trends
    const calculateGrowth = (currentMonth: number, previousMonth: number) => {
        if (!previousMonth) return 0;
        return ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
    };

    const userGrowth = stats?.monthlyUsersCreated && stats.monthlyUsersCreated.length > 1 
        ? calculateGrowth(
            stats.monthlyUsersCreated[stats.monthlyUsersCreated.length - 1].amount, 
            stats.monthlyUsersCreated[stats.monthlyUsersCreated.length - 2].amount
          ) 
        : 0;

    const businessGrowth = stats?.monthlyBusinessesCreated && stats.monthlyBusinessesCreated.length > 1 
        ? calculateGrowth(
            stats.monthlyBusinessesCreated[stats.monthlyBusinessesCreated.length - 1].amount, 
            stats.monthlyBusinessesCreated[stats.monthlyBusinessesCreated.length - 2].amount
          ) 
        : 0;

    const locationGrowth = stats?.monthlyLocationsCreated && stats.monthlyLocationsCreated.length > 1 
        ? calculateGrowth(
            stats.monthlyLocationsCreated[stats.monthlyLocationsCreated.length - 1].amount, 
            stats.monthlyLocationsCreated[stats.monthlyLocationsCreated.length - 2].amount
          ) 
        : 0;

    const activeSubscriptionPercentage = stats 
        ? Math.round((stats.totalActiveSubscriptions / (stats.totalSubscriptions || 1)) * 100) 
        : 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <ProtectedComponent 
            requiredPermission="view:analytics" 
            fallback={<Unauthorized />}
        >
            <div className="flex flex-col space-y-6 md:p-8 p-4 w-full bg-gray-50 min-h-screen">
                {/* Header section with breadcrumb and date filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 md:max-w-md">
                        <BreadcrumbNav items={breadcrumbItems} />
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">Quick Analytics</h1>
                    </div>
                    <DatePickerWithRange
                     value={dateRange}
                     onChange={handleDateChange}
                     />
                </div>

                {/* Summary metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        trend={Number(userGrowth)}
                        icon={<UserIcon className="h-6 w-6 text-blue-500" />}
                        className="bg-blue-50" trendLabel={""} secondaryLabel={""}                    />
                    <MetricCard 
                        title="Total Businesses"
                        value={stats?.totalBusinesses || 0}
                        trend={Number(businessGrowth)}
                        icon={<MapPinIcon className="h-6 w-6 text-purple-500" />}
                        className="bg-purple-50" trendLabel={""} secondaryLabel={""}                    />
                    <MetricCard 
                        title="Total Locations"
                        value={stats?.totalLocations || 0}
                        trend={Number(locationGrowth)}
                        icon={<MapPinIcon className="h-6 w-6 text-red-500" />}
                        className="bg-red-50" trendLabel={""} secondaryLabel={""}                    />
                    <MetricCard 
                        title="Active Subscriptions"
                        value={stats?.totalActiveSubscriptions || 0}
                        trend={activeSubscriptionPercentage}
                        trendLabel="of total"
                        icon={<MapPinIcon className="h-6 w-6 text-green-500" />}
                        className="bg-green-50" secondaryLabel={""}                    />
                </div>

                {/* Subscription status section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow col-span-2">
                        <h2 className="text-lg font-semibold mb-4">Monthly Growth Trends</h2>
                        <UserGrowthLineChart 
                            userData={stats?.monthlyUsersCreated || []} 
                            businessData={stats?.monthlyBusinessesCreated || []}
                            locationData={stats?.monthlyLocationsCreated || []}
                        />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Subscription Status</h2>
                        <SubscriptionPieChart 
                            activeSubscriptions={stats?.totalActiveSubscriptions || 0}
                            inactiveSubscriptions={stats?.totalInActiveSubscriptions || 0}
                        />
                        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-500">Active Users</p>
                                <p className="text-xl font-bold text-emerald-600">{stats?.totalUsersWithActiveSubscriptions || 0}</p>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <p className="text-sm text-gray-500">Inactive Users</p>
                                <p className="text-xl font-bold text-red-600">{stats?.totalUsersWithInActiveSubscriptions || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                

                {/* Additional metrics section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard 
                        title="Users with Active Sub"
                        value={stats?.totalUsersWithActiveSubscriptions || 0}
                        secondaryLabel={`${((stats?.totalUsersWithActiveSubscriptions || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% of total users`}
                        icon={<UserPlusIcon className="h-6 w-6 text-green-500" />}
                        className="bg-white" trend={0} trendLabel={""}                    />
                    <MetricCard 
                        title="Users with Inactive Sub"
                        value={stats?.totalUsersWithInActiveSubscriptions || 0}
                        secondaryLabel={`${((stats?.totalUsersWithInActiveSubscriptions || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% of total users`}
                        icon={<UserMinusIcon className="h-6 w-6 text-orange-500" />}
                        className="bg-white" trend={0} trendLabel={""}                    />
                    <MetricCard 
                        title="Total Subscriptions"
                        value={stats?.totalSubscriptions || 0}
                        secondaryLabel={`${((stats?.totalSubscriptions || 0) / (stats?.totalUsers || 1)).toFixed(1)} per user`}
                        icon={<MapPinIcon className="h-6 w-6 text-indigo-500" />}
                        className="bg-white" trend={0} trendLabel={""}                    />
                </div>
            </div>
        </ProtectedComponent>
    );
}


function MetricCard({ title, value, trend, trendLabel = "growth", secondaryLabel, icon, className = "" }:{title: string, value: number, trend: number, trendLabel: string, secondaryLabel: string, icon: any, className: string}) {
    const isTrendPositive = trend > 0;
    const isTrendNeutral = trend === 0;
    
    return (
        <div className={`p-4 rounded-lg shadow ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded-full bg-white/50">{icon}</div>
            </div>
            {trend !== undefined && (
                <div className="mt-4 flex items-center">
                    {isTrendNeutral ? (
                        <MinusIcon className="h-4 w-4 text-gray-500 mr-1" />
                    ) : isTrendPositive ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${isTrendNeutral ? 'text-gray-500' : isTrendPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(trend)}% {trendLabel}
                    </span>
                </div>
            )}
            {secondaryLabel && <p className="mt-2 text-xs text-gray-500">{secondaryLabel}</p>}
        </div>
    );
}

// Combined line chart component
function UserGrowthLineChart({ userData, businessData, locationData }: { userData: any[], businessData: any[], locationData: any[] }) {
    // Format data for chart
    const chartData = userData.map((item, index) => {
      
        const dateParts = item.endOfMonth.split('T')[0].split('-');
        const year = dateParts[0];
        const month = parseInt(dateParts[1]); 
        
        // Get month name using the numeric month (subtract 1 as JavaScript months are 0-indexed)
        const monthName = new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'short' });
        
        return {
            name: `${monthName} ${year}`,
            Users: item.amount,
            Businesses: businessData[index]?.amount || 0,
            Locations: locationData[index]?.amount || 0
        };
    });

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Users" fill="#3b82f6" name="Users"/>
                <Bar dataKey="Businesses" fill="#F97415" name="Businesses"/>
                <Bar dataKey="Locations" fill="#22C55E" name="Locations"/>
            </BarChart>
        </ResponsiveContainer>
    );
}

// Subscription pie chart
function SubscriptionPieChart({ activeSubscriptions, inactiveSubscriptions }: { activeSubscriptions: number, inactiveSubscriptions: number }) {
    const data = [
        { name: 'Active', value: activeSubscriptions, color: '#22C55E' },
        { name: 'Inactive', value: inactiveSubscriptions, color: '#EF4445' }
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Subscriptions']} />
            </PieChart>
        </ResponsiveContainer>
    );
}