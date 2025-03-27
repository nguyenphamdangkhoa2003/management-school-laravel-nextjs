"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState, useEffect } from "react";
import { addClass, getGrades, updateClass } from "@/services/api";

const schema = (type: "create" | "update") =>
  z.object({
    id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
    level: z
      .string()
      .min(9, { message: "nhập đúng định dang yyyy-yyyy" }),
  }).refine((data) => {
    if (type === "update" && !data.id) {
      return false;
    }
    return true;
  }, { message: "ID là bắt buộc khi cập nhật", path: ["id"] });
type Inputs = z.infer<typeof schema>;

const ClassForm = ({
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
    defaultValues: type === "update" ? data : {},
  });
  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [grades, setAllGrades] = useState<any[]>([]);

  const onSubmit = handleSubmit(async (data) => {

  });

  return (
    <>
      {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Tạo Niên khóa" : "Cập nhật Niên khóa"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            Nhập thông tin niên khóa
          </span>
          <div>
            {data && (
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
            <InputField
              label="Niên khóa"
              name="level"
              defaultValue={data?.level}
              register={register}
              error={errors?.level}
              className="w-full"
            />
          </div>
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Tạo niên khóa" : "Cập nhật"}
          </button>
        </form>
      ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">✅ Niên khóa đã được thêm thành công!</p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">✅ Niên khóa đã được cập nhật thành công!</p>
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


export default ClassForm;
