"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { coerce, z } from "zod";
import InputField from "../InputField";
import { useState, useEffect } from "react";
import { addroom, updateroom } from "@/services/api";

const schema = (type: "create" | "update") =>
  z.object({
    id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
    code_room: z
      .string()
      .min(1, { message: "Nhập tên phòng" }),
    floor: z
      .coerce.number().int().min(1, { message: "Tầng phải là số nguyên lớn hơn 1" })
      .max(9, { message: "Tầng phải là số nguyên nhỏ hơn 9" }),
    name: z.string().min(1, { message: "tên lớp phải dài hơn 1 ký tự" }),
    capacity: z
      .coerce.number().int().min(10, { message: "Số chỗ ngồi phải lơn hơn 10" })
      .max(99, { message: "Số chỗ ngồi không được lớn hơn 99" }),
    type: z.enum(["lecture", "lab", "office", "meeting"], { message: "vui lòng chọn loại phòng" }),
    available: z.enum(["1", "0"], { message: "vui lòng chọn tình trạng hoạt động" }),
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
    const roomform = new FormData;
    roomform.append("id", data.id);
    roomform.append("code_room", data.code_room);
    roomform.append("floor", data.floor);
    roomform.append("name", data.name);
    roomform.append("capacity", data.capacity);
    roomform.append("type", data.type);
    roomform.append("is_available", data.available);
    try {
      let newroom, updroom;
      if (type === "create") {
        newroom = await addroom(roomform);
        setTimeout(() => window.location.reload(), 1500);
      }
      else if (type === "update") {
        updroom = updateroom(data?.id, roomform);
        setTimeout(() => window.location.reload(), 1500);
      }
      setShowForm(false);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Lỗi không xác định");
    }

  });

  return (
    <>
      {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Tạo Phòng" : "Cập nhật Phòng"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            Nhập thông tin phòng
          </span>
          <div className="flex justify-between flex-wrap gap-4">
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
              label="Mã phòng"
              name="code_room"
              defaultValue={data?.code_room}
              register={register}
              error={errors?.code_room}
            />

            <InputField
              label="Tên phòng"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors?.name}
            />

            <InputField
              label="Tầng"
              name="floor"
              defaultValue={data?.floor}
              register={register}
              error={errors?.floor}
            />

            <InputField
              label="Số chỗ ngồi"
              name="capacity"
              defaultValue={data?.capacity}
              register={register}
              error={errors?.capacity}
            />

            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Loại phòng</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("type")}
                defaultValue={data?.type}
                name="type"
              >
                <option value="lecture">Lý thuyết</option>
                <option value="lab">Thực hành</option>
                <option value="office">Văn phòng</option>
                <option value="meeting">phòng họp</option>
              </select>
              {errors.type?.message && (
                <p className="text-xs text-red-400">
                  {errors.type.message.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Tình trạng</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("available")}
                defaultValue={data?.available}
                name="is_available"
              >
                <option value="1">Hoạt động</option>
                <option value="0">Ngưng hoạt động</option>
              </select>

              {errors.available?.message && (
                <p className="text-xs text-red-400">
                  {errors.available.message.toString()}
                </p>
              )}
            </div>

          </div>
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Tạo phòng" : "Cập nhật"}
          </button>
        </form>
      ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">✅ Phòng đã được thêm thành công!</p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">✅ Phòng đã được cập nhật thành công!</p>
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
