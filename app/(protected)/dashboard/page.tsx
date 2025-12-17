'use client'
import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Calendar, Users, Building2, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {getDashboardSummaries} from "@/lib/actions/report";
import {SummaryResponse} from "@/types/dashboard/type";


function CustomTooltip({ active, payload, label }: { active: boolean; payload: any,label: string }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">{label}</p>
                {payload.map((entry:any, index:number) => (
                    <div key={index} className="flex items-center justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-gray-600">{entry.name}:</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

function GrowthBarChart({ userData, businessData, locationData }:{userData:any,businessData:any, locationData:any}) {
    const chartData = userData.map((item:any, index:number) => {
        const dateParts = item.endOfMonth.split('T')[0].split('-');
        const year = dateParts[0];
        const month = parseInt(dateParts[1]);
        const monthName = new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'short' });

        return {
            name: `${monthName} '${year.slice(2)}`,
            Users: item.amount,
            Businesses: businessData[index]?.amount || 0,
            Locations: locationData[index]?.amount || 0
        };
    });

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip active={false} payload={undefined} label={""} />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                />
                <Bar
                    dataKey="Users"
                    fill="#3b82f6"
                    name="Users"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                />
                <Bar
                    dataKey="Businesses"
                    fill="#f97316"
                    name="Businesses"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                />
                <Bar
                    dataKey="Locations"
                    fill="#22c55e"
                    name="Locations"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default function DashboardSummaryPage() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const formatDateForInput = (date:Date) => {
        return date.toISOString().split('T')[0];
    };

    const formatTimeForInput = (date:Date) => {
        return date.toTimeString().split(' ')[0].substring(0, 5);
    };

    const formatDateTimeForAPI = (dateString:any, timeString:any) => {
        return `${dateString}T${timeString}Z`;
    };

    const [startDate, setStartDate] = useState(formatDateForInput(firstDayOfMonth));
    const [startTime, setStartTime] = useState('00:00');
    const [endDate, setEndDate] = useState(formatDateForInput(currentDate));
    const [endTime, setEndTime] = useState(formatTimeForInput(currentDate));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dashboardSummary, setDashboardSummary] = useState<SummaryResponse>();

    const fetchDashboardData = async ():Promise<any> => {
        setLoading(true);
        setError('');

        try {
            const start = startDate || formatDateForInput(firstDayOfMonth);
            const end = endDate || formatDateForInput(currentDate);
            const startT = startTime || '00:00';
            const endT = endTime || formatTimeForInput(currentDate);

            const startDateTime = new Date(`${start}T${startT}`);
            const endDateTime = new Date(`${end}T${endT}`);

            if (startDateTime > endDateTime) {
                setError('Start date and time cannot be after end date and time');
                setLoading(false);
                return;
            }

            const formattedStart = formatDateTimeForAPI(start, startT);
            const formattedEnd = formatDateTimeForAPI(end, endT);

            const dashboardSummaryResult = await getDashboardSummaries(formattedStart, formattedEnd);
            setDashboardSummary(dashboardSummaryResult);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again.');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatDateRange = () => {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        // @ts-ignore
        return `${start.toLocaleString('en-US', options)} - ${end.toLocaleString('en-US', options)}`;
    };

    const formatNumber = (num:number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const calculatePeriodTotal = (monthlyData:any) => {
        return monthlyData.reduce((sum:number, item:any) => sum + item.amount, 0);
    };

    const hasData = dashboardSummary && dashboardSummary.monthlyUsersCreated.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Registration Analytics</h1>
                            <p className="text-gray-600 mt-1">Track user registrations, business creation, and location expansion</p>
                        </div>

                        {/* Date Range Filter */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={18} className="text-gray-600" />
                                <label className="text-sm font-semibold text-gray-700">
                                    Reporting Period
                                </label>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={endDate || formatDateForInput(currentDate)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        max={formatDateForInput(currentDate)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    onClick={fetchDashboardData}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap h-[42px]"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Apply Filter
                                </button>
                            </div>

                            {!loading && hasData && (
                                <div className="mt-3 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
                                    <span className="font-medium">Showing data for:</span> {formatDateRange()}
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="text-red-800 font-medium">Error Loading Data</p>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
                            <p className="text-gray-600">Loading dashboard data...</p>
                        </div>
                    </div>
                ) : !hasData ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <TrendingUp className="text-gray-400 mx-auto mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                        <p className="text-gray-600">No growth data found for the selected period.</p>
                        <p className="text-sm text-gray-500 mt-2">{formatDateRange()}</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Users Card */}
                            <div className="bg-white rounded-xl p-3">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <Users className="text-blue-600" size={24} />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-600">Users Registered</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-bold text-gray-900">
                                                {formatNumber(calculatePeriodTotal(dashboardSummary.monthlyUsersCreated))}
                                            </p>
                                            <p className="text-xs text-gray-500">in selected period</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Avg: {formatNumber(Math.round(calculatePeriodTotal(dashboardSummary.monthlyUsersCreated) / dashboardSummary.monthlyUsersCreated.length))} per month
                                    </p>
                                </div>
                            </div>

                            {/* Businesses Card */}
                            <div className="bg-white rounded-xl shadow-sm p-3">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-orange-100 p-2 rounded-lg">
                                                <Building2 className="text-orange-600" size={24} />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-600">Businesses Created</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-bold text-gray-900">
                                                {formatNumber(calculatePeriodTotal(dashboardSummary.monthlyBusinessesCreated))}
                                            </p>
                                            <p className="text-xs text-gray-500">in selected period</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Total: {formatNumber(dashboardSummary.totalBusinesses)} businesses
                                    </p>
                                </div>
                            </div>

                            {/* Locations Card */}
                            <div className="bg-white rounded-xl shadow-sm p-3">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <MapPin className="text-green-600" size={24} />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-600">Locations/Branches Created</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-bold text-gray-900">
                                                {formatNumber(calculatePeriodTotal(dashboardSummary.monthlyLocationsCreated))}
                                            </p>
                                            <p className="text-xs text-gray-500">in selected period</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Total: {formatNumber(dashboardSummary.totalLocations)} locations
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Growth Chart */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">Monthly Growth Trends</h2>
                                <p className="text-sm text-gray-600">Comparison of user registrations, businesses, and locations created over time</p>
                            </div>
                            <GrowthBarChart
                                userData={dashboardSummary.monthlyUsersCreated}
                                businessData={dashboardSummary.monthlyBusinessesCreated}
                                locationData={dashboardSummary.monthlyLocationsCreated}
                            />
                        </div>

                        {/* Detailed Monthly Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-blue-700">Users</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-orange-700">Businesses</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-green-700">Locations</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dashboardSummary.monthlyUsersCreated.map((item:any, index:number) => {
                                        const dateParts = item.endOfMonth.split('T')[0].split('-');
                                        const year = dateParts[0];
                                        const month = parseInt(dateParts[1]);
                                        const monthName = new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'long' });

                                        return (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-900 font-medium">{monthName} {year}</td>
                                                <td className="py-3 px-4 text-right text-blue-600 font-semibold">
                                                    {formatNumber(item.amount)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-orange-600 font-semibold">
                                                    {formatNumber(dashboardSummary.monthlyBusinessesCreated[index]?.amount || 0)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-green-600 font-semibold">
                                                    {formatNumber(dashboardSummary.monthlyLocationsCreated[index]?.amount || 0)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                                        <td className="py-3 px-4 text-gray-900">Total</td>
                                        <td className="py-3 px-4 text-right text-blue-700">
                                            {formatNumber(calculatePeriodTotal(dashboardSummary.monthlyUsersCreated))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-orange-700">
                                            {formatNumber(calculatePeriodTotal(dashboardSummary.monthlyBusinessesCreated))}
                                        </td>
                                        <td className="py-3 px-4 text-right text-green-700">
                                            {formatNumber(calculatePeriodTotal(dashboardSummary.monthlyLocationsCreated))}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}