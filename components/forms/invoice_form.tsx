'use client'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form, FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FieldErrors, useFieldArray, useForm } from "react-hook-form"
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
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { X } from "lucide-react"


function InvoiceForm({ item }: { item: Invoice | null | undefined }) {
    const [isPending, startTransition] = useTransition()

    

    // Initialize form with default devices array
    const form = useForm<z.infer<typeof invoiceSchema>>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            owner: item?.owner || '',
            devices: item?.devices?.length ? item.devices : [{ device: '', quantity: 1}],
            note: item?.note || '',
            due_date: item?.due_date || '',
            invoice_date: new Date().toISOString(),
            discount: item?.discount || 0,
            vat_inclusive: item?.vat_inclusive || false
        }
    })

    // Get the devices fields array for rendering
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "devices"
    });

    // Watch form values for preview
    const watchedValues = form.watch();
   
    const onInvalid = useCallback((errors: FieldErrors) => {
        console.log(errors)
    }, [])

    const onSubmitData = useCallback(async (values: z.infer<typeof invoiceSchema>) => {
        
        const simplifiedValues = {
            owner: typeof values.owner === 'object' ? values.owner : values.owner,
            devices: values.devices.map(item => ({
                device: typeof item.device === 'object' ? item.device : item.device,
                quantity: item.quantity
            })),
            note: values.note,
            due_date: values.due_date,
            invoice_date: new Date().toISOString(),
            discount: values.discount,
            vat_inclusive: values.vat_inclusive
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

    // Function to add a new device item
    const addDeviceItem = () => {
        append({ device: '', quantity: 1});
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card>
                <CardContent className="mt-3">
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
                                {/* Owner field */}
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

                                {/* Devices section with add/remove capabilities */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Devices</h3>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={addDeviceItem}
                                        >
                                            Add Device
                                        </Button>
                                    </div>
                                    
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                            <div className="absolute top-2 right-2">
                                                {index > 0 && (
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`devices.${index}.device`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Device</FormLabel>
                                                            <FormControl>
                                                                <DeviceSelector
                                                                    {...field}
                                                                    placeholder="Select device"
                                                                    label="Device Type"
                                                                    value={field.value as string | PosDevices | undefined}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    control={form.control}
                                                    name={`devices.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quantity</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="How many?"
                                                                    value={field.value}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                            
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {form.formState.errors.devices && (
                                        <p className="text-sm font-medium text-destructive">
                                            {form.formState.errors.devices.message}
                                        </p>
                                    )}
                                </div>

                                {/* Remaining fields */}
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
                                
                                <div className="grid grid-cols-2 gap-2 items-center">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="discount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount (optional)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            placeholder="Enter discount"
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                                            name="vat_inclusive"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col items-start">
                                                    <FormLabel>VAT Inclusive</FormLabel>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
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