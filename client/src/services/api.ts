import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getTeachers = async () => {
  try {
    const response = await api.get("/teachers");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giáo viên:", error.response?.data || error.message);
    throw error;
  }
};