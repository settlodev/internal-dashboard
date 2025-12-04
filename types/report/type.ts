export interface InvoicePayment {
    percentage: number;
    provider: string;
    amount: number;
}

export interface InvoicePaymentsSummary {
    invoicePayments: InvoicePayment[];
    totalAmount: number;
}