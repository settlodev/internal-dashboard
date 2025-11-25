'use client'
import { useState } from 'react';
import {Users, UserCheck, UserX, UserPlus, TrendingUp, Calendar } from 'lucide-react';

// Sample data - replace with your actual data
const subscriberData = {
    totalSubscribers: 15420,
    activeSubscribers: 12850,
    inactiveSubscribers: 2570,
    newSubscribersThisMonth: 342,
    renewalsThisMonth: 1205,
    churnThisMonth: 187,
    monthlyGrowthRate: 8.5,
    revenueThisMonth: 45680000
};

export default function SubscriberReport() {
    const [dateRange, setDateRange] = useState('2024-11');

    const formatNumber = (num:number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calculatePercentage = (part:any, total:number) => {
        return ((part / total) * 100).toFixed(1);
    };

    // const exportToCSV = () => {
    //     const data = [
    //         ['Subscriber Analytics Report'],
    //         ['Reporting Period:', dateRange],
    //         ['Generated:', new Date().toLocaleDateString()],
    //         [''],
    //         ['Metric', 'Value', 'Percentage'],
    //         ['Total Subscribers', subscriberData.totalSubscribers, '100%'],
    //         ['Active Subscribers', subscriberData.activeSubscribers, calculatePercentage(subscriberData.activeSubscribers, subscriberData.totalSubscribers) + '%'],
    //         ['Inactive/Expired Subscribers', subscriberData.inactiveSubscribers, calculatePercentage(subscriberData.inactiveSubscribers, subscriberData.totalSubscribers) + '%'],
    //         ['New Subscribers This Month', subscriberData.newSubscribersThisMonth, '-'],
    //         ['Renewals This Month', subscriberData.renewalsThisMonth, '-'],
    //         ['Churn This Month', subscriberData.churnThisMonth, '-'],
    //         ['Monthly Growth Rate', subscriberData.monthlyGrowthRate + '%', '-'],
    //         ['Revenue This Month', subscriberData.revenueThisMonth, '-']
    //     ];
    //
    //     const csv = data.map(row => row.join(',')).join('\n');
    //     const blob = new Blob([csv], { type: 'text/csv' });
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `subscriber-report-${dateRange}.csv`;
    //     a.click();
    // };

    const activeRate = calculatePercentage(subscriberData.activeSubscribers, subscriberData.totalSubscribers);
    const inactiveRate = calculatePercentage(subscriberData.inactiveSubscribers, subscriberData.totalSubscribers);
    const churnRate = calculatePercentage(subscriberData.churnThisMonth, subscriberData.totalSubscribers);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Subscriber Analytics</h1>
                            <p className="text-gray-600 mt-1">Comprehensive subscriber management report</p>
                        </div>
                        {/*<button*/}
                        {/*    onClick={exportToCSV}*/}
                        {/*    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"*/}
                        {/*>*/}
                        {/*    <Download size={18} />*/}
                        {/*    Export Report*/}
                        {/*</button>*/}
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reporting Period
                        </label>
                        <input
                            type="month"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>
                </div>

                {/* Primary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Users size={32} className="text-gray-600" />
                            <TrendingUp size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.totalSubscribers)}</p>
                        <p className="text-xs mt-2 text-gray-500">All time</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <UserCheck size={32} className="text-gray-600" />
                            <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {activeRate}%
              </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Active Subscribers</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.activeSubscribers)}</p>
                        <p className="text-xs mt-2 text-gray-500">Currently subscribed</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <UserX size={32} className="text-gray-600" />
                            <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {inactiveRate}%
              </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Inactive/Expired</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.inactiveSubscribers)}</p>
                        <p className="text-xs mt-2 text-gray-500">Subscription expired</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <UserPlus size={32} className="text-gray-600" />
                            <Calendar size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">New Subscribers</p>
                        <p className="text-3xl font-bold text-gray-900">{formatNumber(subscriberData.newSubscribersThisMonth)}</p>
                        <p className="text-xs mt-2 text-gray-500">First payment this month</p>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Renewals This Month</h3>
                            <div className="bg-blue-100 p-2 rounded-full">
                                <TrendingUp className="text-blue-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(subscriberData.renewalsThisMonth)}</p>
                        <p className="text-sm text-gray-600 mt-2">Existing subscribers renewed</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Monthly Churn</h3>
                            <div className="bg-red-100 p-2 rounded-full">
                                <UserX className="text-red-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(subscriberData.churnThisMonth)}</p>
                        <p className="text-sm text-gray-600 mt-2">Churn rate: {churnRate}%</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Growth Rate</h3>
                            <div className="bg-green-100 p-2 rounded-full">
                                <TrendingUp className="text-green-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{subscriberData.monthlyGrowthRate}%</p>
                        <p className="text-sm text-gray-600 mt-2">Month-over-month growth</p>
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
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
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
                                    {formatNumber(subscriberData.activeSubscribers)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">
                                    {activeRate}%
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className="text-green-600 text-sm">↗ +{subscriberData.monthlyGrowthRate}%</span>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span className="text-gray-900 font-medium">Inactive/Expired</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                    {formatNumber(subscriberData.inactiveSubscribers)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">
                                    {inactiveRate}%
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className="text-orange-600 text-sm">→ Stable</span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50 font-semibold">
                                <td className="py-3 px-4 text-gray-900">Total</td>
                                <td className="py-3 px-4 text-right text-gray-900">
                                    {formatNumber(subscriberData.totalSubscribers)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">100%</td>
                                <td className="py-3 px-4"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Activity Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">This Month's Activity</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">New Subscribers (First Payment)</span>
                                <span className="font-semibold text-gray-900">{formatNumber(subscriberData.newSubscribersThisMonth)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Renewals</span>
                                <span className="font-semibold text-gray-900">{formatNumber(subscriberData.renewalsThisMonth)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Churned Subscribers</span>
                                <span className="font-semibold text-red-600">-{formatNumber(subscriberData.churnThisMonth)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 pt-4">
                                <span className="text-gray-900 font-semibold">Net Change</span>
                                <span className="font-bold text-green-600 text-lg">
                  +{formatNumber(subscriberData.newSubscribersThisMonth - subscriberData.churnThisMonth)}
                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue This Month</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {formatCurrency(subscriberData.revenueThisMonth)}
                            </p>
                            <p className="text-sm text-gray-600">
                                From {formatNumber(subscriberData.newSubscribersThisMonth + subscriberData.renewalsThisMonth)} payments
                            </p>
                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Avg. Revenue per Subscriber</span>
                                    <span className="font-semibold text-gray-900">
                    {formatCurrency(subscriberData.revenueThisMonth / (subscriberData.newSubscribersThisMonth + subscriberData.renewalsThisMonth))}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}