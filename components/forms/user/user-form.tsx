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
import { useCallback,useTransition } from "react"
import { signUp } from "@/lib/actions/auth/signIn"
import RoleSelect from "@/components/widgets/roleSelector"
import { UserSchema } from "@/types/users/schema"
export function UserForm() {
  const [isPending, startTransition] = useTransition()


  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {}
  })

  const onInvalid = useCallback(
    (errors: any) => {
      console.log(errors)
    
  },[])

  const onSubmitData = useCallback((values: z.infer<typeof UserSchema>) => {
    console.log("The values passed are ", values)
    startTransition(() => {
      signUp(values).then((data) => {
        if (data?.redirectTo) {
          window.location.href = data.redirectTo
        }
      })
    })
  }, []
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl"></CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitData,onInvalid)}>
              <div className="flex flex-col  gap-6">
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              type="firstName"
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="w-full">
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
                </div>
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="w-full">
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
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field}
                              placeholder="Enter password" />
                          </FormControl>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="w-full">
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



                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Update user" : "Add user"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
