import { toast } from "sonner";
import { Button } from "../../ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getReviewerContent, reviewContent } from "../../../api/reviewer-api";
import { FlagDialog } from "./FlagDialog";
import { useState } from "react";

interface ContentItem {
  _id: string;
  name: string;
  contentType: string;
  contentSourceData: any[];
  imagePath: string;
  reviewStatus: string;
  flagReasons?: string;
  flaggedBy?: string;
  language: string;
  contentId: string;
}

type ReviewPayload = {
  contentId: string;
  reviewStatus: string;
  reviewer: string;
  flagReasons?: string;
};

export default function ReviewerDashboard() {
  // const queryClient = useQueryClient();

  const [refreshIndex, setRefreshIndex] = useState(0);

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["reviewer", refreshIndex],
    queryFn: getReviewerContent,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const reviewContentMutation = useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      const { contentId, reviewStatus, reviewer, flagReasons } = payload;
      await reviewContent(contentId, reviewStatus, reviewer, flagReasons);
    },
    onSuccess: () => {
      toast.success(`Content reviewed`);
      setRefreshIndex((prev) => prev + 1);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update the review.");
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Review Content</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : contents.length === 0 ? (
        <p className="text-gray-500">No content pending for review.</p>
      ) : (
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:block gap-4 md:gap-6">
          {contents.map((content: ContentItem) => (
            <div
              key={content._id}
              className="bg-white rounded shadow p-4 border border-gray-200 w-full lg:mb-4"
            >
              <h3 className="text-lg font-bold">{content.name}</h3>
              <p className="text-sm text-gray-500">
                Type: {content.contentType}
              </p>
              <p className="text-sm text-gray-500">
                Language: {content.language}
              </p>

              {content.flagReasons && (
                <p className="mt-2 text-red-500 text-sm">
                  🚩 Previously flagged: {content.flagReasons}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={() =>
                    reviewContentMutation.mutate({
                      contentId: content.contentId,
                      reviewStatus: "approved",
                      reviewer: "reviewer@example.com",
                    })
                  }
                >
                  Approve
                </Button>

                <FlagDialog
                  onFlag={(reason) =>
                    reviewContentMutation.mutate({
                      contentId: content.contentId,
                      reviewStatus: "flagged",
                      reviewer: "reviewer@example.com",
                      flagReasons: reason,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
