'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useTransition } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import SubmitButton from "../widgets/submit-button";
import CancelButton from "../widgets/cancel-button";
import { RequestSubscriptionSchema } from "@/types/location/schema";
import { Textarea } from "../ui/textarea";
import { requestSubscription } from "@/lib/actions/location";
import { Location } from "@/types/location/type";
import PaymentMeansSelector from "../widgets/select";
import { Alert, AlertDescription } from "../ui/alert";
import toast from "react-hot-toast";

function RequestSubscriptionForm({ location }: { location: Location }) {
    const [isPending, startTransition] = useTransition()
    const [formError, setFormError] = useState<string | null>(null);


    console.log("The location requesting for subscription ", location)


    const form = useForm<z.infer<typeof RequestSubscriptionSchema>>({
        resolver: zodResolver(RequestSubscriptionSchema),
        defaultValues: {
            location: location.id,
            location_name: location.name,
            payment_type: ""
        }
    })

    const onInvalid = useCallback(
        (errors: FieldErrors) => {
            console.log(errors);
            setFormError(
                typeof errors.message === 'string' && errors.message
                    ? errors.message
                    : "Please correct the errors below before submitting."
            );
        },
        []
    );

    const onSubmitData = useCallback((values: z.infer<typeof RequestSubscriptionSchema>) => {

        setFormError(null);
        startTransition(() => {
            requestSubscription(values)
                .then((data) => {
                    if (data?.error) {
                        console.error('Request subscription error:', data.error);
                        // Handle specific database error codes
                        if (data.error instanceof Error && data.error.message.includes('23505') && data.error.message.includes('reference')) {
                            setFormError("This reference number has already been used. Please enter a different reference number.");
                        } else if (data.error instanceof Error && data.error.message) {
                            // Use the error message if available
                            setFormError(data.error.message);
                        } else {
                            setFormError("An error occurred while processing your request. Please try again.");
                        }
                    } else {
                        toast.success("Subscription request submitted successfully")
                    }
                })
                .catch((error) => {
                    console.error('Unexpected error:', error);
                    setFormError("An unexpected error occurred. Please try again later.");
                });
        });
    }, [toast]);
    return (
        <Form {...form}>
            <div className="w-full max-w-sm mx-auto">
                {formError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription className="text-center">
                            {formError}
                        </AlertDescription>
                    </Alert>
                )}
                <form onSubmit={form.handleSubmit(onSubmitData, onInvalid)}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reference Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter reference number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>Optional for cash payments</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g 2 months"
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(Number(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        Specify how many months you‘d like to request for
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="payment_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Type</FormLabel>
                                    <FormControl>
                                        <PaymentMeansSelector value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Describe</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Please narrate here..." {...field} />
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
                            label='Request'
                        />
                    </div>
                </form>
            </div>
        </Form>
    )
}

export default RequestSubscriptionForm