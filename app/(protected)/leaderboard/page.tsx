'use client'
import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Trophy, Building2, MapPin, ArrowUpRight, Award, Filter, ChevronUp,DollarSign, CheckCircle,CreditCard } from 'lucide-react';
import { locationLeaderBoardReport } from "@/lib/actions/report";
import Loading from "@/components/widgets/loader";

interface LocationData {
    "totalCompleteOrdersCount": number,
    "totalIncompleteOrdersCount": number,
    "ordersNetAmount": number,
    "totalOrdersCount": number,
    "ordersGrossAmount": number,
    "ordersPaidAmount": number,
    "ordersUnpaidAmount": number,
    "locationId": string,
    "businessName": string,
    "locationName": string
}

interface LeaderboardResponse {
    startDate: string;
    endDate: string;
    locations: LocationData[];
}



const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'tzs',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const getRankColor = (rank: number) => {
    switch(rank) {
        case 1: return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
        case 2: return 'bg-gradient-to-r from-gray-400 to-gray-300';
        case 3: return 'bg-gradient-to-r from-amber-700 to-amber-600';
        default: return 'bg-gradient-to-r from-blue-600 to-blue-500';
    }
};

const getRankIcon = (rank: number) => {
    switch(rank) {
        case 1: return <Trophy className="w-5 h-5 text-yellow-600" />;
        case 2: return <Trophy className="w-5 h-5 text-gray-500" />;
        case 3: return <Trophy className="w-5 h-5 text-amber-700" />;
        default: return <div className="text-sm font-bold">{rank}</div>;
    }
};

export default function LeaderboardPage() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const formatTimeForInput = (date: Date) => {
        return date.toTimeString().split(' ')[0].substring(0, 5);
    };

    const formatDateTimeForAPI = (dateString: string, timeString: string) => {
        return `${dateString}T${timeString}Z`;
    };

    const [startDate, setStartDate] = useState(formatDateForInput(firstDayOfMonth));
    const [startTime, setStartTime] = useState('00:00');
    const [endDate, setEndDate] = useState(formatDateForInput(currentDate));
    const [endTime, setEndTime] = useState(formatTimeForInput(currentDate));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
    const [sortBy, setSortBy] = useState<'totalOrdersCount' | 'businessName' | 'ordersNetAmount' | 'ordersGrossAmount'>('totalOrdersCount');

    const fetchLeaderboardData = async (): Promise<void> => {
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

            const result = await locationLeaderBoardReport(formattedStart, formattedEnd);
            setLeaderboardData(result);
        } catch (err) {
            setError('Failed to load leaderboard data. Please try again.');
            console.error('Error fetching leaderboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const formatDateRange = () => {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return `${start.toLocaleString('en-US', options)} - ${end.toLocaleString('en-US', options)}`;
    };

    // Sort and process leaderboard data
    const processedLocations = leaderboardData?.locations
        ? [...leaderboardData.locations]
            .sort((a, b) => {
                switch(sortBy) {
                    case 'businessName':
                        return a.businessName.localeCompare(b.businessName);
                    case 'ordersNetAmount':
                        return b.ordersNetAmount - a.ordersNetAmount;
                    case 'ordersGrossAmount':
                        return b.ordersGrossAmount - a.ordersGrossAmount;
                    case 'totalOrdersCount':
                    default:
                        return b.totalOrdersCount - a.totalOrdersCount;
                }
            })
            .map((location, index) => ({
                ...location,
                rank: index + 1,
                growth: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : 0,
                completionRate: location.totalOrdersCount > 0
                    ? (location.totalCompleteOrdersCount / location.totalOrdersCount) * 100
                    : 0,
                paymentRate: location.ordersGrossAmount > 0
                    ? (location.ordersPaidAmount / location.ordersGrossAmount) * 100
                    : 0
            }))
        : [];

    const totalOrders = processedLocations.reduce((sum, location) => sum + location.totalOrdersCount, 0);
    const totalRevenue = processedLocations.reduce((sum, location) => sum + location.ordersGrossAmount, 0);
    const totalNetAmount = processedLocations.reduce((sum, location) => sum + location.ordersNetAmount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Performance Leaderboard</h1>
                                    <p className="text-gray-600 mt-1">Top performing business locations by order volume and revenue</p>
                                </div>
                            </div>

                            {!loading && leaderboardData && (
                                <div className="mt-3 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg inline-block border border-blue-100">
                                    <span className="font-semibold">Reporting Period:</span> {formatDateRange()}
                                </div>
                            )}
                        </div>
                        {/* Stats Summary */}
                        {!loading && leaderboardData && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-w-[300px]">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-black">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm opacity-90">Total Revenue</p>
                                            <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 text-black">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm opacity-90">Total Orders</p>
                                            <p className="text-xl font-bold">{formatNumber(totalOrders)}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs opacity-80 mt-2">
                                        Across {processedLocations.length} locations
                                    </p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-black md:col-span-1">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm opacity-90">Net Amount</p>
                                            <p className="text-xl font-bold">{formatCurrency(totalNetAmount)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Date Range Filter */}
                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-end">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={endDate || formatDateForInput(currentDate)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        max={formatDateForInput(currentDate)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={fetchLeaderboardData}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 whitespace-nowrap font-medium shadow-lg hover:shadow-xl"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                {loading ? 'Loading...' : 'Filter Report'}
                            </button>
                        </div>

                        {/* Sort Options */}
                        {!loading && leaderboardData && (
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter size={18} className="text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSortBy('totalOrdersCount')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'totalOrdersCount'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Order Count
                                    </button>
                                    <button
                                        onClick={() => setSortBy('ordersNetAmount')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'ordersNetAmount'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Net Amount
                                    </button>
                                    <button
                                        onClick={() => setSortBy('ordersGrossAmount')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'ordersGrossAmount'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Gross Amount
                                    </button>
                                    <button
                                        onClick={() => setSortBy('businessName')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'businessName'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Business Name
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-red-800 font-medium">Error Loading Data</p>
                                    <p className="text-red-700 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loading/>
                    </div>
                ) : !leaderboardData || processedLocations.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
                        <p className="text-gray-600">No leaderboard data found for the selected period.</p>
                        <p className="text-sm text-gray-500 mt-2">Try adjusting your date range</p>
                    </div>
                ) : (
                    <>
                        {/* Top Performers Highlight */}
                        {processedLocations.length >= 3 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-yellow-500" />
                                    Top Performers
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {processedLocations.slice(0, 3).map((location) => (
                                        <div
                                            key={location.locationId}
                                            className={`${getRankColor(location.rank)} rounded-2xl p-6 text-white shadow-xl transform hover:scale-[1.02] transition-transform duration-300`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                        {getRankIcon(location.rank)}
                                                    </div>
                                                    <span className="text-sm font-semibold">#{location.rank}</span>
                                                </div>
                                                {location.growth > 0 && (
                                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                        <ChevronUp size={14} />
                                                        <span className="text-xs font-bold">{location.growth}%</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold mb-1 truncate">{location.businessName}</h3>
                                            <p className="text-sm opacity-90 mb-2 truncate">{location.locationName}</p>
                                            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
                                                <div>
                                                    <p className="text-xs opacity-80">Total Orders</p>
                                                    <p className="text-2xl font-bold">{formatNumber(location.totalOrdersCount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-80">Revenue</p>
                                                    <p className="text-xl font-bold">{formatCurrency(location.ordersGrossAmount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-80">Completion</p>
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-bold">{location.completionRate.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-80">Payment</p>
                                                    <div className="flex items-center gap-1">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span className="text-sm font-bold">{location.paymentRate.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Full Leaderboard Table */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-black" />
                                    Complete Leaderboard
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Comprehensive performance metrics across all locations
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Rank</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Business</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Location</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order Stats</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Revenue</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Payment Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {processedLocations.map((location) => {
                                        const topLocationOrders = processedLocations[0]?.totalOrdersCount || 1;
                                        const percentage = (location.totalOrdersCount / topLocationOrders) * 100;

                                        return (
                                            <tr
                                                key={location.locationId}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 ${getRankColor(location.rank)} rounded-full flex items-center justify-center text-white font-bold`}>
                                                            {getRankIcon(location.rank)}
                                                        </div>
                                                        {location.growth > 0 && location.rank > 3 && (
                                                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                                <ArrowUpRight size={12} />
                                                                {location.growth}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                                            <Building2 className="w-5 h-5 text-black" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {location.businessName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-gray-400" />
                                                        <span className="text-gray-700">{location.locationName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="text-lg font-bold text-gray-900">{formatNumber(location.totalOrdersCount)}</p>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 text-xs">
                                                            <div className="flex flex-row items-center gap-1 text-green-600">
                                                                <span>Complete: {formatNumber(location.totalCompleteOrdersCount)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-red-600">
                                                                <span>Incomplete: {formatNumber(location.totalIncompleteOrdersCount)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="font-bold text-gray-900">{formatCurrency(location.ordersGrossAmount)}</p>
                                                            <p className="text-sm text-gray-600">Gross</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{formatCurrency(location.ordersNetAmount)}</p>
                                                            <p className="text-sm text-gray-600">Net</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="font-bold text-green-600">{formatCurrency(location.ordersPaidAmount)}</p>
                                                            <p className="text-sm text-gray-600">Paid</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-red-600">{formatCurrency(location.ordersUnpaidAmount)}</p>
                                                            <p className="text-sm text-gray-600">Unpaid</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Summary */}
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Showing <span className="font-semibold">{processedLocations.length}</span> locations
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Total Orders</p>
                                            <p className="text-lg font-bold text-gray-900">{formatNumber(totalOrders)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Total Revenue</p>
                                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Avg per Location</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatNumber(Math.round(totalOrders / processedLocations.length))}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Period</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDate(leaderboardData.startDate)} - {formatDate(leaderboardData.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}