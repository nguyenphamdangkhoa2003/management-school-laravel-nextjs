"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState, useEffect } from "react";
import { getClasses, getGrades, addParent, addStudent, updateStudent } from "@/services/api";
import Image from "next/image";
import moment from "moment";

// Định nghĩa schema
const schema = (type: "create" | "update") =>
  z.object({
    ...(type === "create"
      ? {
        parentUsername: z
          .string()
          .min(3, { message: "Tên tài khoản phụ huynh phải có ít nhất 3 ký tự!" })
          .max(20, { message: "Tên tài khoản phụ huynh phải có tối đa 20 ký tự!" }),
        parentFirstName: z.string().min(1, { message: "Họ phụ huynh là bắt buộc!" }),
        parentLastName: z.string().min(1, { message: "Tên phụ huynh là bắt buộc!" }),
        parentEmail: z.string().email({ message: "Email phụ huynh không hợp lệ!" }),
        parentPhone: z.string().min(1, { message: "Số điện thoại phụ huynh là bắt buộc!" }),
        parentAddress: z.string().min(1, { message: "Địa chỉ phụ huynh là bắt buộc!" }),
        parentsex: z.enum(["MALE", "FEMALE"], { message: "Giới tính phụ huynh là bắt buộc!" }),
      }
      : {}),
    username: z
      .string()
      .min(3, { message: "Tên tài khoản phải có ít nhất 3 ký tự!" })
      .max(20, { message: "Tên tài khoản phải có tối đa 20 ký tự!" }),
    email: z.string().email({ message: "Địa chỉ email không hợp lệ!" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự!" }),
    firstName: z.string().min(1, { message: "Họ là bắt buộc!" }),
    lastName: z.string().min(1, { message: "Tên là bắt buộc!" }),
    phone: z.string().min(1, { message: "Số điện thoại là bắt buộc!" }),
    address: z.string().min(1, { message: "Địa chỉ là bắt buộc!" }),
    bloodType: z.string().min(1, { message: "Nhóm máu là bắt buộc!" }),
    birthday: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ message: "Ngày sinh là bắt buộc!" })
    ),
    sex: z.enum(["MALE", "FEMALE"], { message: "Giới tính là bắt buộc!" }),
    img: type === "create"
      ? z.instanceof(File).optional()
      : z.union([z.instanceof(File), z.string()]).optional(),
    code: z.string().length(10, { message: "Mã phải có đúng 10 ký tự!" }),
    classID: z.string().nonempty("Vui lòng chọn lớp học!"),
    gradeID: z.string().nonempty("Vui lòng chọn niên khóa!"),
  });

type Inputs = z.infer<ReturnType<typeof schema>>;

// Định nghĩa interface cho response (nếu bạn biết cấu trúc chính xác thì có thể cụ thể hơn)
interface ApiResponse {
  id: number | string;
  [key: string]: any;
}

const StudentForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema(type)),
    defaultValues: data || {},
  });

  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(data?.img || null);
  const [classes, setAllClasses] = useState<any[]>([]);
  const [grades, setAllGrades] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [classesData, gradesData] = await Promise.all([
          fetchAllPages(getClasses),
          fetchAllPages(getGrades),
        ]);
        setAllClasses(classesData);
        setAllGrades(gradesData);
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    };
    fetchAllData();
  }, [type, data]);

  const fetchAllPages = async (fetchFunction: any) => {
    const firstPage = await fetchFunction(1, 10);
    const totalPages = firstPage.meta?.last_page || 1;
    const allPages = await Promise.all(
      Array.from({ length: totalPages }, (_, i) => fetchFunction(i + 1, 10))
    );
    return allPages.flatMap((page) => page.data);
  };

  const onSubmit = handleSubmit(async (formData) => {
    const formDataStudent = new FormData();

    formDataStudent.append("username", formData.username.toString());
    formDataStudent.append("code", formData.code.toString());
    formDataStudent.append("name", formData.lastName.toString());
    formDataStudent.append("birthday", moment(formData.birthday).format("YYYY-MM-DD HH:mm:ss"));
    formDataStudent.append("surname", formData.firstName.toString());
    formDataStudent.append("password", formData.password.toString());
    formDataStudent.append("email", formData.email.toString());
    formDataStudent.append("phone", formData.phone.toString());
    formDataStudent.append("bloodType", formData.bloodType.toString());
    formDataStudent.append("address", formData.address.toString());
    formDataStudent.append("grade_id", formData.gradeID.toString());
    formDataStudent.append("school_class_id", formData.classID.toString());
    formDataStudent.append("sex", formData.sex.toString());

    if (formData.img instanceof File) {
      formDataStudent.append("img", formData.img);
    }

    try {
      let parentResponse: ApiResponse | undefined;
      let studentResponse: ApiResponse | undefined;

      if (type === "create") {
        const formDataParent = new FormData();
        formDataParent.append("username", formData.parentUsername?.toString() || "");
        formDataParent.append("name", formData.parentLastName?.toString() || "");
        formDataParent.append("surname", formData.parentFirstName?.toString() || "");
        formDataParent.append("password", formData.password?.toString() || "");
        formDataParent.append("email", formData.parentEmail?.toString() || "");
        formDataParent.append("phone", formData.parentPhone?.toString() || "");
        formDataParent.append("address", formData.parentAddress?.toString() || "");
        formDataParent.append("sex", formData.parentsex?.toString() || "MALE");

        parentResponse = await addParent(formDataParent);
        if (parentResponse?.id) {
          formDataStudent.append("guardian_id", parentResponse.id.toString());
          studentResponse = await addStudent(formDataStudent);
          if (studentResponse?.id) {
            setStudents((prev) => [...prev, studentResponse]);
          }
        }
      } else if (type === "update") {
        await updateStudent(data.id, formDataStudent);
      }

      setShowForm(false);
      setErrorMessage(null);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Lỗi không xác định");
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File | undefined;
    if (file) {
      setValue("img", file as unknown as never, { shouldValidate: true });
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  return (
    <>
      {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Thêm sinh viên" : "Cập nhật sinh viên"}</h1>

          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Tên tài khoản"
              name="username"
              defaultValue={data?.username}
              register={register}
              error={errors.username as FieldError}
            />
            <InputField
              label="Code"
              name="code"
              defaultValue={data?.code}
              register={register}
              error={errors.code as FieldError}
            />
            <InputField
              label="Email"
              name="email"
              defaultValue={data?.email}
              register={register}
              error={errors.email as FieldError}
            />
            <InputField
              label="Mật khẩu"
              name="password"
              type="password"
              defaultValue={data?.password}
              register={register}
              error={errors.password as FieldError}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Lớp</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("classID")}
                defaultValue={data?.classID}
              >
                <option value="">Chọn lớp học</option>
                {classes?.map((classin) => (
                  <option key={classin.id} value={classin.id}>
                    {classin.name}
                  </option>
                ))}
              </select>
              {errors.classID && (
                <p className="text-xs text-red-400">{errors.classID.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Niên khóa</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("gradeID")}
                defaultValue={data?.gradeID}
              >
                <option value="">Chọn niên khóa</option>
                {grades?.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.level}
                  </option>
                ))}
              </select>
              {errors.gradeID && (
                <p className="text-xs text-red-400">{errors.gradeID.message}</p>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Thông tin cá nhân
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Họ"
              name="firstName"
              defaultValue={data?.surname}
              register={register}
              error={errors.firstName as FieldError}
            />
            <InputField
              label="Tên"
              name="lastName"
              defaultValue={data?.name}
              register={register}
              error={errors.lastName as FieldError}
            />
            <InputField
              label="Số điện thoại"
              name="phone"
              defaultValue={data?.phone}
              register={register}
              error={errors.phone as FieldError}
            />
            <InputField
              label="Địa chỉ"
              name="address"
              defaultValue={data?.address}
              register={register}
              error={errors.address as FieldError}
            />
            <InputField
              label="Nhóm máu"
              name="bloodType"
              defaultValue={data?.bloodType}
              register={register}
              error={errors.bloodType as FieldError}
            />
            <InputField
              label="Ngày sinh"
              name="birthday"
              defaultValue={data?.birthday ? moment(data.birthday).format("YYYY-MM-DD") : ""}
              register={register}
              error={errors.birthday as FieldError}
              type="date"
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Giới tính</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("sex")}
                defaultValue={data?.sex}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
              {errors.sex && (
                <p className="text-xs text-red-400">{errors.sex.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
              <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Hình ảnh</span>
              </label>
              <input
                type="file"
                id="img"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {previewImage && (
                <Image src={previewImage} alt="Preview" width={100} height={100} />
              )}
              {errors.img && !previewImage && (
                <p className="text-xs text-red-400">{errors.img.message}</p>
              )}
            </div>
          </div>
          {type === "create" && (
            <>
              <span className="text-xs text-gray-400 font-medium">
                Thông tin phụ huynh
              </span>
              <div className="flex justify-between flex-wrap gap-4">
                <InputField
                  label="Tên tài khoản phụ huynh"
                  name="parentUsername"
                  defaultValue={data?.parentUsername}
                  register={register}
                  error={errors.parentUsername as FieldError}
                />
                <InputField
                  label="Họ"
                  name="parentFirstName"
                  defaultValue={data?.parentFirstName}
                  register={register}
                  error={errors.parentFirstName as FieldError}
                />
                <InputField
                  label="Tên"
                  name="parentLastName"
                  defaultValue={data?.parentLastName}
                  register={register}
                  error={errors.parentLastName as FieldError}
                />
                <InputField
                  label="Email"
                  name="parentEmail"
                  defaultValue={data?.parentEmail}
                  register={register}
                  error={errors.parentEmail as FieldError}
                />
                <InputField
                  label="Số điện thoại"
                  name="parentPhone"
                  defaultValue={data?.parentPhone}
                  register={register}
                  error={errors.parentPhone as FieldError}
                />
                <InputField
                  label="Địa chỉ"
                  name="parentAddress"
                  defaultValue={data?.parentAddress}
                  register={register}
                  error={errors.parentAddress as FieldError}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs text-gray-500">Giới tính</label>
                  <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("parentsex")}
                    defaultValue={data?.parentsex}
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                  {errors.parentsex && (
                    <p className="text-xs text-red-400">{errors.parentsex.message}</p>
                  )}
                </div>
              </div>
            </>
          )}
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
      ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">✅ Sinh viên đã được thêm thành công!</p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">✅ Sinh viên đã được cập nhật thành công!</p>
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

export default StudentForm;