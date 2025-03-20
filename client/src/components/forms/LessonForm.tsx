"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import axios from "axios";

const schema = z.object({
    teacherSubjectId: z.string().nonempty("Vui lòng chọn giảng viên - môn học"),
    startdate: z.string().nonempty("Ngày bắt đầu là bắt buộc"),
    enddate: z.string().nonempty("Ngày kết thúc là bắt buộc"),
    starttime: z.string().nonempty("Giờ bắt đầu là bắt buộc"),
    endtime: z.string().nonempty("Giờ kết thúc là bắt buộc"),
    classId: z.string().nonempty("Vui lòng chọn lớp"),
    file: z.any().optional(),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const [teacherSubjects, setTeacherSubjects] = useState<{ id: number; teacher_id: string; subject_id: string }[]>([]);
    const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Lấy danh sách giảng viên - môn học
    useEffect(() => {
        const fetchTeacherSubjects = async () => {
            try {
                const response = await axios.get("/api/teacher-subjects");
                setTeacherSubjects(response.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách giảng viên - môn học:", error);
            }
        };
        fetchTeacherSubjects();
    }, []);

    // Lấy danh sách lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("/api/classes");
                setClasses(response.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách lớp học:", error);
            }
        };
        fetchClasses();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setValue("file", file, { shouldValidate: true });
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "file" && selectedFile) {
                formDataToSend.append("file", selectedFile);
            } else {
                formDataToSend.append(key, value);
            }
        });

        try {
            console.log("🚀 Dữ liệu gửi đi:", formDataToSend);
            // Gửi dữ liệu đến API tại đây (addLesson hoặc updateLesson)
        } catch (error) {
            console.error("❌ Lỗi API:", error);
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Thêm tài liệu" : "Cập nhật tài liệu"}</h1>

            <div className="flex justify-between flex-wrap gap-4">
                {/* Chọn Giảng viên - Môn học */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Chọn giảng viên - môn học</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teacherSubjectId")}
                        defaultValue={data?.teacherSubjectId || ""}
                    >
                        <option value="">-- Chọn giảng viên - môn học --</option>
                        {teacherSubjects.map((item) => (
                            <option key={item.id} value={item.id}>
                                {`GV: ${item.teacher_id} - MH: ${item.subject_id}`}
                            </option>
                        ))}
                    </select>
                    {errors.teacherSubjectId && (
                        <p className="text-xs text-red-400">{errors.teacherSubjectId.message}</p>
                    )}
                </div>

                {/* Ngày bắt đầu */}
                <InputField
                    label="Ngày bắt đầu"
                    name="startdate"
                    type="date"
                    defaultValue={data?.startdate || new Date().toISOString().split("T")[0]}
                    register={register}
                    error={errors.startdate}
                />

                {/* Ngày kết thúc */}
                <InputField
                    label="Ngày kết thúc"
                    name="enddate"
                    type="date"
                    defaultValue={data?.enddate || new Date().toISOString().split("T")[0]}
                    register={register}
                    error={errors.enddate}
                />

                {/* Chọn lớp */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Chọn lớp</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classId || ""}
                    >
                        <option value="">-- Chọn lớp --</option>
                        {classes.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                    {errors.classId && (
                        <p className="text-xs text-red-400">{errors.classId.message}</p>
                    )}
                </div>

                {/* Giờ bắt đầu */}
                <InputField
                    label="Giờ bắt đầu"
                    name="starttime"
                    type="time"
                    defaultValue={data?.starttime || "07:00"}
                    register={register}
                    error={errors.starttime}
                />

                {/* Giờ kết thúc */}
                <InputField
                    label="Giờ kết thúc"
                    name="endtime"
                    type="time"
                    defaultValue={data?.endtime || "07:00"}
                    register={register}
                    error={errors.endtime}
                />



                {/* Upload file */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500" htmlFor="file">
                        Chọn tệp (PDF, Word, Excel)
                    </label>
                    <input
                        type="file"
                        id="file"
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                    />
                    {errors.file && <p className="text-xs text-red-400">{errors.file.message?.toString()}</p>}
                    {selectedFile && <p className="text-sm text-green-600">📂 Đã chọn: {selectedFile.name}</p>}
                </div>
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Tải lên" : "Cập nhật"}
            </button>
        </form>
    );
};

export default LessonForm;
