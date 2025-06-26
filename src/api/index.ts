import axios from "axios";
import {
  createCollection,
  getCollection,
  deleteCollection,
} from "./collection-api";

const api = axios.create({
  baseURL: "http://localhost:3008/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
export { getCollection, createCollection, deleteCollection };
