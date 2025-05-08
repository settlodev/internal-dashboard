'use client';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { fetchInvoiceById } from '@/lib/actions/invoice-action';
import html2pdf from 'html2pdf.js';


const InvoiceDetails = ({ params }: { params: { id: string } }) => {
  const [invoice, setInvoice] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const vatRate = 0.18; // 18% VAT

  React.useEffect(() => {
    const fetchInvoice = async () => {
      const fetchedInvoice = await fetchInvoiceById(params.id);
      // console.log("The invoice is", fetchedInvoice);
      setInvoice(fetchedInvoice );
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
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number], // Explicitly type as tuple
        filename: `invoice-${invoice?.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
         },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as 'portrait' | 'landscape', 
          compressPDF: true 
        }
      };
  
      html2pdf().set(opt).from(element).save();
    }
  };
  

  // Extract devices and subscriptions from items if they exist
  const devices = invoice?.items?.[0]?.items_data?.devices || [];
  const subscriptions = invoice?.items?.[0]?.items_data?.subscriptions || [];
  const note = invoice?.items?.[0]?.note || '';
  const discount = invoice?.discount || 0;
  const vatInclusive = invoice?.vat_inclusive || false;

  // Check if we have actual device data
  const hasDeviceData = devices && devices.length > 0;

  // Check if we have actual subscription data
  const hasSubscriptionData = subscriptions && subscriptions.length > 0;

  // Calculate subtotals
  const calculateDevicesSubtotal = (): number => {
    if (!hasDeviceData) return 0;
    
    return devices.reduce((total: number, device: any) => {
      const devicePrice = device.selling_price || 0;
      const quantity = device.quantity || 0;
      return total + (devicePrice * quantity);
    }, 0);
  };
  
  const calculateSubscriptionsSubtotal = (): number => {
    if (!hasSubscriptionData) return 0;
    
    return subscriptions.reduce((total: number, subscription: any) => {
      const subscriptionPrice = subscription.amount || 0;
      const quantity = subscription.quantity || 0;
      return total + (subscriptionPrice * quantity);
    }, 0);
  };

  // Calculate total subtotal
  const devicesSubtotal = calculateDevicesSubtotal();
  const subscriptionsSubtotal = calculateSubscriptionsSubtotal();
  const subtotal = devicesSubtotal + subscriptionsSubtotal;

  // Calculate tax and total based on VAT inclusive/exclusive
  let tax: number = 0;
  let total: number;

  if (vatInclusive === true) {
    // If VAT is inclusive, we need to extract it from the subtotal
    const subtotalBeforeVat = subtotal / (1 + vatRate);
    tax = subtotal - subtotalBeforeVat;
    total = subtotal - discount;
  } else {
    // tax = subtotal * vatRate;
    // total = subtotal + (vatInclusive ? 0 : tax) - discount;
    total = subtotal - discount;

  }

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

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4 max-w-full">
      <div id="invoice" className="w-full max-w-[794px] mx-auto">
        <Card className="w-full bg-white shadow-md mb-3">
          <CardContent id="invoice-content" className="p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">Settlo Technologies Ltd</h3>
                    <p className="text-xs sm:text-sm text-gray-500">8th Floor Noble Centre Building, Bagamoyo Road</p>
                    <p className="text-xs sm:text-sm text-gray-500">Dar es Salaam, Tanzania</p>
                    <p className="text-xs sm:text-sm mt-1 text-gray-600">TAX IDENTIFICATION NUMBER (TIN): 153-112-053</p>
                  </div>
                  <div className="text-left">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Contact</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Phone: +255 788 000 000</p>
                    <p className="text-xs sm:text-sm text-gray-500">Email: accounts@settlo.co.tz</p>
                    <p className="text-xs sm:text-sm text-gray-500">Website: www.settlo.co.tz</p>
                  </div>
                </div>
                <div className="text-left sm:text-right mt-4 sm:mt-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">INVOICE</h2>
                  <p className="text-xs sm:text-sm text-gray-500">#{invoice?.invoice_number}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Invoice Date: {formatDisplayDate(invoice?.invoice_date)}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Invoice Due Date: {formatDisplayDate(invoice?.due_date)}</p>
                  <p className="text-xs sm:text-sm mt-2 font-medium text-gray-700">
                    Status: <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                      invoice?.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      invoice?.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>{invoice?.status}</span>
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mt-4 sm:mt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Bill To:</h3>
                <p className="text-sm sm:text-base font-medium">{invoice?.billed_name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{invoice?.billed_email}</p>
                {invoice?.billed_phone && <p className="text-xs sm:text-sm text-gray-500">{invoice?.billed_phone}</p>}
                {invoice?.billed_address && <p className="text-xs sm:text-sm text-gray-500">{invoice?.billed_address}</p>}
              </div>

              {/* Devices Table */}
              {hasDeviceData && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Devices:</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-1">Item</th>
                          <th className="text-right py-2 px-1">Price</th>
                          <th className="text-right py-2 px-1">Quantity</th>
                          <th className="text-right py-2 px-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {devices.map((device: any, index: number) => {
                          const devicePrice = device.selling_price || 0;
                          const quantity = device.quantity || 0;
                          const itemTotal = devicePrice * quantity;

                          return (
                            <tr key={`device-${index}`} className="border-b border-gray-200">
                              <td className="py-2 px-1">{`${device.brand} ${device.device_type}`}</td>
                              <td className="text-right py-2 px-1">{formatCurrency(devicePrice)}</td>
                              <td className="text-right py-2 px-1">{quantity}</td>
                              <td className="text-right py-2 px-1">{formatCurrency(itemTotal)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subscriptions Table */}
              {hasSubscriptionData && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Subscriptions:</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-1">Package</th>
                          <th className="text-right py-2 px-1">Price</th>
                          <th className="text-right py-2 px-1">Quantity</th>
                          <th className="text-right py-2 px-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((subscription: any, index: number) => {
                          const packageName = subscription.package_name || 'Subscription Package';
                          const subscriptionPrice = subscription.amount || 0;
                          const quantity = subscription.quantity || 0;
                          const itemTotal = subscriptionPrice * quantity;

                          return (
                            <tr key={`subscription-${index}`} className="border-b border-gray-200">
                              <td className="py-2 px-1">{packageName}</td>
                              <td className="text-right py-2 px-1">{formatCurrency(subscriptionPrice)}</td>
                              <td className="text-right py-2 px-1">{quantity}</td>
                              <td className="text-right py-2 px-1">{formatCurrency(itemTotal)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* If no items added */}
              {!hasDeviceData && !hasSubscriptionData && (
                <div className="mt-4 sm:mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-1">Item</th>
                          <th className="text-right py-2 px-1">Price</th>
                          <th className="text-right py-2 px-1">Quantity</th>
                          <th className="text-right py-2 px-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td colSpan={4} className="py-2 px-1 text-center text-gray-500">No items added</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="mt-4 sm:mt-6 flex flex-col items-end">
                <div className="w-full sm:w-64">
                  <div className="flex justify-between py-1 text-xs sm:text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between py-1 text-xs sm:text-sm">
                      <span>Discount:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  {vatInclusive === true && (
                    <div className="flex justify-between py-1 text-xs sm:text-sm">
                      <span>VAT ({vatRate * 100}%) (Included):</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 font-bold border-t border-gray-300 mt-2 pt-2 text-sm sm:text-base">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm sm:text-base font-medium text-gray-700">Notes:</h4>
                {note ? (
                  <p className="text-xs sm:text-sm mt-1 text-gray-600">{note}</p>
                ) : (
                  <p className="text-xs sm:text-sm mt-1 text-gray-400 italic">No notes provided</p>
                )}

                <div className="mt-4">
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">Payment Details:</h4>
                  <p className="text-xs sm:text-sm text-gray-600 font-bold mb-2">A/C Name: Settlo Technologies Ltd</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="border rounded p-2 sm:p-3">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">Ecobank Tz</h5>
                      <p className="text-xs sm:text-sm text-gray-600">A/C #: 7080004083</p>
                    </div>
                    <div className="border rounded p-2 sm:p-3">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">CRDB</h5>
                      <p className="text-xs sm:text-sm text-gray-600">A/C #: 0150885684800</p>
                    </div>
                    <div className="border rounded p-2 sm:p-3">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">NMB</h5>
                      <p className="text-xs sm:text-sm text-gray-600">A/C #: 24110011133</p>
                    </div>
                    <div className="border rounded p-2 sm:p-3">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">M-PESA</h5>
                      <p className="text-xs sm:text-sm text-gray-600">A/C #: 54224615</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Powered by */}
              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Powered by</p>
                    <p className="text-xs sm:text-sm text-gray-500">Settlo Technologies Ltd</p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-xs sm:text-sm text-gray-500">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action buttons */}
      <div className="w-full flex flex-row gap-2 sm:gap-3 mt-2">
        <button 
          onClick={downloadPDF}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
          aria-label="Download PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-xs sm:text-sm">Download PDF</span>
        </button>

        <button 
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
          aria-label="Copy Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs sm:text-sm">Copy Link</span>
        </button>
        
        <button 
          onClick={() => window.print()}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
          aria-label="Print Invoice"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs sm:text-sm">Print</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;