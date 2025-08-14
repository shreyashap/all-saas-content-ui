import axios from "axios";

export const getUsers = async (userId: string, tenantId: string) => {
  const res = await axios.get(
    `http://localhost:3000/v1/user/my-users?userId=${userId}&tenantId=${tenantId}`
  );
  return res.data.users;
};

export const getAllUsers = async () => {
  const res = await axios.get(`http://localhost:3000/v1/user/get-all-users`);
  return res.data.users;
};

export const createUser = async (data: {
  name: string;
  email: string;
  role: "Admin" | "Author" | "Reviewer";
  password: string;
  createdBy: string;
  tenantId: string;
}) => {
  const res = await axios.post(
    "http://localhost:3000/v1/user/create-user",
    data
  );
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post("http://localhost:3000/v1/user/login", data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(
    `http://localhost:3000/v1/user/delete-user/${id}`
  );
  return res.data;
};
