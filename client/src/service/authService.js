import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth"
});

export const registerUser = async (formData) => {
  const response = await API.post("/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
