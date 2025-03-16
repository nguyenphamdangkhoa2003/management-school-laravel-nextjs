"use client";

import { getTeachers, getSubjects, addSubjectTeacher,updateSubjectTeacher } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";


const schema = (type: "create" | "update") =>
  z.object({
    id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
    subjectId: z.string().min(1, { message: "Vui lòng chọn môn học" }),
    teacherId: z.string().min(1, { message: "Vui lòng chọn giảng viên" }),
  }).refine((data) => {
    if (type === "update" && !data.id) {
      return false;
    }
    return true;
  }, { message: "ID là bắt buộc khi cập nhật", path: ["id"] });
type Inputs = z.infer<typeof schema>;

const SubjectTeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema(type)),
    defaultValues: {
      subjectId: data?.subjectId || "",
      teacherId: data?.teacherId || "",
      
    },
  });

  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const firstPage = await getSubjects(1, 10);
        const totalPages = firstPage.meta?.last_page || 1;

        const allSubjectPages = await Promise.all(
          Array.from({ length: totalPages }, (_, i) => getSubjects(i + 1, 10))
        );
        const allSubjects = allSubjectPages.flatMap((page) => page.data);
        setSubjects(allSubjects);

        if (type === "update" && data?.subjectId) {
          setValue("subjectId", String(data.subjectId));
        }
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    };

    const fetchTeachers = async () => {
      try {
        const firstPage = await getTeachers(1, 10);
        const totalPages = firstPage.meta?.last_page || 1;

        const allTeacherPages = await Promise.all(
          Array.from({ length: totalPages }, (_, i) => getTeachers(i + 1, 10))
        );
        const allTeachers = allTeacherPages.flatMap((page) => page.data);
        setTeachers(allTeachers);

        if (type === "update" && data?.teacherId) {
          setValue("teacherId", String(data.teacherId));
        }
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    };

    fetchSubjects();
    fetchTeachers();
  }, [type, data, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    const subjectTeacherData = new FormData();
    subjectTeacherData.append("teacher_id", formData.teacherId);
    subjectTeacherData.append("subject_id", formData.subjectId);

    try {
      if (type === "create") {
        await addSubjectTeacher(subjectTeacherData);
        setTimeout(() => window.location.reload(), 1500);
      }else if (type === "update") {
        subjectTeacherData.append("id", formData?.id);
        await updateSubjectTeacher(formData?.id, subjectTeacherData);
        setTimeout(() => window.location.reload(), 1500);
      }
      setShowForm(false);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        type === "create"
          ? "Giảng viên đang dạy môn học này"
          : "Lỗi cập nhật môn học cho giảng viên"
      );
    }
  });

  return (
    <>
      {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">
            {type === "create" ? "Thêm môn học cho giảng viên" : "Cập nhật"}
          </h1>
          <span className="text-xs text-gray-400 font-medium">
            Nhập thông tin
          </span>

          <div className="flex flex-col gap-4">
            {data &&(
                    <InputField
                        label="id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                    )
                }
            {/* Select chọn môn học */}
            <div>
              <label className="block font-medium">Chọn môn học</label>
              <select
                {...register("subjectId")}
                className="w-full p-2 border rounded-md"
                defaultValue={data?.subjectId || ""}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects?.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                    selected={subject.id === data?.subjectId}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <p className="text-red-500 text-sm">{errors.subjectId.message}</p>
              )}
            </div>

            {/* Select chọn giảng viên */}
            <div>
              <label className="block font-medium">Chọn giảng viên</label>
              <select
                {...register("teacherId")}
                className="w-full p-2 border rounded-md"
                defaultValue={data?.teacherId || ""}
              >
                <option value="">-- Chọn giảng viên --</option>
                {teachers?.map((teacher) => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                    selected={teacher.id === data?.teacherId}
                  >
                    {teacher.surname + " " + teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <p className="text-red-500 text-sm">{errors.teacherId.message}</p>
              )}
            </div>
          </div>

          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Thêm môn học cho giảng viên" : "Cập nhật"}
          </button>
        </form>
      ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">
              ✅ Thêm môn học cho giảng viên thành công!
            </p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">
              ✅ Cập nhật môn học cho giảng viên thành công!
            </p>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-red-500 mb-1">Lỗi</h2>
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectTeacherForm;
