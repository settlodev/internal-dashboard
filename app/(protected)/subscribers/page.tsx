'use client'
import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, Activity, Calendar } from 'lucide-react';
import {subscribersReport} from "@/lib/actions/report";
import {SubscriberData} from "@/types/subscription/type";
import Loading from "@/components/widgets/loader";

export default function SubscriberReport() {
    const getCurrentMonthYear = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const [dateRange, setDateRange] = useState(getCurrentMonthYear());
    const [subscriberData, setSubscriberData] = useState<SubscriberData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [year, month] = dateRange.split('-');
                const data = await subscribersReport(parseInt(month), parseInt(year));
                setSubscriberData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch subscriber data');
                console.error('Error fetching subscriber data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const calculatePercentage = (part: any, total: any) => {
        return total > 0 ? ((part / total) * 100).toFixed(1) : '0.0';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loading/>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
                    <div className="text-red-600 mb-4">
                        <UserX className="w-12 h-12 mx-auto mb-2" />
                        <h2 className="text-xl font-semibold">Error Loading Data</h2>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!subscriberData) return null;

    const totalSubscribers = subscriberData.activeSubscribers + subscriberData.inactiveSubscribers;
    const activeRate = calculatePercentage(subscriberData.activeSubscribers, totalSubscribers);
    const inactiveRate = calculatePercentage(subscriberData.inactiveSubscribers, totalSubscribers);
    const churnRate = calculatePercentage(subscriberData.churnedSubscribers, totalSubscribers);


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
                    <div className="flex justify-between items-start flex-wrap gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
                                    <Activity className="text-white" size={28} />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                        Subscriber Analytics
                                    </h1>
                                    <p className="text-gray-600 mt-1">Real-time subscriber insights and metrics</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar size={16} />
                                Reporting Period
                            </label>
                            <input
                                type="month"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* User Subscriptions Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-b-lg shadow-sm p-6 border-x border-b border-gray-200">
                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {/* Total Subscribers */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Users size={24} className="text-blue-600" />
                                    </div>
                                    <TrendingUp size={20} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 text-sm font-medium mb-1">Total Subscribers</p>
                                <p className="text-4xl font-bold text-gray-900 mb-2">{formatNumber(totalSubscribers)}</p>
                                <p className="text-xs text-gray-500">Active + Inactive base</p>
                            </div>

                            {/* Active Subscribers */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <UserCheck size={24} className="text-green-600" />
                                    </div>
                                    <span className="text-sm font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                                        {activeRate}%
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">Active Subscribers</p>
                                <p className="text-4xl font-bold text-gray-900 mb-2">{formatNumber(subscriberData.activeSubscribers)}</p>
                                <p className="text-xs text-gray-500">Currently subscribed</p>
                            </div>

                            {/* Inactive Subscribers */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <UserX size={24} className="text-orange-600" />
                                    </div>
                                    <span className="text-sm font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg">
                                        {inactiveRate}%
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">Inactive Subscribers</p>
                                <p className="text-4xl font-bold text-gray-900 mb-2">{formatNumber(subscriberData.inactiveSubscribers)}</p>
                                <p className="text-xs text-gray-500">Subscription expired</p>
                            </div>

                            {/* New Subscribers */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <UserPlus size={24} className="text-purple-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg">
                                        NEW
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">New This Month</p>
                                <p className="text-4xl font-bold text-gray-900 mb-2">{formatNumber(subscriberData.newSubscribers)}</p>
                                <p className="text-xs text-gray-500">First-time subscribers</p>
                            </div>
                        </div>

                        {/* Secondary Metrics & Growth */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Renewals */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-700">Renewals</h3>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <TrendingUp className="text-blue-600" size={20} />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(subscriberData.renewedSubscribers)}</p>
                                <p className="text-sm text-gray-600">Subscribers renewed</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Retention health</span>
                                        <span className="font-semibold text-blue-600">Strong</span>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Churn */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-700">Monthly Churn</h3>
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <UserX className="text-red-600" size={20} />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(subscriberData.churnedSubscribers)}</p>
                                <p className="text-sm text-gray-600">Churn rate: {churnRate}%</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`font-semibold ${parseFloat(churnRate) < 2 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {parseFloat(churnRate) < 2 ? 'Healthy' : 'Monitor'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Table & Activity Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Status Breakdown */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                    Status Breakdown
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                            <span className="text-gray-900 font-semibold">Active</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{formatNumber(subscriberData.activeSubscribers)}</p>
                                            <p className="text-sm text-green-600 font-semibold">{activeRate}%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                                            <span className="text-gray-900 font-semibold">Inactive</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{formatNumber(subscriberData.inactiveSubscribers)}</p>
                                            <p className="text-sm text-orange-600 font-semibold">{inactiveRate}%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="text-gray-900 font-bold">Total</span>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{formatNumber(totalSubscribers)}</p>
                                            <p className="text-sm text-gray-600 font-semibold">100%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Activity */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                                    Monthly Activity
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <UserPlus size={18} className="text-green-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">New Subscribers</span>
                                        </div>
                                        <span className="font-bold text-green-600 text-lg">+{formatNumber(subscriberData.newSubscribers)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <TrendingUp size={18} className="text-blue-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">Renewals</span>
                                        </div>
                                        <span className="font-bold text-blue-600 text-lg">{formatNumber(subscriberData.renewedSubscribers)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <UserX size={18} className="text-red-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">Churned</span>
                                        </div>
                                        <span className="font-bold text-red-600 text-lg">-{formatNumber(subscriberData.churnedSubscribers)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total New Users */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">Total Onboarded Customers</p>
                                    <p className="text-4xl font-bold text-gray-900">{formatNumber(subscriberData.newTotalUsers)}</p>
                                    <p className="text-gray-500 text-sm mt-2">Lifetime customer acquisitions</p>
                                </div>
                                <div className="p-4 bg-purple-100 rounded-lg">
                                    <Users size={48} className="text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Subscriptions Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-t-lg p-3 text-black">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            Location Subscriptions
                        </h2>
                        <p className="text-black mt-1">Track location-based subscription metrics</p>
                    </div>

                    <div className="bg-white rounded-b-lg shadow-sm p-6 border-x border-b border-gray-200">
                        {/* Location Key Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users size={20} className="text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">Total Locations</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.totalLocationSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">All subscriptions</p>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <UserCheck size={20} className="text-green-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded">
                                        {calculatePercentage(subscriberData.activeLocationSubscriptions, subscriberData.totalLocationSubscriptions)}%
                                    </span>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">Active Locations</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.activeLocationSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">Currently active</p>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <UserX size={20} className="text-orange-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                        {calculatePercentage(subscriberData.inactiveLocationSubscriptions, subscriberData.totalLocationSubscriptions)}%
                                    </span>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">Inactive Locations</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.inactiveLocationSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">Expired</p>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <UserPlus size={20} className="text-purple-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                        NEW
                                    </span>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">New This Month</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.newLocationSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">First-time</p>
                            </div>
                        </div>

                        {/* Location Activity Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <TrendingUp size={20} className="text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Renewals</h3>
                                </div>
                                <p className="text-3xl font-bold text-black mb-1">{formatNumber(subscriberData.renewedLocationSubscriptions)}</p>
                                <p className="text-xs text-gray-600">Location renewals</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <UserX size={20} className="text-red-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Churned</h3>
                                </div>
                                <p className="text-3xl font-bold text-black mb-1">{formatNumber(subscriberData.churnedLocationSubscriptions)}</p>
                                <p className="text-xs text-gray-600">Churn rate: {calculatePercentage(subscriberData.churnedLocationSubscriptions, subscriberData.totalLocationSubscriptions)}%</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users size={20} className="text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Total Onboarded</h3>
                                </div>
                                <p className="text-3xl font-bold text-black mb-1">{formatNumber(subscriberData.newTotalLocations)}</p>
                                <p className="text-xs text-gray-600">Lifetime locations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warehouse Subscriptions Section */}
                <div className="mb-8">

                    <div className="bg-white rounded-t-lg p-3 text-black">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            Warehouse Subscriptions
                        </h2>
                        <p className="text-black mt-1">Monitor warehouse subscription performance</p>
                    </div>

                    <div className="bg-white rounded-b-lg shadow-sm p-6 border-x border-b border-gray-200">
                        {/* Warehouse Key Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg p-5 border border-indigo-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Users size={20} className="text-indigo-600" />
                                    </div>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">Total Warehouses</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.totalWarehouseSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">All subscriptions</p>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <UserCheck size={20} className="text-green-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded">
                                        {calculatePercentage(subscriberData.activeWarehouseSubscriptions, subscriberData.totalWarehouseSubscriptions)}%
                                    </span>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">Active Warehouses</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.activeWarehouseSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">Currently active</p>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <UserX size={20} className="text-orange-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                        {calculatePercentage(subscriberData.inactiveWarehouseSubscriptions, subscriberData.totalWarehouseSubscriptions)}%
                                    </span>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">Inactive Warehouses</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.inactiveWarehouseSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">Expired</p>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <UserPlus size={20} className="text-teal-600" />
                                    </div>
                                    <span className="text-xs font-bold bg-teal-100 text-teal-600 px-2 py-1 rounded">
                                        NEW
                                    </span>
                                </div>
                                <p className="text-gray-700 text-xs font-semibold mb-1">New This Month</p>
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.newWarehouseSubscriptions)}</p>
                                <p className="text-xs text-black mt-1 font-medium">First-time</p>
                            </div>
                        </div>

                        {/* Warehouse Activity Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <TrendingUp size={20} className="text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Renewals</h3>
                                </div>
                                <p className="text-3xl font-bold text- mb-1">{formatNumber(subscriberData.renewedWarehouseSubscriptions)}</p>
                                <p className="text-xs text-gray-600">Warehouse renewals</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <UserX size={20} className="text-red-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Churned</h3>
                                </div>
                                <p className="text-3xl font-bold text-black mb-1">{formatNumber(subscriberData.churnedWarehouseSubscriptions)}</p>
                                <p className="text-xs text-gray-600">Churn rate: {calculatePercentage(subscriberData.churnedWarehouseSubscriptions, subscriberData.totalWarehouseSubscriptions)}%</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Users size={20} className="text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Total Onboarded</h3>
                                </div>
                                <p className="text-3xl font-bold text-black mb-1">{formatNumber(subscriberData.newTotalWarehouses)}</p>
                                <p className="text-xs text-gray-600">Lifetime warehouses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}