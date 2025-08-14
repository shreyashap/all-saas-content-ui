import api from ".";
import { type CreateCollectionType } from "../types";

export const getCollection = async (tenantId: string) => {
  const res = await api.get(`/collection/get-collection/${tenantId}`);
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
  const res = await api.delete(`/collection/delete/${collectionId}`);
  return res.data;
};

export const getContentByCollectionId = async (filters: {
  collectionId: string;
  contentType?: string;
  language?: string;
  page: number;
  tenantId: string;
}) => {
  let res;
  if (filters.contentType && filters.language) {
    res = await api.get(
      `/content/pagination?collectionId=${filters.collectionId}&type=${filters.contentType}&language=${filters.language}&page=${filters.page}&tenantId=${filters.tenantId}`
    );
  } else if (filters.contentType) {
    res = await api.get(
      `/content/pagination?collectionId=${filters.collectionId}&type=${filters.contentType}&tenantId=${filters.tenantId}`
    );
  } else if (filters.language) {
    res = await api.get(
      `/content/pagination?collectionId=${filters.collectionId}&language=${filters.language}&tenantId=${filters.tenantId}`
    );
  } else {
    res = await api.get(
      `/content/pagination?collectionId=${filters.collectionId}&page=${filters.page}&tenantId=${filters.tenantId}`
    );
  }

  return res.data;
};
