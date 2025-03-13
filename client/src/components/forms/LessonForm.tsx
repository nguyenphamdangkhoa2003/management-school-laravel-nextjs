"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    classname: z
        .string()
        .min(2, { message: "tên lớp phải dài hơn 2 ký tự!" })
        .max(20, { message: "tên lớp không được quá 20 ký tự!" }),
    capacity: z
        .coerce.number()
        .min(2, { message: "Giá trị phải lớn hơn hoặc bằng 2!" })
        .max(20, { message: "Giá trị không được lớn hơn 20!" }),
    grade: z
        .coerce.number()
        .min(2, { message: "Giá trị phải lớn hơn hoặc bằng 2!" })
        .max(20, { message: "Giá trị không được lớn hơn 20!" }),
    supervisor: z.string().min(1, { message: "Tên giảng viên không được bỏ trống" }),

});

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
        resolver: zodResolver(schema),
    });


    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Tạo lớp</h1>
            <span className="text-xs text-gray-400 font-medium">
                Nhập thông tin lớp
            </span>
            <div className="flex justify-between gap-8">
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
                <InputField
                    label="Cấp"
                    name="grade"
                    type="number"
                    defaultValue={data?.grade}
                    register={register}
                    error={errors?.grade}
                />

                <InputField
                    label="Giảng viên"
                    name="supervisor"
                    defaultValue={data?.supervisor}
                    register={register}
                    error={errors?.supervisor}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Tạo lớp" : "Cập nhật"}
            </button>
        </form>
    );
};


export default ClassForm;
