"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useTransition } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";
import SubmitButton from "../widgets/submit-button";
import CancelButton from "../widgets/cancel-button";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { FeedbackSchema } from "@/types/owners/feedbackSchema";
import FollowUpTypeSelector from "../widgets/followUpSelector";
import { feedbackProp } from "../widgets/feedback_dialog";
import { recordFeedback } from "@/lib/actions/business-owners";
import { Input } from "../ui/input";

function  RecordFeedbackForm({ ownerId, onSuccess }: feedbackProp & { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      internalFollowUpTypeId: "",
      remarks: "",
      nextFollowUpDate: "",
      userId: ownerId,
    },
  });

 

  const onInvalid = useCallback((errors: FieldErrors) => {
    console.log("Form validation errors:", errors);
    setFormError(
      typeof errors.message === "string" && errors.message
        ? errors.message
        : "Please correct the errors below before submitting.",
    );
  }, []);

  const onSubmitData = useCallback(
    (values: z.infer<typeof FeedbackSchema>) => {
      console.log("Form submission values:", values);
      setFormError(null);

      const submitValues = {
        ...values,
        nextFollowUpDate: values.nextFollowUpDate 
          ? new Date(values.nextFollowUpDate).toISOString() 
          : undefined
      };

      startTransition(async () => {
        try {
          await recordFeedback(submitValues);
          onSuccess?.();
          form.reset()
        } catch (error) {
          setFormError("Failed to record feedback. Please try again.");
        }
      });
    },
    [onSuccess , form],
  );

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
              name="internalFollowUpTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-Up Type</FormLabel>
                  <FormControl>
                    <FollowUpTypeSelector
                      {...field}
                      placeholder="Select follow up type"
                      label="FollowUp Type"
                      value={field.value}
                      onChange={(selectedValue) => {
                        // If selectedValue is an object, extract the ID
                        if (
                          selectedValue &&
                          typeof selectedValue === "object" &&
                          "id" in selectedValue
                        ) {
                          field.onChange(selectedValue.id);
                        } else {
                          field.onChange(selectedValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextFollowUpDate"
              render={({ field }) => {
                console.log("=== FormField Debug ===");
    
                return (
                  <FormItem>
                    <FormLabel>Next FollowUp</FormLabel>
                    <FormControl>
                      
                      <Input
                      {...field}
                      type="date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Remark</FormLabel>
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
            <SubmitButton isPending={isPending} label="Record" />
          </div>
        </form>
      </div>
    </Form>
  );
}

export default RecordFeedbackForm;