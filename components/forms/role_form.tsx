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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FieldErrors, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCallback, useTransition } from "react"
import toast from "react-hot-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RoleSchema } from "@/types/role/schema"
import { Textarea } from "../ui/textarea"
import { Role } from "@/types/role/type"
import { Checkbox } from "../ui/checkbox"
import { SubmitButton } from "../widgets/submit-button"
import CancelButton from "../widgets/cancel-button"
import { Separator } from "../ui/separator"
import { updateRolePermissions } from "@/lib/actions/role-action"


export function RoleForm({ item }: { item: Role | null | undefined }) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      ...item,
      name: item?.name || "",
      description: item?.description || "",
      permissions: item?.permissions?.reduce((acc, { permission }) => ({
        ...acc,
        [permission.id]: permission.isSelected || false
      }), {}) || {}
    }
  });

  // Group permissions by module
  const groupedPermissions = item?.permissions.reduce((acc, { permission }) => {
    const moduleName = permission.module.name;
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }
    acc[moduleName].push(permission);
    return acc;
  }, {} as Record<string, Array<any>>) || {};

  const onInvalid = useCallback((errors: FieldErrors) => {
    console.log(errors)
  }, [])

  const onSubmitData = useCallback(async (values: z.infer<typeof RoleSchema>) => {
    startTransition(async () => {
      // Only pass the permissions object
      const result = await updateRolePermissions(item?.id!, values.permissions || {});
      
      if (!result.success) {
        form.setError("root", { 
          message: result.error || "Failed to update permissions" 
        });
        return;
      }
  
      toast.success("Role permissions updated successfully");
    });
  }, [item?.id]);

  
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
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              type="text"
                              {...field}
                              disabled
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-6">
                  <h3 className="text-lg font-semibold">Permissions</h3>
                  {Object.entries(groupedPermissions).map(([moduleName, permissions]) => (
                    <div key={moduleName} className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">{moduleName}</h4>
                      <div className="flex gap-4">
                        {permissions.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name={`permissions.${permission.id}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                <Checkbox
                                    checked={field.value || false}
                                    onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm">
                                    {permission.name}
                                  </FormLabel>
                                  <FormDescription>
                                    {permission.slug}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex h-5 items-center space-x-4 mt-10">
                        <CancelButton />
                        <Separator orientation="vertical" />
                        <SubmitButton
                            isPending={isPending}
                            label={item ? "Update role" : "Create role"}
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