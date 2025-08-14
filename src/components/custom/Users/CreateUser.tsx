import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { userSchema } from "../../../zod-schemas/UserSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/user-api";
import { toast } from "sonner";

export default function CreateUser() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Author",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      role: "Admin" | "Author" | "Reviewer";
      password: string;
      createdBy: string;
      tenantId: string;
    }) => {
      await createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed to create user");
    },
  });

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    // let createUserData = { ...values, createdBy: "" };
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUserInfo = JSON.parse(user);
      if (parsedUserInfo._id) {
        if (parsedUserInfo.tenantId) {
          createUserMutation.mutate({
            ...values,
            createdBy: parsedUserInfo._id,
            tenantId: parsedUserInfo.tenantId,
          });
        } else {
          const id = localStorage.getItem("tenantId");
          if (!id) {
            toast.error("Failed to create user | try again later");
            return;
          }
          createUserMutation.mutate({
            ...values,
            createdBy: parsedUserInfo._id,
            tenantId: id,
          });
        }
      }
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
              Create New User
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role Select Field */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Content Type is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Author">Author</SelectItem>
                        <SelectItem value="Reviewer">Reviewer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*******"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
