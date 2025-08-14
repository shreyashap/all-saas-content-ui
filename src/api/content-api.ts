import api from ".";
import type { ContentItem } from "../types";

export const getContentById = async (id: string) => {
  const res = await api.get(`/content/${id}`);
  return res.data;
};

export const createContent = async (
  data: Partial<Omit<ContentItem, "_id">>
) => {
  const res = await api.post("/content", data);
  return res.data;
};

export const uploadBulkContent = async (formData: FormData) => {
  const res = await api.post("/content/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

export const updateContent = async (
  contentId: string,
  data: Partial<ContentItem>
) => {
  const res = await api.put(`/content/${contentId}`, data);
  return res.data;
};

export const deleteContent = async (id: string) => {
  const res = await api.delete(`/content/${id}`);
  return res.data.deleted;
};

export const deleteManyContents = async (ids: string[]) => {
  const res = await api.delete("/content/bulk-delete", { data: { ids } });
  return res;
};

export const getAllContent = async () => {
  const res = await api.get("/content");
  return res.data;
};

export const searchAndFilter = async (data: {
  language?: string;
  tokenArr?: string;
  contentType?: string;
}) => {
  if (!data.contentType) {
    data.contentType = "Text";
  }

  if (!data.language) {
    data.language = "en";
  }
  const res = await api.post("/content/getContentByFilters", data);
  return res.data;
};
