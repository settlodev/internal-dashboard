"use server";
import { Invoice } from "@/types/invoice/type";
import { parseStringify } from "../utils";
import { invoiceSchema } from "@/types/invoice/schema";
import { z } from "zod";
import { createClient } from "../supabase/server";
import { fetchDeviceById } from "./devices";

export async function fetchInvoices(): Promise<Invoice[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('internal_invoices').select('*').order('created_at', { ascending: false })
    // console.log(data)
    if (error) {
        console.log(error)
    }
    return parseStringify(data)
}


export async function createInvoice(values: z.infer<typeof invoiceSchema>) {
    const supabase = await createClient();
    
    // Validate data
    const validData = invoiceSchema.safeParse(values);
    // console.log(validData)
    if (!validData.success) {
        return {
            responseType: "error",
            message: "Please fill all required fields before submitting",
            error: validData.error.message, // Return error message as string instead of Error object
            status: 400
        };
    }

    

    // Use timestamp to ensure uniqueness
        const timestamp = Date.now().toString().slice(-6);
        const invoiceNumber = `INV-${timestamp}`;
       

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return {
            responseType: "error",
            message: "User authentication failed",
            status: 401
        };
    }

    if (typeof validData.data.owner === 'object') {
        console.log("The billed customer", validData.data.owner.firstName, validData.data.owner.lastName)
    }
    // Start inserting invoice
    let invoiceId;
    try {
        const { data, error } = await supabase
            .from("internal_invoices")
            .insert([
                {
                    invoice_number: invoiceNumber,
                    due_date: validData.data.due_date,
                    status: "draft",
                    user_id: user.id,
                    owner: typeof validData.data.owner === 'object' ? validData.data.owner.id : null,
                    billed_name: typeof validData.data.owner === 'object' ? validData.data.owner.firstName + " " + validData.data.owner.lastName : null,
                    billed_email: typeof validData.data.owner === 'object' ? validData.data.owner.email : null,
                    billed_phone: typeof validData.data.owner === 'object' ? validData.data.owner.phoneNumber : null,
                    billed_address: typeof validData.data.owner === 'object' ? validData.data.owner.countryName : null,
                    invoice_date: validData.data.invoice_date
                }
            ])
            .select("id")
            .single();

        if (error) throw error;
        invoiceId = data.id;
    } catch (error: any) {
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
        console.log("Error details:", error.details);

        return {
            responseType: "error",
            message: "Failed to create invoice",
            error: typeof error === 'object' ? error.message : String(error), // Ensure it's a string
            status: 500
        };
    }
    // Insert invoice items
    let itemData = null;
    if (typeof validData.data.device === 'object' && typeof validData.data.device.id === 'string') {
        itemData = await fetchDeviceById(validData.data.device.id);
    }
    const items = {
        invoice_id: invoiceId,
        item_name: itemData?.device_type,
        brand: itemData?.brand,
        note: validData.data.note || null,
        quantity: validData.data.quantity,
        unit_price: itemData?.selling_price
    };

    try {
        const { error } = await supabase.from("internal_invoice_items").insert(items);
        if (error) throw error;
    } catch (error: any) {
        console.log("Error inserting invoice items:", error);
        return {
            responseType: "error",
            message: "Failed to create invoice",
            error: typeof error === 'object' ? error.message : String(error), // Ensure it's a string
            status: 500
        };
    }

    return {
        responseType: "success",
        message: "Invoice created successfully",
        status: 200,
        redirectTo: "/invoices"
    };
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
    const supabase = await createClient();
    
    // First, get the invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from("internal_invoices")
        .select("*")
        .eq("id", id)
        .single();
    
    if (invoiceError) {
        console.error(invoiceError);
        return null;
    }
    
    if (!invoice) {
        return null;
    }
    
    // Then, get the invoice items
    const { data: invoiceItems, error: itemsError } = await supabase
        .from("internal_invoice_items")
        .select("*")
        .eq("invoice_id", invoice.id);
    
    if (itemsError) {
        console.error(itemsError);
        return null;
    }
    
    // Combine the invoice with its items
    const invoiceWithItems = {
        ...invoice,
        items: invoiceItems || []
    };
    console.log(invoiceWithItems);
    
    return parseStringify(invoiceWithItems);
}


    

