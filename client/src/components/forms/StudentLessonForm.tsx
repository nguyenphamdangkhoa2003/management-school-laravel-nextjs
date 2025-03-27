"use client";

import { getLessons, getLessonsForStudentLesson, getStudents } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SearchableSelect from "../SearchableSelect";
import { Day } from "react-big-calendar";


const schema = (type: "create" | "update") =>
    z.object({
        id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
        student_code: z.string().min(1, { message: "Vui lòng chọn môn học" }),
        lesson_id: z.string().min(1, { message: "Vui lòng chọn giảng viên" }),
    }).refine((data) => {
        if (type === "update" && !data.id) {
            return false;
        }
        return true;
    }, { message: "ID là bắt buộc khi cập nhật", path: ["id"] });
type Inputs = z.infer<typeof schema>;

const SubjectTeacherForm = ({
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
        defaultValues: {
            subjectId: data?.subjectId || "",
            teacherId: data?.teacherId || "",

        },
    });

    const [showForm, setShowForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [student, setStudent] = useState<any[]>([]);
    const [lesson, setLesson] = useState<any[]>([]);
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const firstPage = await getStudents(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;

                const allStudentPages = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getStudents(i + 1, 10))
                );
                const allStudent = allStudentPages.flatMap((page) => page.data);
                const studenOptions = allStudent.map((item: any) => {
                    return {
                        value: item.code,

                        label: `${item.surname} ${item.name} `,
                    }
                })
                setStudent(studenOptions);

                if (type === "update" && data?.code) {
                    setValue("student_code", String(data.subjectId));
                }
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        };

        const fetchLesson = async () => {
            try {
                const firstPage = await getLessonsForStudentLesson(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;

                const allLessonPages = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getLessonsForStudentLesson(i + 1, 10))
                );
                const allLesson = allLessonPages.flatMap((page) => page.data);

                console.log(">><<>>", allLesson);
                setLesson(allLesson);

                if (type === "update" && data?.code) {
                    setValue("student_code", String(data.subjectId));
                }
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        };


        fetchStudent();
        fetchLesson();
    }, [type, data, setValue]);

    const onSubmit = handleSubmit(async (formData) => {
        const subjectTeacherData = new FormData();
        subjectTeacherData.append("student_code", formData.teacherId);
        try {
            if (type === "create") {

                setTimeout(() => window.location.reload(), 1500);
            } else if (type === "update") {
                subjectTeacherData.append("id", formData?.id);

                setTimeout(() => window.location.reload(), 1500);
            }
            setShowForm(false);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(
                type === "create"
                    ? "Giảng viên đang dạy môn học này"
                    : "Lỗi cập nhật môn học cho giảng viên"
            );
        }
    });

    return (
        <>
            {showForm ? (
                <form className="flex flex-col gap-8" onSubmit={onSubmit}>
                    <h1 className="text-xl font-semibold">
                        {type === "create" ? "Đăng ký môn học" : "Cập nhật đăng ký môn"}
                    </h1>
                    <span className="text-xs text-gray-400 font-medium">
                        Nhập thông tin
                    </span>

                    <div className="flex flex-col gap-4">
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
                        {/* Select chọn môn học */}
                        <div>
                            <label className="block font-medium">Chọn sinh viên</label>
                            <SearchableSelect options={student} placeholder="chọn 1 sinh viên..." getOptionLabel={(e) => `${e.value} - ${e.label}`} />

                            {errors.subjectId && (
                                <p className="text-red-500 text-sm">{errors.subjectId.message}</p>
                            )}
                        </div>

                        {/* Select chọn giảng viên */}
                        <div>
                            <label className="block font-medium">Chọn lesson</label>
                            <SearchableSelect options={lesson} placeholder="chọn 1 lesson" getOptionLabel={(e) => `${e.subject} - ${e.teacher} - ${e.day} - ${e.Time}`} />

                            {errors.subjectId && (
                                <p className="text-red-500 text-sm">{errors.subjectId.message}</p>
                            )}
                        </div>
                    </div>

                    <button className="bg-blue-400 text-white p-2 rounded-md">
                        {type === "create" ? "Thêm môn học cho giảng viên" : "Cập nhật"}
                    </button>
                </form>
            ) : (
                <div>
                    {type === "create" && (
                        <p className="text-green-600 text-lg font-semibold">
                            ✅ Thêm môn học cho giảng viên thành công!
                        </p>
                    )}
                    {type === "update" && (
                        <p className="text-green-600 text-lg font-semibold">
                            ✅ Cập nhật môn học cho giảng viên thành công!
                        </p>
                    )}
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

export default SubjectTeacherForm;
