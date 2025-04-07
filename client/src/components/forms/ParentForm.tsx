"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { studentsData } from "@/lib/data";
import { updateParent } from "@/services/api";
import { useState } from "react";

interface InputFieldProps {
    isVisible: boolean;
}

const schema = z.object({
    surname: z
        .string()
        .min(2, { message: "Họ phải dài hơn 2 ký tự!" })
        .max(20, { message: "Họ không được quá 20 ký tự!" }),
    name: z
        .string()
        .min(2, { message: "Tên phải dài hơn 2 ký tự!" })
        .max(20, { message: "Tên không được quá 20 ký tự!" }),
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

    const [showForm, setShowForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = handleSubmit(async (formData) => {
        const formDataParent = new FormData();
        formDataParent.append("username", data.username);
        formDataParent.append("password", "password");
        formDataParent.append("surname", formData.surname);
        formDataParent.append("name", formData.name);
        formDataParent.append("email", formData.email);
        formDataParent.append("phone", formData.phone);
        formDataParent.append("address ", formData.address);
        formDataParent.append("sex", data.sex);
        try {
            let updParent = await updateParent(data.id, formDataParent);
            setShowForm(false);
            setErrorMessage(null);
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || error.message || "Lỗi không xác định");
        }
    });

    return (
        <>
            {showForm ? (
                <form className="flex flex-col gap-8" onSubmit={onSubmit}>
                    <h1 className="text-xl font-semibold">Thêm phụ huynh</h1>
                    <span className="text-xs text-gray-400 font-medium">
                        Nhập thông tin phụ huynh
                    </span>
                    <div className="md:flex gap-10 ">
                        <InputField
                            label="Họ"
                            name="surname"
                            defaultValue={data?.surname}
                            register={register}
                            error={errors?.surname}
                            className="w-full"
                        />

                        <InputField
                            label="Tên"
                            name="name"
                            defaultValue={data?.name}
                            register={register}
                            error={errors?.name}
                            className="w-full"
                        />
                    </div>
                    <div className="md:flex  gap-10 ">
                        <InputField
                            label="Email"
                            name="email"
                            defaultValue={data?.email}
                            register={register}
                            error={errors?.email}
                            className="w-full"
                        />
                        <InputField
                            label="Số điện thoại"
                            name="phone"
                            defaultValue={data?.phone}
                            register={register}
                            error={errors?.phone}
                            className="w-full"
                        />

                    </div>
                    <InputField
                        label="Địa chỉ"
                        name="address"
                        defaultValue={data?.address}
                        register={register}
                        error={errors?.address}
                        className="w-full"
                    />
                    <button className="bg-blue-400 text-white p-2 rounded-md">
                        {type === "create" ? "Tạo lớp" : "Cập nhật"}
                    </button>
                </form>) : (
                <div>
                    {type === "create" && (
                        <p className="text-green-600 text-lg font-semibold">✅ Phụ huynh đã được thêm thành công!</p>
                    )}
                    {type === "update" && (
                        <p className="text-green-600 text-lg font-semibold">✅ Phụ huynh đã được cập nhật thành công!</p>
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
