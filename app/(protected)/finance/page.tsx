'use client'
import { useState } from 'react';
import { FileText, DollarSign, CreditCard, Wallet } from 'lucide-react';

const invoices = {
    netInvoicePaid: 8000000,
    separator: {
        selcom: 6000000,
        manualPayments: 2000000
    }
};

export default function FinancialPage() {
    const [dateRange, setDateRange] = useState('2024-11');

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
    //         ['Financial Reconciliation Report'],
    //         ['Date Range:', dateRange],
    //         [''],
    //         ['Category', 'Amount (TZS)', 'Percentage'],
    //         ['Net Invoice Paid', invoices.netInvoicePaid, '100%'],
    //         [''],
    //         ['Payment Method Breakdown:'],
    //         ['Selcom Payments', invoices.separator.selcom, calculatePercentage(invoices.separator.selcom, invoices.netInvoicePaid) + '%'],
    //         ['Manual Payments', invoices.separator.manualPayments, calculatePercentage(invoices.separator.manualPayments, invoices.netInvoicePaid) + '%'],
    //         [''],
    //         ['Total Verified:', invoices.separator.selcom + invoices.separator.manualPayments],
    //         ['Variance:', invoices.netInvoicePaid - (invoices.separator.selcom + invoices.separator.manualPayments)]
    //     ];
    //
    //     const csv = data.map(row => row.join(',')).join('\n');
    //     const blob = new Blob([csv], { type: 'text/csv' });
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `financial-reconciliation-${dateRange}.csv`;
    //     a.click();
    // };

    const totalVerified = invoices.separator.selcom + invoices.separator.manualPayments;
    const variance = invoices.netInvoicePaid - totalVerified;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Financial Reconciliation</h1>
                            <p className="text-gray-600 mt-1">Payment verification and breakdown report</p>
                        </div>
                        {/*<button*/}
                        {/*    onClick={exportToCSV}*/}
                        {/*    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"*/}
                        {/*>*/}
                        {/*    <Download size={18} />*/}
                        {/*    Export CSV*/}
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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Net Invoice Paid</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(invoices.netInvoicePaid)}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <DollarSign className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Selcom Payments</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(invoices.separator.selcom)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {calculatePercentage(invoices.separator.selcom, invoices.netInvoicePaid)}% of total
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CreditCard className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Manual Payments</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(invoices.separator.manualPayments)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {calculatePercentage(invoices.separator.manualPayments, invoices.netInvoicePaid)}% of total
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
                                    {formatCurrency(invoices.separator.selcom)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">
                                    {calculatePercentage(invoices.separator.selcom, invoices.netInvoicePaid)}%
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-900">Manual Payments</td>
                                <td className="py-3 px-4 text-right font-medium text-gray-900">
                                    {formatCurrency(invoices.separator.manualPayments)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">
                                    {calculatePercentage(invoices.separator.manualPayments, invoices.netInvoicePaid)}%
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
                            <span className="text-gray-600">Net Invoice Paid (Expected)</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(invoices.netInvoicePaid)}</span>
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
                            {variance === 0 && (
                                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-800 text-sm font-medium">
                                        ✓ Reconciliation Complete - All payments accounted for
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}