import axios from "axios";

export const getTenants = async (id: string) => {
  const res = await axios.get(
    `http://localhost:3000/v1/tenant/get-tenants/${id}`
  );
  return res.data.data;
};

export const createTenant = async (data: {
  name: string;
  description: string;
  createdBy: string;
}) => {
  const res = await axios.post(
    "http://localhost:3000/v1/tenant/create-tenant",
    data
  );
  return res.data;
};

export const deleteTenant = async (id: string) => {
  const res = await axios.delete(
    `http://localhost:3000/v1/tenant/delete-tenant/${id}`
  );
  return res.data;
};
