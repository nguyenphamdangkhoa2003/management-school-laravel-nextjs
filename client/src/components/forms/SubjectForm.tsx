"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState, useEffect } from "react";
import { addSubject, updateSubject } from "@/services/api";

const schema = (type: "create" | "update") =>
  z.object({
    id: z
      .coerce
      .number()
      .int()
      .min(1, { message: "ID phải là số nguyên" })
      .optional(),
    subjectname: z
      .string()
      .min(2, { message: "Tên môn học phải dài hơn 2 ký tự!" })
      .max(20, { message: "Tên môn học không được quá 20 ký tự!" }),
    credit: z.coerce.number().int().min(1, { message: "Nhập 1 số nguyên" }),
    credittuit: z.coerce.number().int().min(1, { message: "Nhập 1 số nguyên" }),
    process: z
      .coerce
      .number()
      .int()
      .min(0, { message: "Quá trình không được để trống" })
      .max(2, { message: "Quá trình không được quá 2 điểm" }),

    midterm: z
      .coerce
      .number()
      .int()
      .min(1, { message: "Giữa kì không được để trống và phải ≥ 1" })
      .max(5, { message: "Giữa kì không được quá 5 điểm" }),

    final: z
      .coerce
      .number()
      .int()
      .min(5, { message: "Cuối kì không được nhỏ hơn 5" })
      .max(10, { message: "Cuối kì không được quá 10 điểm" }),
  })
    .refine((data) => data.process + data.midterm <= 5, {
      message: "Tổng điểm quá trình và giữa kì không được lớn hơn 5",
      path: ["midterm"],
    })
    .refine((data) => data.process + data.midterm + data.final == 10, {
      message: "Tổng điểm quá trình, giữa kì và cuối kì phải bằng 10",
      path: ["final"],
    })
    .refine((data) => {
      if (type === "update" && !data.id) {
        return false;
      }
      return true;
    }, { message: "ID là bắt buộc khi cập nhật", path: ["id"] });



type Inputs = z.infer<ReturnType<typeof schema>>;

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
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema(type)),
    defaultValues: type === "update" ? data : {},
  });
  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.subjectname);
    formData.append("credit", data.credit.toString());
    formData.append("course_credit", data.credittuit.toString());
    formData.append("process_percent", data.process);
    formData.append("midterm_percent", data.midterm);
    formData.append("final_percent", data.final);
    try {
      let test;
      if (type === "create") {
        test = await addSubject(formData);
        setTimeout(() => window.location.reload(), 1500);
      }
      else if (type === "update") {

        test = await updateSubject(data?.id, formData)
        setTimeout(() => window.location.reload(), 1500);
      }
      setShowForm(false);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(type === "create" ? "Môn học này đã tồn tại!" : "Lỗi cập nhật Môn học");
    }
  });

  return (
    <>
      {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Thêm môn học" : "Cập nhật môn học"}</h1>

          <div className="flex justify-between gap-8">
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
              label="Tên môn học"
              name="subjectname"
              defaultValue={data?.subjectname}
              register={register}
              error={errors?.subjectname}
            />

            <InputField
              label="Số tín chỉ"
              name="credit"
              type="number"
              defaultValue={data?.credit}
              register={register}
              error={errors?.credit}
            />

            <InputField
              label="Số tín chỉ học phần"
              name="credittuit"
              type="number"
              defaultValue={data?.credittuit}
              register={register}
              error={errors?.credittuit}
            />
          </div>

          <span className="text-xs text-gray-400 font-medium">
            Hệ số điểm
          </span>

          <div className="flex justify-between gap-8">
            <InputField
              label="Quá trình"
              name="process"
              type="number"
              defaultValue={data?.process}
              register={register}
              error={errors?.process}
            />

            <InputField
              label="Giữa kì"
              name="midterm"
              type="number"
              defaultValue={data?.midterm}
              register={register}
              error={errors?.midterm}
            />

            <InputField
              label="Cuối kì"
              name="final"
              type="number"
              defaultValue={data?.final}
              register={register}
              error={errors?.final}
            />
          </div>


          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "tạo môn học" : "Cập nhật"}
          </button>
        </form>
      ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">✅ Môn học đã được thêm thành công!</p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">✅ Môn học đã được cập nhật thành công!</p>
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
