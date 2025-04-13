import axios from "axios";
import { useParams } from "next/navigation";
import moment from "moment";
import exp from "constants";
const API_BASE_URL = "https://khachsan2k.id.vn/api";
const API_URL = "https://khachsan2k.id.vn/api/grades";
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
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách giáo viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOneTeachers = async (id: number) => {
  try {
    const response = await api.get(`/teachers/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy giảng viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getTeacher = async (searchQuery: string) => {
  try {
    const response = await api.get(`/teachers/search`, {
      params: {
        name: searchQuery,
        username: searchQuery,
        email: searchQuery,
        phone: searchQuery,
      },
    });
    return response.data.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi tìm kiếm giáo viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addTeacher = async (teacherData: FormData) => {
  try {
    const response = await api.post(`/teachers`, teacherData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm giáo viên:",
      error.response?.data || error.message
    );
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
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật giáo viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTeacher = async (id: number) => {
  try {
    const response = await api.delete(`/teachers/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi xóa giáo viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// SINH VIÊN
export const getStudents = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/students`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách sinh viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOneStudents = async (id: number) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy thông tin sinh viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const getStudent = async (search: string) => {
  try {
    const response = await api.get(`/students/search`, {
      params: {
        name: search,
        username: search,
        email: search,
        phone: search,
        code: search,
      },
    });
    return response.data.data.data;
  } catch (error: any) {
    console.error("Lỗi tìm sinh viên", error.response?.data || error.message);
    throw error;
  }
};

export const deleteStudent = async (id: number) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa sinh viên", error.response?.data || error.message);
    throw error;
  }
};

export const addStudent = async (Data: FormData) => {
  try {
    const response = await api.post(`/students`, Data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm sinh viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateStudent = async (id: number, studentData: FormData) => {
  try {
    studentData.append("_method", "PUT");

    const response = await api.post(`/students/${id}`, studentData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật sinh viên",
      error.response?.data || error.message
    );
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
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách môn học:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getSubject = async (search: string) => {
  try {
    const response = await api.get(`/subjects/search`, {
      params: { name: search },
    });
    return response.data.data.data;
  } catch (error: any) {
    console.error("Lỗi tìm môn học", error.response?.data || error.message);
    throw error;
  }
};
export const deleteSubject = async (id: number) => {
  try {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa môn học", error.response?.data || error.message);
    throw error;
  }
};
export const addSubject = async (Data: FormData) => {
  try {
    const response = await api.post(`/subjects`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm môn học:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateSubject = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/subjects/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật môn học:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getSubjectTeachers = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/subject-teachers`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách môn học theo giáo viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const addSubjectTeacher = async (Data: FormData) => {
  try {
    const response = await api.post(`/subject-teachers`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm môn học:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateSubjectTeacher = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/subject-teachers/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật môn học:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteSubjectTeacher = async (id: number) => {
  try {
    const response = await api.delete(`/subject-teachers/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa môn học", error.response?.data || error.message);
    throw error;
  }
};
//LỚP
export const getClasses = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/school-classes`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách lớp:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getClass = async (search: string) => {
  try {
    const response = await api.get(`/school-classes/search`, {
      params: { name: search },
    });
    return response.data.data.data;
  } catch (error: any) {
    console.error("Lỗi tìm lớp học", error.response?.data || error.message);
    throw error;
  }
};

export const addClass = async (Data: FormData) => {
  try {
    const response = await api.post(`/school-classes`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm Lớp học:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateClass = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/school-classes/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật lớp học:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteSClass = async (id: number) => {
  try {
    const response = await api.delete(`/school-classes/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa lớp học", error.response?.data || error.message);
    throw error;
  }
};
//PHỤ HUYNH

export const getParents = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/guardians`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách phụ huynh:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getParent = async (search: string) => {
  try {
    const response = await api.get(`/guardians/search`, {
      params: { name: search, username: search, email: search, phone: search },
    });
    return response.data.data.data;
  } catch (error: any) {
    console.error("Lỗi tìm phụ huynh", error.response?.data || error.message);
    throw error;
  }
};
export const deleteParent = async (id: number) => {
  try {
    const response = await api.delete(`/guardians/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa phụ huynh", error.response?.data || error.message);
    throw error;
  }
};
export const addParent = async (Data: FormData) => {
  try {
    const response = await api.post(`/guardians`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm phụ huynh:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateParent = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/guardians/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi cập nhật phụ huynh:",
      error.response?.data || error.message
    );
    throw error;
  }
};
//BÀI GIẢNG
export const getLessons = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/lessons`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách bài giảng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const dayMapping: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export const getLessonsByTeacherid = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lessons/${id}/teachers`);
    const rawData = response.data.data;

    const filteredData = rawData.map((item: any) => {
      return {
        title: item.subject_teacher.subject.name,
        teacher: item.subject_teacher.teacher.name,
        link: item.link,
        allDay: false,
        startDate: moment(item.startTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DD"
        ),
        endDate: moment(item.endTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DD"
        ),
        startTime: moment(item.class_time, "HH:mm:ss").format("HH:mm:ss"),
        endTime: moment(item.ending_class_time, "HH:mm:ss").format("HH:mm:ss"),
        room: item.room.code_room,
        repeat: "weekly",
        dayOfWeek: dayMapping[item.day],
        id: item.id,
      };
    });
    console.log(filteredData);
    return filteredData;
  } catch (error: any) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

export const getLessonsForStudentLesson = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/lessons`, {
      params: { page, per_page: perPage },
    });
    const rawData = response.data.data;
    const meta = response.data.meta;

    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const filteredData = rawData
      .filter((item: any) => {
        const startDate = new Date(item.startTime);
        return startDate.getFullYear() >= year && startDate.getMonth() >= month;
      })
      .map((item: any) => ({
        value: item.id,
        subject: item.subject_teacher.subject.name,
        teacher: item.subject_teacher.teacher.name,
        day: item.day,
        Time: `${moment(item.class_time, "HH:mm:ss").format(
          "HH:mm"
        )} - ${moment(item.ending_class_time, "HH:mm:ss").format("HH:mm")}`,
      }));

    console.log("Filtered Data:", filteredData);

    return { data: filteredData, meta };
  } catch (error: any) {
    console.error("Lỗi khi gọi API:", error);
    return { data: [], meta: {} };
  }
};

//lesson
export const getLessonByStudentid = async (id: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/attendances/${id}/students`
    );
    const rawData = response.data.data;

    const filteredData = rawData.map((item: any) => {
      return {
        title: item.lesson.subject_teacher.subject.name,
        teacher: item.lesson.subject_teacher.teacher.name,
        link: item.lesson.link,
        allDay: false,
        startDate: moment(item.lesson.startTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DD"
        ),
        endDate: moment(item.lesson.endTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DD"
        ),
        startTime: moment(item.lesson.class_time, "HH:mm:ss").format(
          "HH:mm:ss"
        ),
        endTime: moment(item.lesson.ending_class_time, "HH:mm:ss").format(
          "HH:mm:ss"
        ),
        room: item.lesson.room.code_room,
        repeat: "weekly",
        dayOfWeek: dayMapping[item.lesson.day],
        id: item.id,
      };
    });
    console.log(filteredData);
    return filteredData;
  } catch (error: any) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

export const getAllStudentByLessonId = async (
  id: number,
  page = 1,
  perPage = 10
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/attendances/${id}/lessons`,
      {
        params: { page, per_page: perPage },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

export const getLesson = async (search: string) => {
  try {
    const response = await api.get(`/lessons/search`, {
      params: { name: search },
    });
    return response.data.data.data;
  } catch (error: any) {
    console.error("Lỗi tìm bài giảng", error.response?.data || error.message);
    throw error;
  }
};

export const addLesson = async (Data: FormData) => {
  try {
    const response = await api.post(`/lessons`, Data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm bài giảng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateLesson = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/lessons/${id}`, Data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật bài giảng:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteLesson = async (id: number) => {
  try {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa bài giảng", error.response?.data || error.message);
    throw error;
  }
};

//NIÊN KHÓA
export const getGrades = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/grades`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách bài giảng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchGrades = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createGrade = async (gradeData: any) => {
  const response = await axios.post(API_URL, gradeData);
  return response.data;
};

export const modifyGrade = async (id: number, gradeData: any) => {
  const response = await axios.put(`${API_URL}/${id}`, gradeData);
  return response.data;
};

export const removeGrade = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

//phòng học
export const getAllrooms = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách phòng học",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addroom = async (Data: FormData) => {
  try {
    const response = await api.post("/rooms", Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi thêm phòng học:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateroom = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/rooms/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật phòng học:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteroom = async (id: number) => {
  try {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa lớp học", error.response?.data || error.message);
    throw error;
  }
};
//Đăng ký môn
export const getAllAttendance = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/attendances`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách đăng ký môn",
      error.response?.data || error.message
    );
    throw error;
  }

}

export const addAttendance = async (Data: FormData) => {
  try {
    const response = await api.post('/attendances', Data);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi đăng ký môn:", error.response?.data || error.message);
    throw error;
  }
}


export const updateAttendance = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/attendances/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật đăng ký môn:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteAttendance = async (id: number) => {
  try {
    const response = await api.delete(`/attendances/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa đăng ký môn", error.response?.data || error.message);
    throw error;
  }
}

//kết quả (result)
export const getAllresults = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/results`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách điểm",
      error.response?.data || error.message
    );
    throw error;
  }

}

export const getLessonsByStudentid = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/attendances/${id}/students`)
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách môn học theo sinh viên",
      error.response?.data || error.message
    );
    throw error;
  }
}
export const addResult = async (Data: FormData) => {
  try {
    const response = await api.post('/results', Data);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi Thêm điểm:", error.response?.data || error.message);
    throw error;
  }
}

export const updateResult = async (id: number, Data: any) => {
  try {
    Data.append("_method", "PUT");
    const response = await api.post(`/results/${id}`, Data);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật điểm:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteResult = async (id: number) => {
  try {
    const response = await api.delete(`/results/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi xóa điểm", error.response?.data || error.message);
    throw error;
  }
}

export const getResultByStudentId = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student-scores?student_id=${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách điểm",
      error.response?.data || error.message
    );
    throw error;
  }

}


//niên khóa
export const getAllgrades = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy danh sách lớp",
      error.response?.data || error.message
    );
    throw error;
  }
};


//thống kê
export const getDataChart = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi lấy dữ liệu biểu đồ",
      error.response?.data || error.message
    );
    throw error;
  }
}

//ĐĂNG NHẬP
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post(`auth/login`, { username, password });
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi đăng nhập", error.response?.data || error.message);
    throw error;
  }
};
