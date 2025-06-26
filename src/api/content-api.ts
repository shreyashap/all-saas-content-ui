import { type ContentFormType } from "./../zod-schemas/SingleContentSchema";
import api from ".";

export const createContent = async (data: ContentFormType) => {
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
