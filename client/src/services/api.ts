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
    const response = await api.get(`/teachers`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giáo viên:", error.response?.data || error.message);
    throw error;
  }
};

export const getTeacher = async (searchQuery: string) => {
  try {
    const response = await api.get(`/teachers/search`, { params: { name: searchQuery,username: searchQuery,email:searchQuery,phone:searchQuery} });
    return response.data.data.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm giáo viên:", error.response?.data || error.message);
    throw error;
  }
};

export const addTeacher = async (teacherData: FormData) => {
  try {
    const response = await api.post(`/teachers`, teacherData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm giáo viên:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTeacher = async (id: number, teacherData: FormData) => {
  try {
    // Thêm _method=PUT để Laravel hiểu đây là PUT request
    teacherData.append("_method", "PUT");

    const response = await api.post(`/teachers/${id}`, teacherData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật giáo viên:", error.response?.data || error.message);
    throw error;
  }
};



export const deleteTeacher = async (id:number) => {
  try {
    const response = await api.delete(`/teachers/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi xóa giáo viên:", error.response?.data || error.message);
    throw error;
  }
};

export const login =async (username:string , password:string)=>{
  try {
    const response = await api.post(`auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập", error.response?.data ||error.message)
    throw error;
  }
}