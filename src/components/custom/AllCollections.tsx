import { deleteCollection } from "../../api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  BookText,
  Clock,
  ClockFading,
  Eye,
  Globe,
  GraduationCap,
  Tags,
  Trash,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface Collection {
  _id: string;
  name: string;
  collectionId: string;
  title: string;
  description: string;
  category: string;
  author: string;
  language: string;
  difficulty: string;
  status: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const AllCollections = ({
  collections,
}: {
  collections: Collection[];
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      await deleteCollection(collectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Delete successfull");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete collection.");
    },
  });

  const handleDelete = async (collectionId: string) => {
    deleteCollectionMutation.mutate(collectionId);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {collections.length === 0 ? (
        <div className="p-4 font-semibold text-xl">No collection found</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700 text-md md:text-lg">
              All Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collections.map((collection) => (
                    <tr
                      key={collection._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold text-gray-900 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {collection.name}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {collection.description || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4 text-green-600" />
                          {collection.language || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4 text-purple-600" />
                          {collection.author || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Badge
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            collection.status === "live"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : collection.status === "draft"
                              ? "bg-gray-100 text-gray-800 border-gray-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {collection.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {collection.tags?.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5 flex items-center gap-1"
                            >
                              <Tags className="w-3 h-3" /> {tag}
                            </Badge>
                          ))}
                          {collection.tags && collection.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{collection.tags.length - 2} more
                            </span>
                          )}
                          {(!collection.tags ||
                            collection.tags.length === 0) && (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <BookText className="w-4 h-4 text-blue-600" />
                          {collection.category || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ClockFading className="w-4 h-4 text-gray-500" />
                          {new Date(collection.updatedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/dashboard/${collection.collectionId}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleDelete(collection.collectionId)
                            }
                            variant="destructive"
                            size="sm"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
