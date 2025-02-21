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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signInSchema } from "@/types/auth/signInSchema"
import { useCallback, useTransition } from "react"
import { SignIn } from "@/lib/actions/auth/signIn"
import { Alert, AlertDescription } from "@/components/ui/alert"
import toast from "react-hot-toast"
export function SignInForm() {
  const [isPending, startTransition] = useTransition()


  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmitData = useCallback((values: z.infer<typeof signInSchema>) => {
    form.clearErrors()
    startTransition(async () => {
      const response = await SignIn(values)
      if (response?.error) {
        if (response.status === 400) {
          form.setError("root", { message: response.message })
          toast.error(response.message)
        } else {
          form.setError("root", { message: "Something went wrong, please try again later" })
        }
        return;
      }
      if (response?.redirectTo) {
        window.location.href = response.redirectTo
      }

    })
  }, []
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
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
            <form onSubmit={form.handleSubmit(onSubmitData)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            required
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Signing In..." : "Sign In"}
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
