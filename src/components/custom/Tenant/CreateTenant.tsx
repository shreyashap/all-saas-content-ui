import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { tenantSchema } from "@/zod-schemas/tenantSchema";
import { createTenant } from "@/api/tenant-api";

export default function CreateTenant() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createTenantMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      createdBy: string;
    }) => {
      await createTenant(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant created");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed to create tenant");
    },
  });

  const onSubmit = (values: z.infer<typeof tenantSchema>) => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUserInfo = JSON.parse(user);
      if (parsedUserInfo._id) {
        createTenantMutation.mutate({
          ...values,
          createdBy: parsedUserInfo._id,
        });
      }
    } else {
      toast.error("Failed to create tenant | Try again later");
    }
    reset();
  };

  return (
    <div className="font-sans mt-8">
      <div className="max-w-7xl mx-auto">
        {/* User Creation Card */}
        <Card className="shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 text-md md:text-lg">
              Create New Tenant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} />
                {errors.name && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter tenant description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900"
                disabled={createTenantMutation.isPending}
              >
                {createTenantMutation.isPending
                  ? "Creating..."
                  : "Create Tenant"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
