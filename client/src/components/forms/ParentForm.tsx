"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { studentsData } from "@/lib/data";

interface InputFieldProps {
    isVisible: boolean;
}

const schema = z.object({
    parentname: z
        .string()
        .min(2, { message: "tên phải dài hơn 2 ký tự!" })
        .max(20, { message: "tên lớp không được quá 20 ký tự!" }),
    studentid: z.string().refine(
        (val) => studentsData.some((item) => item.studentId === val),
        { message: "Mã sinh viên không tồn tại!" }),
    email: z.string().email({ message: "Email không hợp lệ!" }),
    phone: z
        .string()
        .regex(/^0[35789]\d{8}$/, { message: "Số điện thoại không hợp lệ!" }),
    address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự!" }),

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
            <h1 className="text-xl font-semibold">Thêm phụ huynh</h1>
            <span className="text-xs text-gray-400 font-medium">
                Nhập thông tin phụ huynh
            </span>
            <div className="flex justify-between gap-8 ">
                <InputField
                    label="Tên phụ huynh"
                    name="parentname"
                    defaultValue={data?.parentname}
                    register={register}
                    error={errors?.parentname}
                />

                <InputField
                    label="Mã Sinh viên"
                    name="studentid"
                    defaultValue={data?.studentid}
                    register={register}
                    error={errors?.studentid}
                />

                <div className='w-[25%]'>
                </div>


            </div>
            <div className='flex justify-between gap-8'>

                <InputField
                    label="Email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Số điện thoại"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors?.phone}
                />

                <InputField
                    label="Địa chỉ"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors?.address}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Tạo lớp" : "Cập nhật"}
            </button>
        </form>
    );
};


export default ClassForm;
