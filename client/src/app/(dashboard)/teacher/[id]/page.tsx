"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

const schema = z.object({
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  surname: z.string().min(1, "Họ không được để trống"),
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  birthday: z.string().optional(),
  sex: z.string().optional(),
});

type TeacherFormData = z.infer<typeof schema>;

const ProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [originalData, setOriginalData] = useState<TeacherFormData | null>(
    null
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://127.0.0.1:8000/api/teachers/${id}`)
      .then((res) => {
        const teacherData = res.data.data;
        setOriginalData(teacherData);
        reset({
          username: teacherData.username,
          email: teacherData.email,
          surname: teacherData.surname,
          name: teacherData.name,
          phone: teacherData.phone || "",
          address: teacherData.address || "",
          bloodType: teacherData.bloodType || "",
          birthday: teacherData.birthday
            ? new Date(teacherData.birthday).toISOString().split("T")[0]
            : "",
          sex: teacherData.sex || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu giảng viên:", error);
        setErrorMsg("Không thể tải dữ liệu giảng viên.");
        setLoading(false);
      });
  }, [id, reset]);

  const onSubmit = async (data: TeacherFormData) => {
    try {
      const updatedData: Partial<TeacherFormData> = {};
      Object.keys(data).forEach((key) => {
        if (
          data[key as keyof TeacherFormData] !==
          originalData?.[key as keyof TeacherFormData]
        ) {
          updatedData[key as keyof TeacherFormData] =
            data[key as keyof TeacherFormData];
        }
      });

      await axios.put(`http://127.0.0.1:8000/api/teachers/${id}`, updatedData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push(`/teacher/${id}`);
      }, 2000);
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật giảng viên:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật, vui lòng thử lại."
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-6">Cập nhật hồ sơ giảng viên</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            {...register("username")}
            readOnly
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            readOnly
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Họ</label>
            <input
              type="text"
              {...register("surname")}
              className="border p-2 rounded w-full"
            />
            {errors.surname && (
              <p className="text-red-500">{errors.surname.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Tên</label>
            <input
              type="text"
              {...register("name")}
              className="border p-2 rounded w-full"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block font-medium">Số điện thoại</label>
          <input
            type="text"
            {...register("phone")}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Địa chỉ</label>
          <input
            type="text"
            {...register("address")}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Ngày sinh</label>
          <input
            type="date"
            {...register("birthday")}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Nhóm máu</label>
          <input
            type="text"
            {...register("bloodType")}
            className="border p-2 rounded w-full"
          />
        </div>
        {/* Chỉnh sửa phần giới tính */}
        <div>
          <label className="block font-medium">Giới tính</label>
          <select {...register("sex")} className="border p-2 rounded w-full">
            <option value="">Chọn giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
          </select>
          {errors.sex && <p className="text-red-500">{errors.sex.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-100 border border-green-500 text-green-800 px-6 py-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Thành công!</h2>
            <p>Hồ sơ giảng viên đã được cập nhật thành công.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
