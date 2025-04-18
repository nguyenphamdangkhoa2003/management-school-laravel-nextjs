"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { addTeacher, updateTeacher, getSubjects, addSubjectTeacher } from "@/services/api";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const schema = z.object({
  subjects: z.array(z.string()).optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  surname: z.string().min(1, { message: "First name is required!" }),
  name: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z
    .string()
    .min(1, { message: "Birthday is required!" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

interface Subject {
  id: string;
  name: string;
}

interface Teacher {
  id: number;
  username: string;
  email: string;
  surname: string;
  name: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: string;
  sex: "MALE" | "FEMALE";
  img?: string;
}

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
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
    resolver: zodResolver(schema),
  });
  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);

  useEffect(() => {
    if (type === "update" && id) {
      axios
        .get(`http://127.0.0.1:8000/api/teachers/${id}`)
        .then((res) => {
          if (res.data?.data) {
            setTeacher(res.data.data);
          } else {
            console.error("Không tìm thấy giáo viên.");
          }
        })
        .catch((err) => console.error("Lỗi khi lấy dữ liệu giáo viên:", err));
    } else if (type === "create") {
      const fetchAllSubjects = async () => {
        try {
          const firstPage = await getSubjects(1, 10);
          const totalPages = firstPage.meta?.last_page || 1;

          const allSubjectPages = await Promise.all(
            Array.from({ length: totalPages }, (_, i) => getSubjects(i + 1, 10))
          );
          const allSubjects = allSubjectPages.flatMap((page) => page.data);
          setSubjects(allSubjects);
        } catch (err: any) {
          setErrorMessage(err.message);
        }
      };
      fetchAllSubjects();
    }
  }, [type, id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "birthday" && typeof value === "string") {
        formData.append(key, formatDate(value));
      } else if (key === "img" && value) {
        // Ép kiểu value thành File hoặc File[] để kiểm tra an toàn
        const fileValue = value as File | File[];
        if (fileValue instanceof File) {
          formData.append("img", fileValue);
        } else if (Array.isArray(fileValue) && fileValue.length > 0 && fileValue[0] instanceof File) {
          formData.append("img", fileValue[0]);
        }
      } else if (typeof value === "string") {
        formData.append(key, value);
      }
    });

    if (type === "update") {
      formData.delete("username");
      formData.delete("email");
    }

    try {
      let response;
      if (type === "create") {
        response = await addTeacher(formData);
        if (response?.id) {
          const teacherId = response.id;
          const selectedSubjects = data.subjects || [];
          console.log("Adding subject for teacher:", teacherId, "Subject ID:", selectedSubjects);
          for (const subjectId of selectedSubjects) {
            const subjectTeacherData = new FormData();
            subjectTeacherData.append("teacher_id", teacherId.toString());
            subjectTeacherData.append("subject_id", subjectId);
            console.log("Adding subject-teacher:", { teacherId, subjectId });
            await addSubjectTeacher(subjectTeacherData);
          }
        }
      } else if (type === "update" && teacher) { // Kiểm tra teacher trước khi dùng
        await updateTeacher(teacher.id, formData);
        setTimeout(() => window.location.reload(), 2000);
      }
      setShowForm(false);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(type === "create" ? "Giáo viên này đã tồn tại!" : "Lỗi cập nhật giáo viên");
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("img", file, { shouldValidate: true });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Thêm giảng viên" : "Cập nhật giảng viên"}</h1>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField label="Tên tài khoản" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
            <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
            <InputField label="Mật khẩu" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />
            {type === "create" && (
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs font-medium text-gray-600">Môn học</label>
                <select
                  className="border border-gray-300 p-2 rounded-lg text-sm w-full bg-white 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            hover:border-blue-400 transition-all"
                  {...register("subjects")}
                  multiple
                  defaultValue={data?.subjects ?? []}
                >
                  {subjects ? (
                    subjects.map((subject) => (
                      <option key={subject.id} value={subject.id} className="p-2">
                        {subject.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Đang tải...</option>
                  )}
                </select>
                {errors.subjects?.message && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.subjects.message.toString()}</p>
                )}
              </div>
            )}
          </div>

          <span className="text-xs text-gray-400 font-medium">Thông tin cá nhân</span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField label="Họ" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />
            <InputField label="Tên" name="name" defaultValue={data?.name} register={register} error={errors.name} />
            <InputField label="Số điện thoại" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
            <InputField label="Địa chỉ" name="address" defaultValue={data?.address} register={register} error={errors.address} />
            <InputField label="Nhóm máu" name="bloodType" defaultValue={data?.bloodType} register={register} error={errors.bloodType} />
            <InputField label="Ngày sinh" name="birthday" defaultValue={data?.birthday} register={register} error={errors.birthday} type="date" />

            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Giới tính</label>
              <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex ?? "MALE"}>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
              {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
              <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Hình ảnh</span>
              </label>
              <input type="file" id="img" className="hidden" onChange={handleFileChange} />
              {previewImage && <Image src={previewImage} alt="Preview" width={100} height={100} />}
              {errors.img?.message && <p className="text-xs text-red-400">{errors.img.message.toString()}</p>}
            </div>
          </div>

          <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
      ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">✅ Giáo viên đã được thêm thành công!</p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">✅ Giáo viên đã được cập nhật thành công!</p>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-red-500 mb-1">Lỗi</h2>
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">Đóng</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherForm;