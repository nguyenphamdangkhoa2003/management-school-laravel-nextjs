"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import InputField from "../InputField";
import {
  createGrade,
  modifyGrade,
  deleteGrade,
  fetchGrades,
} from "@/services/api";
import { useRouter } from "next/navigation";

const schema = (type: "create" | "update") =>
  z
    .object({
      id: z.coerce
        .number()
        .int()
        .min(1, { message: "ID phải là số nguyên" })
        .optional(),
      level: z.string().regex(/^Năm học \d{4}-\d{4}$/, {
        message: "Nhập đúng định dạng 'Năm học yyyy-yyyy'",
      }),
    })
    .refine(
      (data) => {
        if (type === "update" && !data.id) {
          return false;
        }
        return true;
      },
      { message: "ID là bắt buộc khi cập nhật", path: ["id"] }
    );

type Inputs = z.infer<typeof schema>;

const GradeForm = ({
  type,
  data,
  onDelete,
}: {
  type: "create" | "update";
  data?: any;
  onDelete?: (id: number) => void;
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema(type)),
    defaultValues: type === "update" ? data : {},
  });

  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (type === "update" && data) {
      setValue("id", data.id);
      setValue("level", data.level);
    }
  }, [type, data, setValue]);

  useEffect(() => {
    const loadGrades = async () => {
      const fetchedGrades = await fetchGrades();
      setGrades(fetchedGrades);
    };
    loadGrades();
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("Dữ liệu gửi lên API:", formData);

      formData.level = formData.level.startsWith("Năm học ")
        ? formData.level
        : `Năm học ${formData.level}`;

      if (type === "create") {
        await createGrade(formData);
        setTimeout(() => window.location.reload(), 1500);
      } else if (type === "update") {
        if (!formData.id) {
          setErrorMessage("ID không hợp lệ khi cập nhật");
          return;
        }
        await modifyGrade(formData.id, formData);
        setTimeout(() => window.location.reload(), 1500);
      }

      const updatedGrades = await fetchGrades();
      setGrades(updatedGrades);
      setShowForm(false);
    } catch (error: any) {
      console.error("Lỗi khi thêm/cập nhật:", error);
      setErrorMessage(error.response?.data?.message || "Lỗi không xác định");
    }
  });

  return (
    <>
      {showForm ? (
        <form
          className="flex flex-col gap-8 p-4 border rounded-lg shadow-md"
          onSubmit={onSubmit}
        >
          <h1 className="text-xl font-semibold">
            {type === "create" ? "Tạo Niên khóa" : "Cập nhật Niên khóa"}
          </h1>
          <span className="text-xs text-gray-400 font-medium">
            Nhập thông tin lớp học
          </span>

          <div>
            {type === "update" && (
              <InputField
                label="ID"
                name="id"
                defaultValue={data?.id}
                register={register}
                error={errors?.id}
                hidden
              />
            )}
            <InputField
              label="Niên khóa"
              name="level"
              defaultValue={data?.level}
              register={register}
              error={errors?.level}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {type === "create" ? "Thêm" : "Cập nhật"}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-green-100 text-green-700 font-semibold rounded-md">
          {type === "create"
            ? "✅ Niên khóa đã được thêm thành công!"
            : "✅ Niên khóa đã được cập nhật thành công!"}
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

export default GradeForm;
