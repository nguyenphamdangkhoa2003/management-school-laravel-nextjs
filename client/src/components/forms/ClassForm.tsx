"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState,useEffect } from "react";
import { addClass,getGrades,updateClass } from "@/services/api";

const schema = (type: "create" | "update") =>
  z.object({
    id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
    classname: z
        .string()
        .min(2, { message: "tên lớp phải dài hơn 2 ký tự!" })
        .max(20, { message: "tên lớp không được quá 20 ký tự!" }),
    capacity: z
        .coerce.number()
        .min(2, { message: "Giá trị phải lớn hơn hoặc bằng 2!" })
        .max(99, { message: "Giá trị không được lớn hơn 99!" }),
    // supervisor: z.string().min(1, { message: "Tên giảng viên không được bỏ trống" }),
    gradeID: z.string().nonempty("vui lòng chọn niên khóa"),
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
    useEffect(() => {
        const fetchAllData = async () => {
          try {
            const [gradesData] = await Promise.all([
              fetchAllPages(getGrades),
            ]);
            setAllGrades(gradesData);
          } catch (err: any) {
            setErrorMessage(err.message);
          }
        };
        fetchAllData();
      }, [type, data, setValue]);
    
      const fetchAllPages = async (fetchFunction: any) => {
        const firstPage = await fetchFunction(1, 10);
        const totalPages = firstPage.meta?.last_page || 1;
        const allPages = await Promise.all(
          Array.from({ length: totalPages }, (_, i) => fetchFunction(i + 1, 10))
        );
        return allPages.flatMap((page) => page.data);
      };

    const onSubmit = handleSubmit(async(data) => {
        const classform= new FormData();
        classform.append("name",data.classname)
        classform.append("capacity",data.capacity)
        classform.append("grade_id ",data.gradeID)

        try {
            let newclass,updateclass;
            if (type==="create") {
                newclass=await addClass(classform)
                setTimeout(() => window.location.reload(), 1500);
            }else if (type==="update") {
                updateclass=await updateClass(data?.id,classform)
            }
            setShowForm(false);
            setErrorMessage(null);
        } catch (error:any) {
            setErrorMessage(error.response?.data?.message || error.message || "Lỗi không xác định");
        }
    });

    return (
        <>
        {showForm ? (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type==="create"?"Tạo lớp học":"Cập nhật lớp học"}</h1>
            <span className="text-xs text-gray-400 font-medium">
                Nhập thông tin lớp
            </span>
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
                    label="Tên lớp"
                    name="classname"
                    defaultValue={data?.classname}
                    register={register}
                    error={errors?.classname}
                />
                <InputField
                    label="Sĩ số"
                    name="capacity"
                    type="number"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
                />
                
                <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Niên khóa</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("gradeID")}
                defaultValue={data?.gradeID || ""}
                >
                <option value="">Chọn niên khóa</option>
                  {grades?.map((grade) => (
                    <option key={grade.id} value={grade.id} selected={grade.id === data?.gradeID}>
                      {grade.level}
                    </option>
                  ))}
                  </select>
                {errors.gradeID && (
              <p className="text-xs text-red-400">{errors.gradeID.message}</p>
            )}
          </div>

                {/* <InputField
                    label="Giảng viên"
                    name="supervisor"
                    defaultValue={data?.supervisor}
                    register={register}
                    error={errors?.supervisor}
                /> */}
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Tạo lớp" : "Cập nhật"}
            </button>
        </form>
        ) : (
        <div>
          {type === "create" && (
            <p className="text-green-600 text-lg font-semibold">✅ Lớp học đã được thêm thành công!</p>
          )}
          {type === "update" && (
            <p className="text-green-600 text-lg font-semibold">✅ Lớp học đã được cập nhật thành công!</p>
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
