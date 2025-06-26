import api from ".";
import { type CreateCollectionType } from "../types";

export const getCollection = async () => {
  const res = await api.get("/collection");
  return res.data.data;
};

export const getByCollectionId = async (collectionId: string) => {
  const res = await api.get(`/collection/get/${collectionId}`);
  return res.data.collection;
};

export const createCollection = async (data: CreateCollectionType) => {
  const res = await api.post("/collection", data);
  return res.data;
};

export const deleteCollection = async (collectionId: string) => {
  const res = await api.delete(`/collection/${collectionId}`);
  return res.data;
};

export const getContentByCollectionId = async (collectionId: string) => {
  const res = await api.get(`/content?collectionId=${collectionId}`);
  return res.data.data;
};
