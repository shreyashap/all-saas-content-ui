import api from ".";

export const getReviewerContent = async () => {
  const res = await api.get("/reviewer");
  return res.data.result;
};

export const reviewContent = async (
  contentId: string,
  reviewStatus: string,
  reviewer: string,
  flagReasons?: string | undefined
) => {
  const res = await api.patch(`/reviewer/${contentId}`, {
    reviewStatus,
    reviewer,
    flagReasons,
  });
  return res.data.data;
};
