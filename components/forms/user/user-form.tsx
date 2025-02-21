'use client'
import { Button } from "@/components/ui/button"
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
import { signUp } from "@/lib/actions/auth/signIn"
import RoleSelect from "@/components/widgets/roleSelector"
import { UserSchema } from "@/types/users/schema"
import { User } from "@/types/users/type"
import UserTypeSelect from "@/components/widgets/userTypeSelector"
import toast from "react-hot-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"


export function UserForm({ item }: { item: User | null | undefined }) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      ...item,
      first_name: item?.first_name || "",
      last_name: item?.last_name || "",
      email: item?.email || "",
      phone: item?.phone || "",
      password: item?.password || "",
      role: item ? (typeof item.role === 'string' ? item.role : "") : "",
      user_type: item?.user_type || "",
    }
  })

  const onInvalid = useCallback((errors: FieldErrors) => {
    console.log(errors)
  }, [])

  const onSubmitData = useCallback(async (values: z.infer<typeof UserSchema>) => {
    console.log("The values passed are ", values);

    startTransition(async () => {
      const result = await signUp(values);

      if (result?.error) {
        console.error("Sign-up error:", result.error);

        if (result.status === 400) {
          form.setError("root", { message: "Invalid data provided." });
        } else if (result.status === 422) {
          form.setError("email", { message: "Email already exists." });
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              type="text"
                              {...field}
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
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder="Enter last name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Second row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter user email"
                              type="email"
                              {...field}
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Third row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Enter password"
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
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Role</FormLabel>
                          <FormControl>
                            <RoleSelect
                              {...field}
                              placeholder="Select user role"
                              label="User Role"
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
                      name="user_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Type</FormLabel>
                          <FormControl>
                            <UserTypeSelect
                              {...field}
                              placeholder="Select user type"
                              label="User Type"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={isPending} onClick={() => toast.success("User added successfully")}>
                    {isPending ? "Updating user..." : "Add User"}
                  </Button>
            
                </div>


              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}