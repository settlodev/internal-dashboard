"use server";
import { Invoice } from "@/types/invoice/type";
import { parseStringify } from "../utils";
import { invoiceSchema } from "@/types/invoice/schema";
import { z } from "zod";
import { createClient } from "../supabase/server";


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


// export async function createInvoice(values: z.infer<typeof invoiceSchema>) {
//     const supabase = await createClient();

//     // Validate data
//     const validData = invoiceSchema.safeParse(values);
//     console.log(validData);
//     if (!validData.success) {
//         return {
//             responseType: "error",
//             message: "Please fill all required fields before submitting",
//             error: validData.error.message,
//             status: 400
//         };
//     }

//     const parsed = validData.data;

//     // Generate unique invoice number
//     const timestamp = Date.now().toString().slice(-6);
//     const invoiceNumber = `INV-${timestamp}`;

//     // Get authenticated user
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if (authError || !user) {
//         return {
//             responseType: "error",
//             message: "User authentication failed",
//             status: 401
//         };
//     }

//     // Insert invoice record
//     let invoiceId: string | null = null;
//     try {
//         const { data, error } = await supabase
//             .from("internal_invoicesx")
//             .insert([
//                 {
//                     invoice_number: invoiceNumber,
//                     due_date: parsed.due_date,
//                     status: "draft",
//                     user_id: user.id,
//                     owner: typeof parsed.owner === 'object' ? parsed.owner.id : null,
//                     billed_name: typeof parsed.owner === 'object' ? `${parsed.owner.firstName} ${parsed.owner.lastName}` : null,
//                     billed_email: typeof parsed.owner === 'object' ? parsed.owner.email : null,
//                     billed_phone: typeof parsed.owner === 'object' ? parsed.owner.phoneNumber : null,
//                     billed_address: typeof parsed.owner === 'object' ? parsed.owner.countryName : null,
//                     invoice_date: parsed.invoice_date,
//                     discount: parsed.discount || 0,
//                     vat_inclusive: parsed.vat_inclusive || false
//                 }
//             ])
//             .select("id")
//             .single();

//         if (error) throw error;
//         invoiceId = data.id;
//     } catch (error: any) {
//         console.error("Error creating invoice:", error);
//         return {
//             responseType: "error",
//             message: "Failed to create invoice",
//             error: error?.message || "Unknown error",
//             status: 500
//         };
//     }

//     // Insert all device items and subscriptions for the invoice
//     const itemsToInsert = await Promise.all(
//         parsed.devices.map(async (entry) => {
//             const deviceId = typeof entry.device === 'object' ? entry.device.id : null;
//             const deviceInfo = deviceId ? await fetchDeviceById(deviceId) : null;
            
//             return {
//                 invoice_id: invoiceId,
//                 item_name: deviceInfo?.device_type || "Unknown",
//                 brand: deviceInfo?.brand || "Unknown",
//                 quantity: entry.quantity,
//                 unit_price: deviceInfo?.selling_price || 0,
//                 note: parsed.note || null,

//             };
//         })
//     );

//     try {
//         const { error } = await supabase
//             .from("internal_invoice_items")
//             .insert(itemsToInsert);

//         if (error) throw error;
//     } catch (error: any) {
//         console.error("Error inserting invoice items:", error);
//         return {
//             responseType: "error",
//             message: "Failed to save invoice items",
//             error: error?.message || "Unknown error",
//             status: 500
//         };
//     }

//     return {
//         responseType: "success",
//         message: "Invoice created successfully",
//         status: 200,
//         redirectTo: "/invoices"
//     };
// }

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

     // Create a single invoice item with all the data in a JSONB column
     try {
        const deviceItems = parsed.devices && parsed.devices.length > 0 
            ? parsed.devices.map(entry => {
                const deviceObj = typeof entry.device === 'object' ? entry.device : null;
                return {
                    device_id: deviceObj?.id || null,
                    device_type: deviceObj?.device_type || null,
                    brand: deviceObj?.brand || null,
                    model_number: deviceObj?.model_number || null,
                    quantity: entry.quantity,
                    selling_price: deviceObj?.selling_price || 0
                };
            })
            : [];

        const subscriptionItems = parsed.subscriptions && parsed.subscriptions.length > 0
            ? parsed.subscriptions.map(entry => {
                const subscriptionObj = typeof entry.subscription === 'object' ? entry.subscription : null;
                return {
                    subscription_id: subscriptionObj?.id || null,
                    package_name: subscriptionObj?.packageName || null,
                    package_code: subscriptionObj?.packageCode || null,
                    quantity: entry.quantity,
                    amount: subscriptionObj?.amount || 0
                };
            })
            : [];

        const { error } = await supabase
            .from("internal_invoice_items")
            .insert({
                invoice_id: invoiceId,
                items_data: {
                    devices: deviceItems,
                    subscriptions: subscriptionItems
                },
                note: parsed.note || null
            });

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
   
    
    return parseStringify(invoiceWithItems);
}

// export async function updateInvoice(id: string,values: z.infer<typeof invoiceSchema>) {

//     console.log("Values and ID", id,values);
//     const supabase = await createClient();

//     // Validate data
//     const validData = invoiceSchema.safeParse(values);
//     if (!validData.success) {
//         return {
//             responseType: "error",
//             message: "Please fill all required fields before submitting",
//             error: validData.error.message,
//             status: 400
//         };
//     }

//     const parsed = validData.data;

//     // Get authenticated user
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if (authError || !user) {
//         return {
//             responseType: "error",
//             message: "User authentication failed",
//             status: 401
//         };
//     }

//     // Verify the invoice exists and belongs to the authenticated user
//     const { data: existingInvoice, error: fetchError } = await supabase
//         .from("internal_invoices")
//         .select("*")
//         .eq("id", id)
//         .eq("user_id", user.id)
//         .single();

//     if (fetchError || !existingInvoice) {
//         return {
//             responseType: "error",
//             message: "Invoice not found or you don't have permission to update it",
//             status: 404
//         };
//     }

//     // Update invoice record
//     try {
//         const { error } = await supabase
//             .from("internal_invoices")
//             .update({
//                 due_date: parsed.due_date,
//                 user_id: user.id,
//                 owner: typeof parsed.owner === 'object' ? parsed.owner.id : null,
//                 billed_name: typeof parsed.owner === 'object' ? `${parsed.owner.firstName} ${parsed.owner.lastName}` : null,
//                 billed_email: typeof parsed.owner === 'object' ? parsed.owner.email : null,
//                 billed_phone: typeof parsed.owner === 'object' ? parsed.owner.phoneNumber : null,
//                 billed_address: typeof parsed.owner === 'object' ? parsed.owner.countryName : null,
//                 invoice_date: parsed.invoice_date,
//                 discount: parsed.discount || 0,
//                 vat_inclusive: parsed.vat_inclusive || false
//             })
//             .eq("id", id);

//         if (error) throw error;
//     } catch (error: any) {
//         console.error("Error updating invoice:", error);
//         return {
//             responseType: "error",
//             message: "Failed to update invoice",
//             error: error?.message || "Unknown error",
//             status: 500
//         };
//     }

//     // Update invoice items - first delete existing items
//     try {
//         const { error: deleteError } = await supabase
//             .from("internal_invoice_items")
//             .delete()
//             .eq("invoice_id", id);

//         if (deleteError) throw deleteError;

//         // Then insert new items
//         const deviceItems = parsed.devices && parsed.devices.length > 0 
//             ? parsed.devices.map(entry => {
//                 const deviceObj = typeof entry.device === 'object' ? entry.device : null;
//                 return {
//                     device_id: deviceObj?.id || null,
//                     device_type: deviceObj?.device_type || null,
//                     brand: deviceObj?.brand || null,
//                     model_number: deviceObj?.model_number || null,
//                     quantity: entry.quantity,
//                     selling_price: deviceObj?.selling_price || 0
//                 };
//             })
//             : [];

//         const subscriptionItems = parsed.subscriptions && parsed.subscriptions.length > 0
//             ? parsed.subscriptions.map(entry => {
//                 const subscriptionObj = typeof entry.subscription === 'object' ? entry.subscription : null;
//                 return {
//                     subscription_id: subscriptionObj?.id || null,
//                     package_name: subscriptionObj?.packageName || null,
//                     package_code: subscriptionObj?.packageCode || null,
//                     quantity: entry.quantity,
//                     amount: subscriptionObj?.amount || 0
//                 };
//             })
//             : [];

//         const { error: insertError } = await supabase
//             .from("internal_invoice_items")
//             .insert({
//                 invoice_id: id,
//                 items_data: {
//                     devices: deviceItems,
//                     subscriptions: subscriptionItems
//                 },
//                 note: parsed.note || null
//             });

//         if (insertError) throw insertError;
//     } catch (error: any) {
//         console.error("Error updating invoice items:", error);
//         return {
//             responseType: "error",
//             message: "Failed to update invoice items",
//             error: error?.message || "Unknown error",
//             status: 500
//         };
//     }

//     return {
//         responseType: "success",
//         message: "Invoice updated successfully",
//         status: 200,
//         redirectTo: "/invoices"
//     };
// }


export async function updateInvoice(
    id: string,
    values: z.infer<typeof invoiceSchema>
) {
    const supabase = await createClient();

    // Validate data
    const validData = invoiceSchema.safeParse(values);
    if (!validData.success) {
        return {
            responseType: "error",
            message: "Please fill all required fields before submitting",
            error: validData.error.message,
            status: 400
        };
    }

    const parsed = validData.data;

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return {
            responseType: "error",
            message: "User authentication failed",
            status: 401
        };
    }

    // Verify the invoice exists and belongs to the authenticated user
    const { data: existingInvoice, error: fetchError } = await supabase
        .from("internal_invoices")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !existingInvoice) {
        return {
            responseType: "error",
            message: "Invoice not found or you don't have permission to update it",
            status: 404
        };
    }

    // Update invoice record
    try {
        const { error } = await supabase
            .from("internal_invoices")
            .update({
                due_date: parsed.due_date,
                owner: typeof parsed.owner === 'object' ? parsed.owner.id : null,
                billed_name: typeof parsed.owner === 'object' ? `${parsed.owner.firstName} ${parsed.owner.lastName}` : null,
                billed_email: typeof parsed.owner === 'object' ? parsed.owner.email : null,
                billed_phone: typeof parsed.owner === 'object' ? parsed.owner.phoneNumber : null,
                billed_address: typeof parsed.owner === 'object' ? parsed.owner.countryName : null,
                invoice_date: parsed.invoice_date,
                discount: parsed.discount || 0,
                vat_inclusive: parsed.vat_inclusive || false
            })
            .eq("id", id);

        if (error) throw error;
    } catch (error: any) {
        console.error("Error updating invoice:", error);
        return {
            responseType: "error",
            message: "Failed to update invoice",
            error: error?.message || "Unknown error",
            status: 500
        };
    }

    // Update invoice items - using upsert instead of delete + insert
    try {
        // First check if items exist
        const { data: existingItems, error: checkError } = await supabase
            .from("internal_invoice_items")
            .select("id")
            .eq("invoice_id", id);
            
        if (checkError) throw checkError;

        const deviceItems = parsed.devices && parsed.devices.length > 0 
            ? parsed.devices.map(entry => {
                const deviceObj = typeof entry.device === 'object' ? entry.device : null;
                return {
                    device_id: deviceObj?.id || null,
                    device_type: deviceObj?.device_type || null,
                    brand: deviceObj?.brand || null,
                    model_number: deviceObj?.model_number || null,
                    quantity: entry.quantity,
                    selling_price: deviceObj?.selling_price || 0
                };
            })
            : [];

        const subscriptionItems = parsed.subscriptions && parsed.subscriptions.length > 0
            ? parsed.subscriptions.map(entry => {
                const subscriptionObj = typeof entry.subscription === 'object' ? entry.subscription : null;
                return {
                    subscription_id: subscriptionObj?.id || null,
                    package_name: subscriptionObj?.packageName || null,
                    package_code: subscriptionObj?.packageCode || null,
                    quantity: entry.quantity,
                    amount: subscriptionObj?.amount || 0
                };
            })
            : [];

        // If items exist, update them
        if (existingItems && existingItems.length > 0) {
            const { error: updateError } = await supabase
                .from("internal_invoice_items")
                .update({
                    items_data: {
                        devices: deviceItems,
                        subscriptions: subscriptionItems
                    },
                    note: parsed.note || null
                })
                .eq("invoice_id", id);

            if (updateError) throw updateError;
        } else {
            // If no items exist, insert new ones
            const { error: insertError } = await supabase
                .from("internal_invoice_items")
                .insert({
                    invoice_id: id,
                    items_data: {
                        devices: deviceItems,
                        subscriptions: subscriptionItems
                    },
                    note: parsed.note || null
                });

            if (insertError) throw insertError;
        }
    } catch (error: any) {
        console.error("Error updating invoice items:", error);
        return {
            responseType: "error",
            message: "Failed to update invoice items",
            error: error?.message || "Unknown error",
            status: 500
        };
    }

    return {
        responseType: "success",
        message: "Invoice updated successfully",
        status: 200,
        redirectTo: "/invoices"
    };
}

    

