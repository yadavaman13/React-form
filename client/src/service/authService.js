import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth"
});

export const registerUser = async (formData) => {
  const res = await API.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await API.post("/login", credentials);
  return res.data;
};

export const getUser = async (id) => {
  const res = await API.get(`/user/${id}`);
  return res.data;
};

export const updateUser = async (id, formData) => {
  const res = await API.put(`/user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};
