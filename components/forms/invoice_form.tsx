
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
import { createInvoice,updateInvoice } from "@/lib/actions/invoice-action"
import InvoicePreview from "../invoice/invoicePreview"
import { Owner } from "@/types/owners/type"
import { PosDevices } from "@/types/devices/type"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { X, Plus } from "lucide-react"
import { useMemo } from "react"
import { Subscription } from "@/types/location/type"
import SubscriptionPackageSelector from "../widgets/subscriptionPackageSelector"

function InvoiceForm({ item }: { item: Invoice | null | undefined }) {
    const [isPending, startTransition] = useTransition();

    const transformItemForForm = useCallback((invoiceItem: any) => {
        if (!invoiceItem) return null;

        // Get devices and subscriptions from the nested structure
        const itemsData = invoiceItem.items?.[0]?.items_data || {};

        // Map devices to the expected structure
        const devices = itemsData.devices?.map((deviceItem: any) => {
            return {
                device: {
                    id: deviceItem.device_id,
                    item_name: deviceItem.device_type,
                    device_type: deviceItem.device_type,
                    brand: deviceItem.brand,
                    selling_price: deviceItem.selling_price
                },
                quantity: deviceItem.quantity
            };
        }) || [];

        // Map subscriptions to the expected structure
        const subscriptions = itemsData.subscriptions?.map((subItem: any) => {
            return {
                subscription: {
                    id: subItem.subscription_id,
                    subscription_name: subItem.package_name,
                    package_code: subItem.package_code,
                    amount: subItem.amount
                },
                quantity: subItem.quantity
            };
        }) || [];

        // Include billing details for the preview
        const billingDetails = {
            billed_name: invoiceItem.billed_name,
            billed_email: invoiceItem.billed_email,
            billed_phone: invoiceItem.billed_phone,
            billed_address: invoiceItem.billed_address
        };

        return {
            owner: invoiceItem.owner,
            devices: devices.length ? devices : [],
            subscriptions: subscriptions.length ? subscriptions : [],
            note: invoiceItem.items?.[0]?.note || '',
            due_date: invoiceItem.due_date || '',
            invoice_date: invoiceItem.invoice_date || new Date().toISOString(),
            discount: invoiceItem.discount || 0,
            vat_inclusive: invoiceItem.vat_inclusive || false,
            billingDetails: billingDetails,
            invoice_number: invoiceItem.invoice_number
        };
    }, []);

    // Get the transformed item data
    const transformedItem = useMemo(() => transformItemForForm(item), [item, transformItemForForm]);

    // Initialize form with transformed item data or defaults
    const form = useForm<z.infer<typeof invoiceSchema>>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            owner: transformedItem?.owner || '',
            devices: transformedItem?.devices || [],
            subscriptions: transformedItem?.subscriptions || [],
            note: transformedItem?.note || '',
            due_date: transformedItem?.due_date || '',
            invoice_date: transformedItem?.invoice_date || new Date().toISOString(),
            discount: transformedItem?.discount || 0,
            vat_inclusive: transformedItem?.vat_inclusive || false
        }
    });

    // Create a merged object for the preview that includes both form values and
    // additional data, prioritizing newly selected form values over original data
    const previewData = useMemo(() => {
        const watchedValues = form.watch();

        // Get current owner information (could be newly selected)
        const currentOwner = typeof watchedValues.owner === 'object' && watchedValues.owner
            ? watchedValues.owner
            : null;

        // If user has selected a new owner, use that data instead of the original billing details
        const effectiveBillingDetails = currentOwner ? {
            billed_name: `${currentOwner.firstName} ${currentOwner.lastName}`,
            billed_email: currentOwner.email,
            billed_phone: currentOwner.phoneNumber,
            billed_address: currentOwner.countryName
        } : transformedItem?.billingDetails;

        return {
            ...watchedValues,
            billingDetails: effectiveBillingDetails,
            invoice_number: transformedItem?.invoice_number,
            isUpdating: !!item,
            ownerChanged: !!currentOwner
        };
    }, [form.watch(), transformedItem, item]);

    // console.log("Preview Data", previewData)

    const onInvalid = useCallback((errors: FieldErrors) => {
        console.log(errors);
    }, []);

    const onSubmitData = useCallback(async (values: z.infer<typeof invoiceSchema>) => {
        // Helper function to check if a value is truly empty
        const isEmpty = (value: any) => {
            if (!value) return true;
            if (typeof value === 'string') return value.trim() === '';
            if (typeof value === 'object' && !value.id) return true;
            return false;
        };

        // Filter out empty devices and subscriptions before submitting
        const validDevices = (values.devices || []).filter(item =>
            item.device && !isEmpty(item.device) && item.quantity && item.quantity > 0
        );

        const validSubscriptions = (values.subscriptions || []).filter(item =>
            item.subscription && !isEmpty(item.subscription) && item.quantity && item.quantity > 0
        );

        const simplifiedValues = {
            owner: typeof values.owner === 'object' ? values.owner : values.owner,
            devices: validDevices.map(item => ({
                device: typeof item.device === 'object' ? item.device : item.device,
                quantity: item.quantity,
            })),
            subscriptions: validSubscriptions.map(item => ({
                subscription: typeof item.subscription === 'object' ? item.subscription : item.subscription,
                quantity: item.quantity,
            })),
            note: values.note,
            due_date: values.due_date,
            invoice_date: values.invoice_date,
            discount: values.discount,
            vat_inclusive: values.vat_inclusive
        };

        console.log("Simplified Values", simplifiedValues)

        startTransition(async () => {
            const result = item
                ? await updateInvoice(item.id, simplifiedValues)
                : await createInvoice(simplifiedValues);

            if (result?.error) {
                console.error(`Failed to ${item ? 'update' : 'create'} invoice:`, result.error);

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
    }, [item]);

    // Get the devices fields array for rendering
    const { fields: deviceFields, append: appendDevice, remove: removeDevice } = useFieldArray({
        control: form.control,
        name: "devices"
    });

    // Get the subscriptions fields array for rendering
    const { fields: subscriptionFields, append: appendSubscription, remove: removeSubscription } = useFieldArray({
        control: form.control,
        name: "subscriptions"
    });

    const addDeviceItem = () => {
        appendDevice({ device: '', quantity: undefined });
    };

    const addSubscriptionItem = () => {
        appendSubscription({ subscription: '', quantity: undefined });
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
                                        <h3 className="text-lg font-medium">Devices (Optional)</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addDeviceItem}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Device
                                        </Button>
                                    </div>

                                    {deviceFields.length === 0 && (
                                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500">
                                            <p>No devices added yet.</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={addDeviceItem}
                                                className="mt-2"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add your first device
                                            </Button>
                                        </div>
                                    )}

                                    {deviceFields.map((field, index) => (
                                        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                            <div className="absolute top-2 right-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDevice(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
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
                                                                    placeholder="Select device (optional)"
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
                                                                    value={field.value || ''}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Subscriptions section with add/remove capabilities */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Subscriptions (Optional)</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addSubscriptionItem}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Subscription
                                        </Button>
                                    </div>

                                    {subscriptionFields.length === 0 && (
                                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500">
                                            <p>No subscriptions added yet.</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={addSubscriptionItem}
                                                className="mt-2"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add your first subscription
                                            </Button>
                                        </div>
                                    )}

                                    {subscriptionFields.map((field, index) => (
                                        <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                                            <div className="absolute top-2 right-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSubscription(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`subscriptions.${index}.subscription`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Subscription Package</FormLabel>
                                                            <FormControl>
                                                                <SubscriptionPackageSelector
                                                                    {...field}
                                                                    placeholder="Select subscription package (optional)"
                                                                    label="Subscription Package"
                                                                    value={field.value as string | Subscription | undefined}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`subscriptions.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quantity</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="How many month(s)?"
                                                                    value={field.value || ''}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                                                            disabled
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
                <InvoicePreview formData={previewData} />
            </div>
        </div>
    );
}

export default InvoiceForm;