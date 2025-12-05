'use client'
import { useState, useEffect } from 'react';
import { FileText, DollarSign, CreditCard, Wallet, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import {financialReconciliationReport} from "@/lib/actions/report";
import {InvoicePaymentsSummary} from "@/types/report/type";


export default function FinancialPage() {
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
    const [error, setError] = useState<string | null>(null);
    const [apiData, setApiData] = useState<InvoicePaymentsSummary>();

    const fetchFinancialData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Use selected dates or default to first day of month and today
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

            // Format dates for API (YYYY-MM-DDTHH:MMZ)
            const formattedStart = formatDateTimeForAPI(start, startT);
            const formattedEnd = formatDateTimeForAPI(end, endT);

            const data = await financialReconciliationReport(formattedStart, formattedEnd);

            setApiData(data);
        } catch (err) {
            setError('Failed to load financial data. Please try again.');
            console.error('Error fetching financial data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
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

    const getPaymentByProvider = (provider: string) => {
        if (!apiData?.invoicePayments) return { amount: 0, percentage: 0 };
        const payment = apiData.invoicePayments.find((p: any) => p.provider === provider);
        return payment || { amount: 0, percentage: 0 };
    };

    const selcomData = getPaymentByProvider('SELCOM');
    const manualData = getPaymentByProvider('MANUAL');
    const totalAmount = apiData?.totalAmount || 0;
    const totalVerified = selcomData.amount + manualData.amount;
    const variance = totalAmount - totalVerified;
    const hasData = apiData && totalAmount > 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Financial Reconciliation</h1>
                            <p className="text-gray-600 mt-1">Payment verification and breakdown report</p>
                        </div>

                        {/* Date Range Filter */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={18} className="text-gray-600" />
                                <label className="text-sm font-semibold text-gray-700">
                                    Reporting Period
                                </label>
                            </div>

                            {/* Custom Date Range */}
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
                                    onClick={fetchFinancialData}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Apply Filter
                                </button>
                            </div>

                            {/* Selected Date Range Display */}
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
                            {/*<RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={40} />*/}
                            <p className="text-gray-600">Loading financial data...</p>
                        </div>
                    </div>
                ) : !hasData ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FileText className="text-gray-400 mx-auto mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                        <p className="text-gray-600">No financial data found for the selected period.</p>
                        <p className="text-sm text-gray-500 mt-2">{formatDateRange()}</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(totalAmount)}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <DollarSign className="text-blue-600" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Selcom Payments</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(selcomData.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {selcomData.percentage.toFixed(1)}% of total
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <CreditCard className="text-green-600" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Manual Payments</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(manualData.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {manualData.percentage.toFixed(1)}% of total
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <Wallet className="text-purple-600" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} />
                                Payment Method Breakdown
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount (TZS)</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-900">Selcom</td>
                                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                                            {formatCurrency(selcomData.amount)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">
                                            {selcomData.percentage.toFixed(1)}%
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-900">Manual Payments</td>
                                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                                            {formatCurrency(manualData.amount)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">
                                            {manualData.percentage.toFixed(1)}%
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 font-semibold">
                                        <td className="py-3 px-4 text-gray-900">Total Verified</td>
                                        <td className="py-3 px-4 text-right text-gray-900">
                                            {formatCurrency(totalVerified)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-600">100%</td>
                                        <td className="py-3 px-4"></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Reconciliation Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reconciliation Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Total Amount (Expected)</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Total Verified Payments</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(totalVerified)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-900 font-semibold">Variance</span>
                                        <span className={`font-bold text-lg ${variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(Math.abs(variance))}
                                            {variance !== 0 && (
                                                <span className="text-sm ml-2">
                                                    ({variance > 0 ? 'Underreported' : 'Overreported'})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    {variance === 0 ? (
                                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                            <p className="text-green-800 text-sm font-medium">
                                                ✓ Reconciliation Complete - All payments accounted for
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="text-yellow-800 text-sm font-medium">
                                                ⚠ Variance detected - Please review payment records
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}