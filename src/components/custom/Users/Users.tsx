import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, Loader, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getAllUsers, getUsers } from "@/api/user-api";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserTenantId } from "@/hooks/useTenantId";
import { useLocation } from "react-router-dom";

const Users = ({ id }: { id: string | undefined }) => {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }

  //   interface UserType{
  //     user : User[]
  //   }

  const queryClient = useQueryClient();

  const [deleteUserId, setDeleteUserId] = useState("");
  const location = useLocation();
  const isTenantPage = location.pathname.includes("tenant");

  const userData = useUser();
  const userId = userData?._id;

  const tenantIdFromHook = useUserTenantId();

  const finalTenantId = useMemo(() => {
    return tenantIdFromHook || id;
  }, [tenantIdFromHook, id]);

  // const finalTenantId = useMemo(() => {
  //   return tenantId || id;
  // }, [tenantId, id]);

  // const user = localStorage.getItem("user");
  // let userId: string | null = null;
  // if (user) {
  //   const parsedUser = JSON.parse(user);
  //   userId = parsedUser._id;
  // }

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", userId, finalTenantId],
    queryFn: () =>
      isTenantPage
        ? getUsers(userId!, finalTenantId!)
        : userData?.role === "SuperAdmin"
        ? getAllUsers()
        : getUsers(userId!, finalTenantId!),
    enabled: !!userId && !!finalTenantId,
    staleTime: 5 * 60 * 1000,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", userId, finalTenantId],
      });
      toast.success("User deleted successfully");
      setDeleteUserId("");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Failed to delete user");
      setDeleteUserId("");
    },
  });

  const handleDeleteUser = (id: string) => {
    setDeleteUserId(id);
    deleteUserMutation.mutate(id);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {isLoading ? (
        <div className="p-4 font-semibold text-xl">Loading...</div>
      ) : users && users.length === 0 ? (
        <div className="p-4 font-semibold text-xl">No users found</div>
      ) : (
        <Card className="shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 text-md md:text-lg">
              Existing Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users && users?.length === 0 ? (
              <p className="text-center text-gray-500">No users created yet.</p>
            ) : (
              <div className="w-full overflow-auto rounded-md border border-gray-200">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b bg-gray-50">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Email
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">
                        Role
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
                    {users?.map((user: User) => (
                      <tr
                        key={user._id}
                        className="border-b transition-colors hover:bg-gray-100"
                      >
                        <td className="p-4 align-middle font-medium">
                          {user.name}
                        </td>
                        <td className="p-4 align-middle">{user.email}</td>
                        <td className="p-4 align-middle capitalize">
                          {user.role}
                        </td>
                        <td className="p-4 align-middle capitalize">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle capitalize">
                          <div className="inline-flex gap-4">
                            <Edit className="w-5 h-5 text-green-400 bg-green-50 hover:text-green-500 cursor-pointer" />
                            {deleteUserMutation.isPending &&
                            deleteUserId === user._id ? (
                              <Loader className="w-5 h-5 animate-spin text-red-400" />
                            ) : (
                              <Trash2
                                className="w-5 h-5 text-red-400 bg-red-50 hover:text-red-500 cursor-pointer"
                                onClick={() => handleDeleteUser(user._id)}
                              />
                            )}
                          </div>
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

export default Users;
