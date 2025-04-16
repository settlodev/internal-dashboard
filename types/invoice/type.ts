import { UUID } from "crypto";

export declare interface Invoice {
    id: string;
    invoice_number: string;
    owner: UUID;
    invoice_date: string;
    date_issued: string;
    due_date: string;
    total_amount: number;
    status: string;
    user_id: string; 
    created_at: string;
    updated_at: string;
    items: InvoiceItem[];
    device: UUID;
    quantity: number;
    note: string;
}

export declare interface InvoiceItem {
    id: string;
    invoice_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    created_at: string;
    updated_at: string;
}