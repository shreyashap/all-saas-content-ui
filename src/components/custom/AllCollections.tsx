import { deleteCollection } from "../../api";
import { CollectionCard } from "./CollectionCard";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export interface Collection {
  _id: string;
  name: string;
  collectionId: string;
  title: string;
  description: string;
  category?: string;
  author?: string;
  language: string;
  difficulty: string;
  status: string;
  tags?: string[];
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
    <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:block gap-4 md:gap-6">
      {collections.map((col) => (
        <CollectionCard
          key={col.collectionId}
          title={col.name}
          description={col.description}
          status={col.status}
          langauge={col.language}
          onView={() => navigate(`/dashboard/${col.collectionId}`)}
          onEdit={() => alert(`Edit ${col.title}`)}
          onDelete={() => handleDelete(col.collectionId)}
        />
      ))}
    </div>
  );
};
