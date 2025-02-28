import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { resetPasswordSchema } from "@/types/auth/resetPasswordSchema";
import { resetPassword } from "@/lib/actions/auth/signIn";
import { Eye, EyeOff } from "lucide-react";

export function UpdatePasswordForm({ userId}: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isView, setIsView] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await resetPassword(userId, values);
      
      if (response?.error || response?.responseType === "error") {
        const errorMessage = response.message || "Something went wrong. Please try again.";
        toast.error(errorMessage);
        form.setError("root", { message: errorMessage });
      } else {
        toast.success("Password updated successfully!");
        
        if (response?.redirectTo) {
          window.location.href = response.redirectTo;
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
      <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative items-center">
                            <Input
                              type={isView ? "text" : "password"}
                              id="password"
                              // className={inputLead}
                              placeholder=" "
                              {...field}
                            />
                            {isView ? (
                              <Eye
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => {
                                  setIsView(!isView)
                                }}
                                size={20}
                              />
                            ) : (
                              <EyeOff
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => setIsView(!isView)}
                                size={20}
                              />
                            )}

                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
        )}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
}