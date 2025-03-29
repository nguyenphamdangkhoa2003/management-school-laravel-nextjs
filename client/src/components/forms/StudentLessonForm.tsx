"use client";

import { addAttendance, getLessonsForStudentLesson, getStudents, updateAttendance } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SearchableSelect from "../SearchableSelect";

const schema = (type: "create" | "update") =>
    z.object({
        id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
        student_id: z.string().min(1, { message: "Vui lòng chọn sinh viên" }),
        lesson_id: z.string().min(1, { message: "Vui lòng chọn bài học" }),
    }).refine((data) => {
        if (type === "update" && !data.id) return false;
        return true;
    }, { message: "ID là bắt buộc khi cập nhật", path: ["id"] });

type Inputs = z.infer<typeof schema>;

const SubjectTeacherForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(schema(type)),
        defaultValues: {
            student_id: String(data?.student_id || ""),
            lesson_id: String(data?.lesson_id || ""),
        },
        shouldUnregister: false, // Giữ lại giá trị khi component re-render
    });

    const [studentOptions, setStudentOptions] = useState<any[]>([]);
    const [lessonOptions, setLessonOptions] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const firstPage = await getStudents(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;

                const allStudentPages = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getStudents(i + 1, 10))
                );
                const allStudents = allStudentPages.flatMap((page) => page.data);
                const studentOptions = allStudents.map((item: any) => ({
                    value: String(item.id), // Đảm bảo dữ liệu là chuỗi
                    code: item.code,
                    name: `${item.surname} ${item.name}`,
                }));

                setStudentOptions(studentOptions);

                if (type === "update" && data?.student_id) {
                    setValue("student_id", String(data.student_id));
                }
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        };

        const fetchLessons = async () => {
            try {
                const firstPage = await getLessonsForStudentLesson(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;

                const allLessonPages = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getLessonsForStudentLesson(i + 1, 10))
                );
                const allLessons = allLessonPages.flatMap((page) => page.data);

                setLessonOptions(allLessons);

                if (type === "update" && data?.lesson_id) {
                    setValue("lesson_id", String(data.lesson_id));
                }
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        };

        fetchStudent();
        fetchLessons();
    }, [type, data, setValue]);

    const onSubmit = handleSubmit(async (Data) => {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

        const attendanceForm = new FormData();
        attendanceForm.append("student_id", Data.student_id);
        attendanceForm.append("lesson_id", Data.lesson_id);
        attendanceForm.append("date", formattedDate);
        attendanceForm.append("present", 1);

        console.log("att>>", attendanceForm);

        try {
            if (type === "create") {
                await addAttendance(attendanceForm);
            } else if (type === "update") {
                attendanceForm.append("id", Data.id);
                await updateAttendance(data?.id, attendanceForm);
            }
            setTimeout(() => window.location.reload(), 1500);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(type === "create" ? "Lỗi đăng ký" : "Lỗi cập nhật");
        }
    });


    return (
        <>
            <form className="flex flex-col gap-8" onSubmit={onSubmit}>
                <h1 className="text-xl font-semibold">
                    {type === "create" ? "Đăng ký môn học" : "Cập nhật đăng ký môn"}
                </h1>
                <span className="text-xs text-gray-400 font-medium">
                    Nhập thông tin
                </span>

                <div className="flex flex-col gap-4">
                    {/* ID ẩn nếu là cập nhật */}
                    {data && (
                        <InputField label="ID" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />
                    )}

                    {/* Select chọn sinh viên */}
                    <div>
                        <label className="block font-medium">Chọn sinh viên</label>
                        <SearchableSelect
                            options={studentOptions}
                            placeholder="Chọn sinh viên..."
                            getOptionLabel={(e) => `${e.code} - ${e.name}`}
                            defaultValue={String(data?.student_id || "")} // Đảm bảo dữ liệu là chuỗi
                            onChange={(selected) => {
                                setValue("student_id", String(selected?.value || ""));
                                trigger("student_id");
                            }}
                        />
                        {errors.student_id && (
                            <p className="text-red-500 text-sm">{errors.student_id.message}</p>
                        )}
                    </div>

                    {/* Select chọn bài học */}
                    <div>
                        <label className="block font-medium">Chọn bài học</label>
                        <SearchableSelect
                            options={lessonOptions}
                            placeholder="Chọn 1 bài học..."
                            getOptionLabel={(e) => `${e.subject} - ${e.teacher} - ${e.day} - ${e.time}`}
                            defaultValue={data?.lesson_id || ""}
                            onChange={(selected) => {
                                setValue("lesson_id", String(selected?.value || ""));
                                trigger("lesson_id");
                            }}
                        />
                        {errors.lesson_id && (
                            <p className="text-red-500 text-sm">{errors.lesson_id.message}</p>
                        )}
                    </div>
                </div>

                <button className="bg-blue-400 text-white p-2 rounded-md">
                    {type === "create" ? "Đăng ký môn" : "Cập nhật"}
                </button>
            </form>

            {/* Thông báo lỗi */}
            {errorMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-red-500 mb-1">Lỗi</h2>
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage(null)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubjectTeacherForm;
