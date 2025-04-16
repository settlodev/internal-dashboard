
'use client';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { fetchInvoiceById } from '@/lib/actions/invoice-action';
import html2pdf from 'html2pdf.js';


const InvoicePreview = ({ params }: { params: { id: string } }) => {
  const [invoice, setInvoice] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const tax = 0.18;

  React.useEffect(() => {
    const fetchInvoice = async () => {
      const invoice = await fetchInvoiceById(params.id);
      setInvoice(invoice);
      setLoading(false);
    };
    fetchInvoice();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const downloadPDF = () => {
    const element = document.getElementById('invoice-content');
    if (element) {
      html2pdf()
        .set({ 
          margin: 0.5,
          filename: `invoice-${invoice.invoice_number}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .from(element)
        .save();
    }
  };

  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format numbers for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calculate subtotal, tax and total
  const calculateTotals = () => {
    let subtotal = 0;
    invoice.items.forEach((item: any) => {
      subtotal += item.unit_price * item.quantity;
    });
    const taxAmount = subtotal * tax;
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };
  
  const { subtotal, taxAmount, total } = calculateTotals();
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-full">
      <div id="invoice" className="w-full lg:w-3/4">
        <Card className="w-full bg-white shadow-md mb-3">
          <CardContent id="invoice-content" className="pt-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Settlo Technologies Ltd</h3>
                  <p className="text-sm text-gray-500">8th Floor Noble Centre Building, Bagamoyo Road</p>
                  <p className="text-sm text-gray-500">Dar es Salaam, Tanzania</p>
                </div>
                <div className="text-left md:text-right mt-4 md:mt-0">
                  <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                  <p className="text-sm text-gray-500">#{invoice.invoice_number}</p>
                  <p className="text-sm text-gray-500">Invoice Date: {formatDisplayDate(invoice.invoice_date)}</p>
                  <p className="text-sm text-gray-500">Invoice Due Date: {formatDisplayDate(invoice.due_date)}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700">Bill To:</h3>
                <p className="font-medium">{invoice.billed_name}</p>
                <p className="text-sm text-gray-500">{invoice.billed_email}</p>
                {invoice.billed_phone && <p className="text-sm text-gray-500">{invoice.billed_phone}</p>}
                {invoice.billed_address && <p className="text-sm text-gray-500">{invoice.billed_address}</p>}
              </div>

              {/* Invoice Details */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-1">Item</th>
                      <th className="text-right py-2 px-1">Price</th>
                      <th className="text-right py-2 px-1">Quantity</th>
                      <th className="text-right py-2 px-1">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="py-2 px-1">{item.brand}-{item.item_name}</td>
                        <td className="text-right py-2 px-1">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right py-2 px-1">{item.quantity}</td>
                        <td className="text-right py-2 px-1">{formatCurrency(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals - Fixed the calculation issue */}
              <div className="mt-4 flex flex-col items-end">
                <div className="w-full sm:w-64">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax (18%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold border-t border-gray-300 mt-2 pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes - Fixed to show all notes together */}
              {invoice.items.some((item: any) => item.note) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700">Notes:</h4>
                  {invoice.items.map((item: any, index: number) => (
                    item.note && (
                      <p key={index} className="text-sm mt-1 text-gray-600">{item.note}</p>
                    )
                  ))}
                </div>
              )}

              {/* TIN */}
              <div className="flex items-center mt-6">  
                <p className="text-sm mt-1 text-gray-600">TAX IDENTIFICATION NUMBER (TIN): 153-112-053</p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Settlo Technologies Ltd</h3>
                    <p className="text-sm text-gray-500">8th Floor Noble Centre Building, Bagamoyo Road</p>
                    <p className="text-sm text-gray-500">Dar es Salaam, Tanzania</p>
                  </div>
                  <div className="text-left md:text-right mt-4 md:mt-0">
                    <h2 className="font-semibold text-gray-800">Contact</h2>
                    <p className="text-sm text-gray-500">Phone: +255 788 000 000</p>
                    <p className="text-sm text-gray-500">Email: accounts@settlo.co.tz</p>
                    <p className="text-sm text-gray-500">Website: www.settlo.co.tz</p>
                  </div>
                </div>
              </div>
              
              {/* Powered by */}
              <div className="mt-6 pt-6 border-t border-gray-200 items-center">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Powered by</p>
                    <p className="text-sm text-gray-500">Settlo Technologies Ltd</p>
                  </div>
                  <div className="text-left md:text-right mt-2 md:mt-0">
                    <p className="text-sm text-gray-500">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action buttons - now in a more responsive layout */}
      <div className="w-full lg:w-1/4 flex flex-row lg:flex-col gap-3 mt-2 lg:mt-0">
        <button 
          onClick={downloadPDF}
          className="flex-1 lg:flex-none px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
          aria-label="Download PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>

        <button 
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex-1 lg:flex-none px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
          aria-label="Copy Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Copy Link</span>
        </button>
        
        <button 
          onClick={() => window.print()}
          className="flex-1 lg:flex-none px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
          aria-label="Print Invoice"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Print</span>
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;