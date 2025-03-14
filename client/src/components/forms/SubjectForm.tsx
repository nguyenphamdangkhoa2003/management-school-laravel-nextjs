"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    subjectname: z
        .string()
        .min(2, { message: "tên lớp phải dài hơn 2 ký tự!" })
        .max(20, { message: "tên lớp không được quá 20 ký tự!" }),
    credit: z
        .coerce.number().int().min(1, { message: "nhập 1 số nguyên" }),
    credittuit: z
        .coerce.number().int().min(1, { message: "nhập 1 số nguyên" }),
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
            <h1 className="text-xl font-semibold">Thêm môn học</h1>

            <div className="flex justify-between gap-8">
                <InputField
                    label="Tên môn học"
                    name="subjectname"
                    defaultValue={data?.subjectname}
                    register={register}
                    error={errors?.subjectname}
                />

                {/* <InputField
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
                /> */}
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Tạo lớp" : "Cập nhật"}
            </button>
        </form>
    );
};


export default ClassForm;
