'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form, FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FieldErrors, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCallback, useTransition } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CancelButton from "@/components/widgets/cancel-button"
import { Separator } from "@/components/ui/separator"
import SubmitButton from "@/components/widgets/submit-button"
import { Textarea } from "../ui/textarea"
import { Invoice } from "@/types/invoice/type"
import { invoiceSchema } from "@/types/invoice/schema"
import BusinessOwnerSelector from "../widgets/businessOwnerSelector"
import DeviceSelector from "../widgets/deviceSelector"
import { createInvoice } from "@/lib/actions/invoice-action"
import InvoicePreview from "../invoice/invoicePreview"
import { Owner } from "@/types/owners/type"
import { PosDevices } from "@/types/devices/type"


function InvoiceForm({ item }: { item: Invoice | null | undefined }) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof invoiceSchema>>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            owner: item?.owner || '',
            device: item?.device || '',
            quantity: item?.quantity || 0,
            note: item?.note || '',
            due_date: item?.due_date || '',
            invoice_date: new Date().toISOString()
        }
    })

    // Watch form values for preview
    const watchedValues = form.watch();
   

    const onInvalid = useCallback((errors: FieldErrors) => {
        console.log(errors)
    }, [])

    const onSubmitData = useCallback(async (values: z.infer<typeof invoiceSchema>) => {
        
        const simplifiedValues = {
            owner: typeof values.owner === 'object' ? values.owner : values.owner,
            device: typeof values.device === 'object' ? values.device : values.device,
            quantity: values.quantity,
            note: values.note,
            due_date: values.due_date,
            invoice_date: new Date().toISOString()
        };

        startTransition(async () => {
            const result = await createInvoice(simplifiedValues);

            if (result?.error) {
                console.error("Failed to create invoice:", result.error);

                if (result.status === 400) {
                    form.setError("root", { message: "Invalid data provided." });
                } else {
                    form.setError("root", { message: result.error });
                }

                return;
            }

            if (result?.redirectTo) {
                window.location.href = result.redirectTo;
            }
        });
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create Invoice</CardTitle>
                    <CardDescription>Fill in the details to create a new invoice</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {(form.formState.errors.root || Object.keys(form.formState.errors).length > 0) && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertDescription>
                                    {form.formState.errors.root?.message ||
                                        "Please correct the errors below before submitting."}
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={form.handleSubmit(onSubmitData, onInvalid)}>
                            <div className="flex flex-col gap-6">
                                {/* First row */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="owner"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Billing Name</FormLabel>
                                                <FormControl>
                                                    <BusinessOwnerSelector
                                                        {...field}
                                                        placeholder="Select business owner"
                                                        value={field.value as string | Owner | undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="device"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Device</FormLabel>
                                                    <FormControl>
                                                        <DeviceSelector
                                                            {...field}
                                                            placeholder="Select device"
                                                            label="Device Condition"
                                                            value={field.value as string | PosDevices | undefined}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field} 
                                                            placeholder="How many devices do you have?"
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Note</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Payment should be wired through our bank account #"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value)}
                                                        className="resize-none"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="invoice_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Invoice Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        placeholder="Select invoice date"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="due_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        placeholder="Select due date"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                </div>
                                

                                <div className="flex h-5 items-center space-x-4 mt-10">
                                    <CancelButton />
                                    <Separator orientation="vertical" />
                                    <SubmitButton
                                        isPending={isPending}
                                        label={item ? "Update Invoice" : "Create Invoice"}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Preview Section */}
            <div className="hidden lg:block">
                <InvoicePreview formData={watchedValues} />
            </div>
        </div>
    )
}

export default InvoiceForm