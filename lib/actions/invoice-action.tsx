"use server";
import { Invoice } from "@/types/invoice/type";
import { parseStringify } from "../utils";
import { invoiceSchema } from "@/types/invoice/schema";
import { z } from "zod";
import { createClient } from "../supabase/server";
import { fetchDeviceById } from "./devices";

export async function fetchInvoices(
    userId: string, 
    role: string
): Promise<Invoice[]> {
    const supabase = await createClient()
    // const { data, error } = await supabase.from('internal_invoices').select('*').order('created_at', { ascending: false })
   
    // Start with the query builder
    let query = supabase
    .from('internal_invoices')
    .select('*')
    .order('created_at', { ascending: false });

// Filter by user_id if the user is not an admin
if (role !== 'admin') {
    query = query.eq('user_id', userId);
}

// Execute the query
const { data: invoices, error } = await query;

if (error) {
    console.error(error);
    throw error;
}

if (!invoices || invoices.length === 0) {
    return parseStringify([]);
}

// Fetch all unique user IDs from the requests
const userIds = invoices.map(invoice => invoice.user_id).filter((id, index, self) => self.indexOf(id) === index);

// Fetch user data for all users at once
const { data: usersData, error: usersError } = await supabase
    .from('internal_profiles')
    .select(`
        id,
        first_name,
        last_name
    `)
    .in('id', userIds);

if (usersError) {
    console.error(usersError);
    throw usersError;
}

// Combine requests with user data
const invoiceList = invoices.map(invoice => {
    const userData = usersData.find(user => user.id === invoice.user_id);
    return {
        ...invoice,
        userData
    };
});
// console.log("The invoice list is",invoiceList)
return parseStringify(invoiceList);
}


export async function createInvoice(values: z.infer<typeof invoiceSchema>) {
    const supabase = await createClient();

    // Validate data
    const validData = invoiceSchema.safeParse(values);
    console.log(validData);
    if (!validData.success) {
        return {
            responseType: "error",
            message: "Please fill all required fields before submitting",
            error: validData.error.message,
            status: 400
        };
    }

    const parsed = validData.data;

    // Generate unique invoice number
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

    // Insert invoice record
    let invoiceId: string | null = null;
    try {
        const { data, error } = await supabase
            .from("internal_invoices")
            .insert([
                {
                    invoice_number: invoiceNumber,
                    due_date: parsed.due_date,
                    status: "draft",
                    user_id: user.id,
                    owner: typeof parsed.owner === 'object' ? parsed.owner.id : null,
                    billed_name: typeof parsed.owner === 'object' ? `${parsed.owner.firstName} ${parsed.owner.lastName}` : null,
                    billed_email: typeof parsed.owner === 'object' ? parsed.owner.email : null,
                    billed_phone: typeof parsed.owner === 'object' ? parsed.owner.phoneNumber : null,
                    billed_address: typeof parsed.owner === 'object' ? parsed.owner.countryName : null,
                    invoice_date: parsed.invoice_date,
                    // note: parsed.note || null,
                    discount: parsed.discount || 0,
                    vat_inclusive: parsed.vat_inclusive || false
                }
            ])
            .select("id")
            .single();

        if (error) throw error;
        invoiceId = data.id;
    } catch (error: any) {
        console.error("Error creating invoice:", error);
        return {
            responseType: "error",
            message: "Failed to create invoice",
            error: error?.message || "Unknown error",
            status: 500
        };
    }

    // Insert all device items
    const itemsToInsert = await Promise.all(
        parsed.devices.map(async (entry) => {
            const deviceId = typeof entry.device === 'object' ? entry.device.id : null;
            const deviceInfo = deviceId ? await fetchDeviceById(deviceId) : null;
            return {
                invoice_id: invoiceId,
                item_name: deviceInfo?.device_type || "Unknown",
                brand: deviceInfo?.brand || "Unknown",
                quantity: entry.quantity,
                unit_price: deviceInfo?.selling_price || 0,
                note: parsed.note || null
            };
        })
    );

    try {
        const { error } = await supabase
            .from("internal_invoice_items")
            .insert(itemsToInsert);

        if (error) throw error;
    } catch (error: any) {
        console.error("Error inserting invoice items:", error);
        return {
            responseType: "error",
            message: "Failed to save invoice items",
            error: error?.message || "Unknown error",
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


    

