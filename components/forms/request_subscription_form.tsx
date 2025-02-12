'use client'
import { useToast } from "@/hooks/use-toast";
import { BusinessTypeSchema } from "@/types/business/schema";
import { BusinessType } from "@/types/business/types";
import { FormResponse } from "@/types/types";
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
import { PaymentMeans } from "../widgets/combobox";
import { Textarea } from "../ui/textarea";
import { requestSubscription } from "@/lib/actions/location";
import { Location } from "@/types/location/type";

function RequestSubscriptionForm({location}:{location:Location}) {
    const [isPending, startTransition] = useTransition()
    const [response, setResponse] =useState<FormResponse | undefined>()
    const { toast } = useToast()

    console.log("The location requesting for subscription ", location)


    const form = useForm<z.infer<typeof RequestSubscriptionSchema>>({
        resolver: zodResolver(RequestSubscriptionSchema),
        defaultValues: {
            location:location.id
        }
    })

    const onInvalid = useCallback(
        (errors: FieldErrors) => {
            console.log(errors);
            toast({
                variant: "destructive",
                title: "Uh oh! something went wrong",
                description: typeof errors.message === 'string' && errors.message
                    ? errors.message
                    : "There was an issue submitting your form, please try later",
            });
        },
        []
    );

    const onSubmitData = useCallback((values: z.infer<typeof RequestSubscriptionSchema>) => {
    
        // console.log("The update values passed are ", values)

        startTransition(() => {
           
                requestSubscription(values).then((data) => {
                    if (data) setResponse(data)
                }).catch((error: any) => {
                    console.log(error)
                })
            
        })
    }, [])
    return (
        <Form {...form}>
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
                        <FormItem className="flex flex-col">
                        <FormLabel>Payment type</FormLabel>
                        <FormControl>
                            <PaymentMeans value={field.value} onChange={field.onChange} />
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
        </Form>
    )
}

export default RequestSubscriptionForm