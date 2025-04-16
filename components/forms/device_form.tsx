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
import { posDeviceSchema } from "@/types/devices/schema"
import { createDevice, updateDevice } from "@/lib/actions/devices"
import DeviceTypeSelector from "../widgets/deviceTypeSelector"
import { Textarea } from "../ui/textarea"
import { PosDevices } from "@/types/devices/type"
import { DeviceType } from "@/types/enum"

function DeviceForm({ item }: { item: PosDevices | null | undefined }) {
    const [isPending, startTransition] = useTransition()


    const form = useForm<z.infer<typeof posDeviceSchema>>({
        resolver: zodResolver(posDeviceSchema),
        defaultValues: {
            ...item,
            device_type: item?.device_type as DeviceType | undefined,
            brand: item?.brand || undefined,
            model_number: item?.model_number || undefined,
            technical_specs: item?.technical_specs || undefined,
            selling_price: item?.selling_price || undefined,
        }
    })

    const onInvalid = useCallback((errors: FieldErrors) => {
        console.log(errors)
    }, [])

    const onSubmitData = useCallback(async (values: z.infer<typeof posDeviceSchema>) => {


        startTransition(async () => {
            if (item) {
                const result = await updateDevice(item.id, values);

                if (result?.error) {
                    console.error("Failed to update device:", result.error);

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
            } else {
                const result = await createDevice(values);

                if (result?.error) {
                    console.error("Failed to create device:", result.error);

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
            }
        });
    }, []);


    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl"></CardTitle>
                    <CardDescription></CardDescription>
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
                                <div className="grid grid-col-1 lg:grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="device_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Device Type</FormLabel>
                                                    <FormControl>
                                                        <DeviceTypeSelector
                                                            {...field}
                                                            placeholder="Select device type"
                                                            label="Device type"
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
                                            name="brand"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Brand</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter device name"
                                                            type="text"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>

                                <div className="grid grid-col-1 lg:grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="model_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Model Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            {...field}
                                                            placeholder="Enter model number"
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
                                            name="selling_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Selling Price</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            placeholder="What is the selling price?"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-col-1 lg:grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="technical_specs"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Specifications</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter device specs as JSON"
                                                        value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value || ''}
                                                        onChange={(e) => {
                                                            try {
                                                                const parsedValue = JSON.parse(e.target.value);
                                                                field.onChange(parsedValue);
                                                            } catch (error) {
                                                                // Handle invalid JSON input
                                                                console.error("Invalid JSON input");
                                                            }
                                                        }}
                                                        className="resize-none"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>


                                <div className="flex h-5 items-center space-x-4 mt-10">
                                    <CancelButton />
                                    <Separator orientation="vertical" />
                                    <SubmitButton
                                        isPending={isPending}
                                        label={item ? "Update Device" : "Add Device"}
                                    />
                                </div>


                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default DeviceForm