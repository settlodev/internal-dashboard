import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface InvoicePreviewProps {
  formData: {
    owner?: any;
    devices?: Array<{
      device?: any;
      quantity?: number;
      price?: number;
    }>;
    note?: string;
    due_date?: string;
    invoice_date?: string;
    discount?: number;
    vat_inclusive?: boolean;
  };
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ formData }) => {
  console.log("The form data is ", formData);
  
  // Format date for display
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

  // Get owner details
  const ownerName = typeof formData.owner === 'object' && formData.owner 
    ? `${formData.owner.firstName} ${formData.owner.lastName}`
    : 'Customer Name';
  
  const ownerEmail = typeof formData.owner === 'object' && formData.owner?.email 
    ? formData.owner.email 
    : 'customer@example.com';
  
  const ownerPhone = typeof formData.owner === 'object' && formData.owner?.phoneNumber 
    ? formData.owner.phoneNumber 
    : '';

  const ownerLocation = typeof formData.owner === 'object' && formData.owner?.countryName 
    ? formData.owner.countryName 
    : '';

  // Calculate subtotal from all devices
  const calculateSubtotal = () => {
    if (!formData.devices || formData.devices.length === 0) return 0;
    
    return formData.devices.reduce((total, item) => {
      const devicePrice = item.price || 
        (typeof item.device === 'object' && item.device ? item.device.selling_price : 0);
      const quantity = item.quantity || 0;
      return total + (devicePrice * quantity);
    }, 0);
  };

  // Calculate values
  const subtotal = calculateSubtotal();
  const discount = formData.discount || 0;
  const vatRate = 0.18; // 18% VAT
  const vatInclusive = formData.vat_inclusive;

  // Calculate tax and total based on VAT inclusive/exclusive
  let tax: number = 0;
  let total: number;

  if (vatInclusive === true) {
    // If VAT is inclusive, we need to extract it from the subtotal
    const subtotalBeforeVat = subtotal / (1 + vatRate);
    tax = subtotal - subtotalBeforeVat;
    total = subtotal - discount;
  } else {
    // If VAT is not inclusive, add VAT to the price after discount
    // const discountedSubtotal = subtotal - discount;
    // tax = discountedSubtotal * vatRate;
    // total = discountedSubtotal + (vatInclusive ? 0 : tax);

    total = subtotal - discount;
  }

  // Format numbers for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-center">Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Settlo Technologies Ltd</h3>
              <p className="text-sm text-gray-500">8th Floor Noble Centre Building, Bagamoyo Road</p>
              <p className="text-sm text-gray-500">Dar es Salaam, Tanzania</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-sm text-gray-500">#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
              <p className="text-sm text-gray-500">Invoice Date: {formatDisplayDate(formData.invoice_date)}</p>
              <p className="text-sm text-gray-500">Invoice Due Date: {formatDisplayDate(formData.due_date)}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mt-8">
            <h3 className="font-semibold text-gray-700">Bill To:</h3>
            <p className="font-medium">{ownerName}</p>
            <p className="text-sm text-gray-500">{ownerEmail}</p>
            {ownerPhone && <p className="text-sm text-gray-500">{ownerPhone}</p>}
            {ownerLocation && <p className="text-sm text-gray-500">{ownerLocation}</p>}
          </div>

          {/* Invoice Details */}
          <div className="mt-6">
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
                {formData.devices && formData.devices.length > 0 ? (
                  formData.devices.map((item, index) => {
                    const device = typeof item.device === 'object' && item.device;
                    const deviceName = device ? `${device.brand}-${device.device_type}` : 'Unknown Device';
                    const devicePrice = item.price || (device ? device.selling_price : 0);
                    const quantity = item.quantity || 0;
                    const itemTotal = devicePrice * quantity;

                    return (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 px-1">{deviceName}</td>
                        <td className="text-right py-2 px-1">{formatCurrency(devicePrice)}</td>
                        <td className="text-right py-2 px-1">{formatNumber(quantity)}</td>
                        <td className="text-right py-2 px-1">{formatCurrency(itemTotal)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-b border-gray-200">
                    <td colSpan={4} className="py-2 px-1 text-center text-gray-500">No devices added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex flex-col items-end">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-1">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              {vatInclusive === true && (
                <div className="flex justify-between py-1">
                  <span>VAT ({vatRate * 100}%) (Included):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 font-bold border-t border-gray-300 mt-2 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {formData.note && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700">Notes:</h4>
              <p className="text-sm mt-1 text-gray-600">{formData.note}</p>
            </div>
          )}
        </div>
        {/* TIN */}
        <div className="flex items-center mt-6">  
          <p className="text-sm mt-1 text-gray-600">TAX IDENTIFICATION NUMBER (TIN): 153-112-053</p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Settlo Technologies Ltd</h3>
              <p className="text-sm text-gray-500">8th Floor Noble Centre Building, Bagamoyo Road</p>
              <p className="text-sm text-gray-500">Dar es Salaam, Tanzania</p>
            </div>
            <div className="text-right">
              <h2 className="font-semibold text-gray-800">Contact</h2>
              <p className="text-sm text-gray-500">Phone: +255 788 000 000</p>
              <p className="text-sm text-gray-500">Email: accounts@settlo.co.tz</p>
              <p className="text-sm text-gray-500">Website: www.settlo.co.tz</p>
            </div>
          </div>
        </div>
        {/* Powered by */}
        <div className="mt-6 pt-6 border-t border-gray-200 items-center">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Powered by</p>
              <p className="text-sm text-gray-500">Settlo Technologies Ltd</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
  
  export default InvoicePreview;