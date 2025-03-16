"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState,useEffect } from "react";
import { addSubject,updateSubject } from "@/services/api";

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
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema(type)),
        defaultValues: type === "update" ? data : {},
    });
    const [showForm, setShowForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = handleSubmit(async(data) => {
        const payload = {
            name: data.subjectname,
            tin_chi: data.credit, 
            tin_chi_hoc_phan: data.credittuit, 
        };
        try {
            let test;
            if (type==="create") {
                test=await addSubject(payload);
                setTimeout(() => window.location.reload(), 1500);
            }
            else if(type==="update"){
                const formData = new FormData();
                formData.append("name", data.subjectname);
                formData.append("tin_chi", data.credit.toString());
                formData.append("tin_chi_hoc_phan", data.credittuit.toString());
                test= await updateSubject(data?.id,formData)
                setTimeout(() => window.location.reload(), 1500);
            }
            setShowForm(false);
            setErrorMessage(null);
        } catch (err:any) {
            setErrorMessage(type === "create" ? "Môn học này đã tồn tại!" : "Lỗi cập nhật Môn học");
        }
    });

    return (
        <>
        {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Thêm môn học" : "Cập nhật môn học"}</h1>

            <div className="flex justify-between gap-8">
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
        {errorMessage &&(
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
