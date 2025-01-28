import { useToast } from "@/hooks/use-toast";
import { BusinessTypeSchema } from "@/types/business/schema";
import { BusinessType } from "@/types/business/types";
import { FormResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useTransition } from "react";
import { FieldErrors, useForm } from "react-hook-form";

import { set, z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

function BusinessTypeForm({ item }: { item: BusinessType | null | undefined }) {
    const [isPending, startTransition] = useTransition()
    const [response, setResponse] =useState<FormResponse | undefined>()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof BusinessTypeSchema>>({
        resolver: zodResolver(BusinessTypeSchema),
        defaultValues: {
            ...item,
            status: item ? item.status : false
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

    const onSubmitData = useCallback((values: z.infer<typeof BusinessTypeSchema>) => {
        console.log("The values passed are ", values)

        startTransition(() => {
            if(item){
                updateBusinessType(values).then((data) => {
                    if (data) setResponse(data) 
                })
            }else{
                createBusinessType(values).then((data) => {
                    if (data) setResponse(data)
                }).catch((error: any) => {
                    console.log(error)
                })
            }
        })
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitData, onInvalid)}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="Business Type" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}