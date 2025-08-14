import { AllCollections } from "../AllCollections";
import { useQuery } from "@tanstack/react-query";
import { getCollection } from "../../../api";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useUserTenantId } from "@/hooks/useTenantId";

const Collection = ({ id }: { id: string | undefined }) => {
  const tenantIdFromHook = useUserTenantId();

  const finalTenantId = useMemo(() => {
    return tenantIdFromHook || id;
  }, [tenantIdFromHook, id]);

  const {
    data: collections = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["collections", finalTenantId],
    queryFn: () => getCollection(finalTenantId as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!finalTenantId,
  });

  const collectionData = useMemo(() => {
    return collections || [];
  }, [collections]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load collections.");
    }
  }, [isError, error]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No collections yet. Click “Create Collection” to start.
        </div>
      ) : (
        <AllCollections collections={collectionData} />
      )}
    </div>
  );
};

export default Collection;
