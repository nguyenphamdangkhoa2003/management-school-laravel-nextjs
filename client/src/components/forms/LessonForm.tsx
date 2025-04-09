"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { getSubjectTeachers, addLesson, updateLesson, getAllrooms } from "@/services/api";
import moment from "moment";

const schema = (type: "create" | "update") =>
    z.object({
        id: z.coerce.number().int().min(1, { message: "ID phải là số nguyên" }).optional(),
        teacherSubjectId: z.string().nonempty("Vui lòng chọn giảng viên - môn học"),
        startdate: z.string().nonempty("Ngày bắt đầu là bắt buộc"),
        enddate: z.string().nonempty("Ngày kết thúc là bắt buộc"),
        starttime: z.string().nonempty("Giờ bắt đầu là bắt buộc"),
        endtime: z.string().nonempty("Giờ kết thúc là bắt buộc"),
        roomId: z.string().nonempty("Vui lòng chọn phòng học"),
        weekday: z.string().nonempty("Vui lòng chọn thứ"),
    }).refine((data) => {
        if (type === "update" && !data.id) return false;
        return true;
    }, { message: "ID là bắt buộc khi cập nhật", path: ["id"] });

type Inputs = z.infer<ReturnType<typeof schema>>;

const weekdays = [
    { value: "MONDAY", label: "Thứ Hai" },
    { value: "TUESDAY", label: "Thứ Ba" },
    { value: "WEDNESDAY", label: "Thứ Tư" },
    { value: "THURSDAY", label: "Thứ Năm" },
    { value: "FRIDAY", label: "Thứ Sáu" },
    { value: "SATURDAY", label: "Thứ Bảy" },
    { value: "SUNDAY", label: "Chủ Nhật" },
];

const LessonForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema(type)),
        defaultValues: {
            teacherSubjectId: data?.teacherSubjectId || "",
            roomId: data?.roomId || "",
        },
    });

    const [subjectTeachers, setAllSubjectTeachers] = useState<any[]>([]);
    const [rooms, setAllRooms] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        const fetchTeacherSubjects = async () => {
            try {
                const firstPage = await getSubjectTeachers(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;
                const allPages = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getSubjectTeachers(i + 1, 10))
                );
                const allSubjects = allPages.flatMap((page) => page.data);
                setAllSubjectTeachers(allSubjects);
                if (type === "update" && data?.teacherSubjectId) {
                    setValue("teacherSubjectId", String(data.teacherSubjectId));
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        };

        const fetchRooms = async () => {
            try {
                const firstPage = await getAllrooms(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;
                const allPages = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getAllrooms(i + 1, 10))
                );
                const allRooms = allPages.flatMap((page) => page.data);
                setAllRooms(allRooms);
                if (type === "update" && data?.roomId) {
                    setValue("roomId", String(data.roomId));
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        };

        fetchTeacherSubjects();
        fetchRooms();
    }, [type, data, setValue]);

    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
            console.log("File MIME type:", file.type);
            if (!allowedTypes.includes(file.type)) {
                setErrorMessage("Tệp không hợp lệ. Chỉ chấp nhận PDF, DOCX, PPT, PPTX.");
                return;
            }
            setSelectedFile(file);
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        setErrorMessage(null);

        console.log(formData);

        const formDataToSend = new FormData();
        formDataToSend.append("teacherSubjectId", formData.teacherSubjectId);
        formDataToSend.append("day", formData.weekday);
        formDataToSend.append("startTime", moment(formData.startdate, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm:ss"));
        formDataToSend.append("endTime", moment(formData.enddate, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm:ss"));
        formDataToSend.append("class_time", moment(formData.starttime, "HH:mm").format("HH:mm:ss"));
        formDataToSend.append("ending_class_time", moment(formData.endtime, "HH:mm").format("HH:mm:ss"));
        formDataToSend.append("room_id", formData.roomId);
        formDataToSend.append("subject_teacher_id", formData.teacherSubjectId);

        if (selectedFile) {
            console.log("File to send:", selectedFile.name, selectedFile.type);
            formDataToSend.append("file", selectedFile, selectedFile.name);
        }

        // Log form data để kiểm tra
        formDataToSend.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        try {
            if (type === "create") {
                await addLesson(formDataToSend);
                setTimeout(() => window.location.reload(), 1500);
            } else if (type === "update") {
                await updateLesson(data?.id, formDataToSend);
            }
            setShowForm(false);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || "Lỗi xử lý bài giảng");
        }
    });

    return (
        <>
            {showForm ? (
                <form className="flex flex-col gap-8" onSubmit={onSubmit} encType="multipart/form-data">
                    <h1 className="text-xl font-semibold">{type === "create" ? "Thêm tài liệu" : "Cập nhật tài liệu"}</h1>

                    <div className="flex justify-between flex-wrap gap-4">
                        {data && (
                            <InputField
                                label="id"
                                name="id"
                                defaultValue={data?.id}
                                register={register}
                                error={errors?.id}
                                hidden
                            />
                        )}

                        {/* Giảng viên - Môn học */}
                        <div className="flex flex-col gap-2 w-full md:w-1/4">
                            <label className="text-xs text-gray-500">Giảng viên - môn học</label>
                            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("teacherSubjectId")}>
                                <option value="">-- Chọn giảng viên - môn học --</option>
                                {subjectTeachers.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {`GV: ${item.teacher.name} - MH: ${item.subject.name}`}
                                    </option>
                                ))}
                            </select>
                            {errors.teacherSubjectId && <p className="text-xs text-red-400">{errors.teacherSubjectId.message}</p>}
                        </div>

                        {/* Ngày và giờ */}
                        <InputField label="Ngày bắt đầu" name="startdate" type="date"
                            defaultValue={data?.startdate || new Date().toISOString().split("T")[0]}
                            register={register} error={errors.startdate} />
                        <InputField label="Ngày kết thúc" name="enddate" type="date"
                            defaultValue={data?.enddate || new Date().toISOString().split("T")[0]}
                            register={register} error={errors.enddate} />
                        <InputField label="Giờ bắt đầu" name="starttime" type="time"
                            defaultValue={data?.starttime || "07:00"} register={register} error={errors.starttime} />
                        <InputField label="Giờ kết thúc" name="endtime" type="time"
                            defaultValue={data?.endtime || "07:00"} register={register} error={errors.endtime} />

                        {/* Phòng học */}
                        <div className="flex flex-col gap-2 w-full md:w-1/4">
                            <label className="text-xs text-gray-500">Phòng học</label>
                            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("roomId")}>
                                <option value="">-- Chọn phòng học --</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>{room.code_room}</option>
                                ))}
                            </select>
                            {errors.roomId && <p className="text-xs text-red-400">{errors.roomId.message}</p>}
                        </div>

                        {/* Thứ */}
                        <div className="flex flex-col gap-2 w-full md:w-1/4">
                            <label className="text-xs text-gray-500">Thứ</label>
                            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("weekday")}>
                                <option value="">-- Chọn thứ --</option>
                                {weekdays.map((day) => (
                                    <option key={day.value} value={day.value}>{day.label}</option>
                                ))}
                            </select>
                            {errors.weekday && <p className="text-xs text-red-400">{errors.weekday.message}</p>}
                        </div>

                        {/* File upload */}
                        <div className="flex flex-col gap-2 w-full md:w-1/4">
                            <label className="text-xs text-gray-500" htmlFor="file">Chọn tệp (PDF, DOCX, PPT, PPTX)</label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                accept=".pdf,.docx,.ppt,.pptx"
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                                onChange={handleFileChange}
                            />
                            {selectedFile && (
                                <p className="text-sm text-green-600">📂 Đã chọn: {selectedFile.name}</p>
                            )}
                        </div>
                    </div>

                    <button className="bg-blue-400 text-white p-2 rounded-md">
                        {type === "create" ? "Tải lên" : "Cập nhật"}
                    </button>
                </form>
            ) : (
                <p className="text-green-600 text-lg font-semibold">
                    ✅ {type === "create" ? "Thêm bài giảng thành công!" : "Cập nhật bài giảng thành công!"}
                </p>
            )}
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

export default LessonForm;
