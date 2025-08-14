import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Loader, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { deleteTenant, getTenants } from "@/api/tenant-api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MyTenants = () => {
  interface Tenant {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
  }

  //   interface UserType{
  //     user : User[]
  //   }

  const queryClient = useQueryClient();

  const [deleteTenantId, setDeleteTenantId] = useState("");
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  let userId: string;
  if (user) {
    const parsedUser = JSON.parse(user);
    userId = parsedUser._id;
  }

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => getTenants(userId),
    staleTime: 5 * 60 * 1000,
  });

  const deleteTenantMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteTenant(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant deleted successfully");
      setDeleteTenantId("");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed to delete tenant");
      setDeleteTenantId("");
    },
  });

  const handleDeleteTenant = (id: string) => {
    setDeleteTenantId(id);
    deleteTenantMutation.mutate(id);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {isLoading ? (
        <div className="p-4 font-semibold text-xl">Loading...</div>
      ) : tenants?.length === 0 ? (
        <div className="p-4 font-semibold text-xl">No tenants found</div>
      ) : (
        <Card className="shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 text-md md:text-lg">
              Existing Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tenants && tenants?.length === 0 ? (
              <p className="text-center text-gray-500">
                No tenant created yet.
              </p>
            ) : (
              <div className="w-full overflow-auto rounded-md border border-gray-200">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b bg-gray-50">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Description
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Created At
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {tenants?.map((tenant: Tenant) => (
                      <tr
                        key={tenant._id}
                        className="border-b transition-colors hover:bg-gray-100"
                      >
                        <td className="p-4 align-middle font-medium">
                          {tenant.name}
                        </td>
                        <td className="p-4 align-middle">
                          {tenant.description}
                        </td>
                        <td className="p-4 align-middle capitalize">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle capitalize inline-flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/tenant/${tenant._id}`)}
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                          {deleteTenantMutation.isPending &&
                          deleteTenantId === tenant._id ? (
                            <Loader className="w-5 h-5 animate-spin text-red-400" />
                          ) : (
                            <Button variant="outline">
                              <Trash2
                                className="w-5 h-5 text-red-400 bg-red-50 hover:text-red-500 cursor-pointer"
                                onClick={() => handleDeleteTenant(tenant._id)}
                              />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyTenants;
