"use client";
import { deleteTeacher, deleteStudent, deleteSClass, deleteSubject, deleteParent, deleteLesson, deleteSubjectTeacher } from "@/services/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";


const getIcon = (type: string) => {
  switch (type) {
    case "create":
      return "/plus.png";
    case "update":
      return "/edit.png";
    case "delete":
      return "/delete.png";
    default:
      return "";
  }
};


const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const LessonForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const AnnouncementForm = dynamic(() => import("./forms/announcement"), {
  loading: () => <h1>Loading...</h1>,
});
const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
  subject: (type, data) => <SubjectForm type={type} data={data} />,
  lesson: (type, data) => <LessonForm type={type} data={data} />,
  announcement: (type, data) => <LessonForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
        ? "bg-lamaSky"
        : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const Form = () => {
    const handleDelete = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id) return;
      try {
        if (table === "teacher") {
          await deleteTeacher(id);
          await deleteSubjectTeacher(id);
        }
        if (table === "student") {
          await deleteStudent(id);
        }
        if (table === "subject") {
          await deleteSubject(id);
        }
        if (table === "class") {
          await deleteSClass(id);
        }
        if (table === "parent") {
          await deleteParent(id);
        }
        if (table === "lesson") {
          await deleteLesson(id);
        }
        setSuccessMessage(`Xóa thành công!`);
        setShowSuccessModal(true);
        setOpen(false);
      } catch (error) {
        setOpen(false);
        if (table === "teacher") {
          setErrorMessage("Không thể xóa giáo viên này!");
        }
        if (table === "student") {
          setErrorMessage("Không thể xóa sinh viên này!");
        }
        if (table === "class") {
          setErrorMessage("Không thể xóa lớp học này!");
        }
        if (table === "subject") {
          setErrorMessage("Không thể xóa môn học này!");
        }
        if (table === "parent") {
          setErrorMessage("Không thể xóa phụ huynh này!");
        }
        if (table === "lesson") {
          setErrorMessage("Không thể xóa bài giảng này này!");
        }
        setShowErrorModal(true);
      }
    };
    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          Toàn bộ dữ liệu sẽ bị xóa, bạn có chắc chăn không? {table}?
        </span>
        <button onClick={handleDelete} className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Xóa
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={getIcon(type)} alt={`${type} icon`} width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close icon" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md relative w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] flex flex-col items-center text-center">
            <h2 className="text-red-600 text-lg font-semibold my-4">Lỗi</h2>
            <p>{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md relative w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] flex flex-col items-center text-center">
            <h2 className="text-green-600 text-lg font-semibold my-4">Thành công</h2>
            <p>{successMessage}</p>
            <button
              onClick={() => { setShowSuccessModal(false); window.location.reload() }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
