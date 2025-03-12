import axios from "axios";
import { useParams } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// GIẢNG VIÊN
export const getTeachers = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/teachers`, {
      params: { page, per_page: perPage },
    });
    return response.data; // Trả về toàn bộ dữ liệu gồm danh sách + meta
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

// HỌC SINH
export const getStudents = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/students`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sinh viên:", error.response?.data || error.message);
    throw error;
  }
};

export const getStudent =async (search :string)=>{
  try {
    const response=await api.get(`/students/search`,{params: {name: search, username: search, email:search, phone:search, code:search}});
    return response.data.data.data;
  } catch (error) {
    console.error("Lỗi tìm sinh viên", error.response?.data||error.message);
    throw error;
  }
}

export const deleteStudent =async (id:number)=>{
  try {
    const response =await api.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
      console.error("Lỗi xóa sinh viên", error.response?.data||error.message);
      throw error;
  }
}

export const addStudent = async (Data: FormData) => {
  try {
    const response = await api.post(`/students`, Data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sinh viên:", error.response?.data || error.message);
    throw error;
  }
};
//MÔN HỌC
export const getSubjects = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/subjects`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách môn học:", error.response?.data || error.message);
    throw error;
  }
};
export const getSubject =async (search :string)=>{
  try {
    const response=await api.get(`/subjects/search`,{params: {name: search}});
    return response.data.data.data;
  } catch (error) {
    console.error("Lỗi tìm môn học", error.response?.data||error.message);
    throw error;
  }
}
export const deleteSubject =async (id:number)=>{
  try {
    const response =await api.delete(`/subjects/${id}`);
    return response.data;
  } catch (error) {
      console.error("Lỗi xóa môn học", error.response?.data||error.message);
      throw error;
  }
}
//LỚP
export const getClasses = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/school-classes`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp:", error.response?.data || error.message);
    throw error;
  }
};

export const getClass =async (search :string)=>{
  try {
    const response=await api.get(`/school-classes/search`,{params: {name: search}});
    return response.data.data.data;
  } catch (error) {
    console.error("Lỗi tìm lớp học", error.response?.data||error.message);
    throw error;
  }
}
export const deleteSClass =async (id:number)=>{
  try {
    const response =await api.delete(`/school-classes/${id}`);
    return response.data;
  } catch (error) {
      console.error("Lỗi xóa lớp học", error.response?.data||error.message);
      throw error;
  }
}
//PHỤ HUYNH






//ĐĂNG NHẬP
export const login =async (username:string , password:string)=>{
  try {
    const response = await api.post(`auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập", error.response?.data ||error.message)
    throw error;
  }
}