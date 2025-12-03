
'use client'
import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, UserPlus, TrendingUp} from 'lucide-react';
import {subscribersReport} from "@/lib/actions/report";
import {SubscriberData} from "@/types/subscription/type";
import Loading from "@/components/widgets/loader";

export default function SubscriberReport() {
    const [dateRange, setDateRange] = useState('2025-11');
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

    const calculatePercentage = (part: number, total: number) => {
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

    if (!subscriberData) {
        return null;
    }

    const totalSubscribers = subscriberData.activeSubs + subscriberData.inactiveSubs;
    const activeRate = calculatePercentage(subscriberData.activeSubs, totalSubscribers);
    const inactiveRate = calculatePercentage(subscriberData.inactiveSubs, totalSubscribers);
    const churnRate = calculatePercentage(subscriberData.monthlyChurn, totalSubscribers);
    const netGrowth = subscriberData.newSubs - subscriberData.monthlyChurn;
    const growthRate = totalSubscribers > 0
        ? ((netGrowth / totalSubscribers) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Subscriber Analytics</h1>
                            <p className="text-gray-600 mt-1">Comprehensive subscriber management report</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reporting Period
                            </label>
                            <input
                                type="month"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Primary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Users size={32} className="text-blue-600" />
                            <TrendingUp size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(totalSubscribers)}</p>
                        <p className="text-xs mt-2 text-gray-500">Active + Inactive</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <UserCheck size={32} className="text-green-600" />
                            <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                {activeRate}%
              </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Active Subscribers</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.activeSubs)}</p>
                        <p className="text-xs mt-2 text-gray-500">Currently subscribed</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <UserX size={32} className="text-orange-600" />
                            <span className="text-sm font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">
                {inactiveRate}%
              </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Inactive Subscribers</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.inactiveSubs)}</p>
                        <p className="text-xs mt-2 text-gray-500">Subscription expired</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <UserPlus size={32} className="text-purple-600" />
                            <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                New
              </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">New This Month</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.newSubs)}</p>
                        <p className="text-xs mt-2 text-gray-500">First payment</p>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Renewals</h3>
                            <div className="bg-blue-100 p-2 rounded-full">
                                <TrendingUp className="text-blue-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(subscriberData.renewedSubs)}</p>
                        <p className="text-sm text-gray-600 mt-2">Subscribers renewed</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Monthly Churn</h3>
                            <div className="bg-red-100 p-2 rounded-full">
                                <UserX className="text-red-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(subscriberData.monthlyChurn)}</p>
                        <p className="text-sm text-gray-600 mt-2">Churn rate: {churnRate}%</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Net Growth</h3>
                            <div className={`p-2 rounded-full ${netGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                <TrendingUp className={netGrowth >= 0 ? 'text-green-600' : 'text-red-600'} size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {netGrowth >= 0 ? '+' : ''}{formatNumber(netGrowth)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">Growth rate: {growthRate}%</p>
                    </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscriber Status Breakdown</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Count</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-900 font-medium">Active Subscribers</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                    {formatNumber(subscriberData.activeSubs)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">
                                    {activeRate}%
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span className="text-gray-900 font-medium">Inactive Subscribers</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                    {formatNumber(subscriberData.inactiveSubs)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">
                                    {inactiveRate}%
                                </td>
                            </tr>
                            <tr className="bg-gray-50 font-semibold">
                                <td className="py-3 px-4 text-gray-900">Total</td>
                                <td className="py-3 px-4 text-right text-gray-900">
                                    {formatNumber(totalSubscribers)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">100%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Activity Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Activity Summary</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">New Subscribers</span>
                            <span className="font-semibold text-green-600">+{formatNumber(subscriberData.newSubs)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Renewals</span>
                            <span className="font-semibold text-blue-600">{formatNumber(subscriberData.renewedSubs)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Churned Subscribers</span>
                            <span className="font-semibold text-red-600">-{formatNumber(subscriberData.monthlyChurn)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 pt-4 bg-gray-50 px-4 rounded-lg">
                            <span className="text-gray-900 font-semibold">Net Change</span>
                            <span className={`font-bold text-lg ${netGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netGrowth >= 0 ? '+' : ''}{formatNumber(netGrowth)}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}