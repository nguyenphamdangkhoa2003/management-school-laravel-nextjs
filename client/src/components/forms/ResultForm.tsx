"use client";

import { addResult, getLessonsByStudentid, getStudents, updateResult } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SearchableSelect from "../SearchableSelect";

const schema = (type: "create" | "update") =>
    z.object({
        ...(type === "create" ? {
            student_id: z.string().min(1, "Vui lòng chọn sinh viên"),
            subject_id: z.string().min(1, "Vui lòng chọn môn học"),
        } : {}),
        process_score: z
            .union([z.coerce.number(), z.undefined()])
            .refine((val) => val === undefined || (Number.isFinite(val) && val >= 0 && val <= 10), {
                message: "Điểm quá trình phải từ 0 đến 10",
            }),
        midterm_score: z
            .union([z.coerce.number(), z.undefined()])
            .refine((val) => val === undefined || (Number.isFinite(val) && val >= 0 && val <= 10), {
                message: "Điểm giữa kỳ phải từ 0 đến 10",
            }),
        final_score: z
            .union([z.coerce.number(), z.undefined()])
            .refine((val) => val === undefined || (Number.isFinite(val) && val >= 0 && val <= 10), {
                message: "Điểm cuối kỳ phải từ 0 đến 10",
            }),
    });


const ResultForm = ({ type, data }) => {
    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
        resolver: zodResolver(schema(type)),
        defaultValues: {
            student_id: String(data?.student_id || ""),
            subject_id: String(data?.subject_id || ""),
        },
    });
    const [showForm, setShowForm] = useState(true);
    const [studentOptions, setStudentOptions] = useState([]);
    const [lessonOptions, setLessonOptions] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const firstPage = await getStudents(1, 10);
                const totalPages = firstPage.meta?.last_page || 1;
                const allStudents = (await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => getStudents(i + 1, 10))
                )).flatMap((page) => page.data);

                setStudentOptions(allStudents.map((item) => ({
                    value: String(item.id),
                    code: item.code,
                    name: `${item.surname} ${item.name}`,
                })));

                if (type === "update" && data?.student_id) {
                    setValue("student_id", String(data.student_id));
                    setSelectedStudentId(String(data.student_id));
                }
            } catch (err) {
                setErrorMessage(err.message);
            }
        };

        fetchStudents();
    }, [type, data, setValue]);

    useEffect(() => {
        if (!selectedStudentId) return;

        const fetchLessons = async () => {
            try {
                const allLessons = await getLessonsByStudentid(selectedStudentId);
                setLessonOptions(allLessons.map((item) => ({
                    value: String(item.lesson?.subject_teacher?.subject?.id || ""),
                    name: item.lesson?.subject_teacher?.subject?.name || "Không xác định",
                })));
                setValue("subject_id", ""); // Reset subject_id value to empty when student changes
                if (type === "update" && data?.subject_id) {
                    setValue("subject_id", String(data.subject_id));
                }
            } catch (err) {
                setErrorMessage(err.message);
            }
        };

        fetchLessons();
    }, [selectedStudentId, type, data, setValue]);

    const onSubmit = handleSubmit(async (formData) => {

        console.log("dataday>>", data);
        console.log("data>>", data);
        const resultform = new FormData;
        if (formData.process_score !== undefined)
            resultform.append("process_score", formData.process_score);
        if (formData.midterm_score !== undefined)
            resultform.append("semi_score", formData.midterm_score);
        if (formData.final_score !== undefined)
            resultform.append("final_score", formData.final_score);

        try {
            let newresult, updresult;
            if (type === "create") {
                resultform.append("student_id", formData.student_id);
                resultform.append("subject_id", formData.subject_id);
                newresult = await addResult(resultform);
            } else if (type === "update") {
                updresult = await updateResult(data.id, resultform);
            }
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
                    <h1 className="text-xl font-semibold">
                        {type === "create" ? "Nhập điểm" : "Cập nhật điểm"}
                    </h1>
                    <div className="flex flex-col gap-4">
                        {type === "update" && data && (
                            <InputField label="ID" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />
                        )}
                        {type === "create" ?
                            <>
                                <div>
                                    <label className="block font-medium">Chọn sinh viên</label>
                                    <SearchableSelect
                                        options={studentOptions}
                                        placeholder="Chọn sinh viên..."
                                        getOptionLabel={(e) => `${e.code} - ${e.name}`}
                                        defaultValue={String(data?.student_id || "")}
                                        onChange={(selected) => {
                                            setValue("student_id", String(selected?.value || ""));
                                            setSelectedStudentId(String(selected?.value || ""));
                                            trigger("student_id");
                                        }}
                                    />
                                    {errors.student_id && <p className="text-red-500 text-sm">{errors.student_id.message}</p>}
                                </div>
                                <div>
                                    <label className="block font-medium">Chọn môn học</label>
                                    <SearchableSelect
                                        key={selectedStudentId} // Add the key to force re-render
                                        options={lessonOptions}
                                        placeholder="Chọn môn học..."
                                        getOptionLabel={(e) => e.name}
                                        defaultValue={data?.subject_id || ""}
                                        onChange={(selected) => {
                                            setValue("subject_id", String(selected?.value || ""));
                                            trigger("subject_id");
                                        }}
                                    />
                                    {errors.subject_id && <p className="text-red-500 text-sm">{errors.subject_id.message}</p>}
                                </div>
                            </> : <>
                                <div className='flex flex-col gap-4 w-full justify-between'>
                                    <div>
                                        <label className="block text-xs text-gray-500">Tên sinh viên</label>
                                        <input type="text" defaultValue={data.student_name} className="border border-gray-300 p-2 rounded-lg text-sm w-full bg-white 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    hover:border-blue-400 transition-all" readOnly />

                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Môn học</label>
                                        <input type="text" defaultValue={data.subject_name} className="border border-gray-300 p-2 rounded-lg text-sm w-full bg-white 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    hover:border-blue-400 transition-all" readOnly />

                                    </div>
                                </div>
                            </>}
                        <div className="flex justify-between">
                            <InputField
                                label="Điểm quá trình"
                                name="process_score"
                                type="number"
                                step="0.1"
                                defaultValue={data?.process_score || ""}
                                register={register}
                                error={errors.process_score}
                            />

                            <InputField
                                label="Điểm giữa kỳ"
                                name="midterm_score"
                                type="number"
                                step="0.1"
                                defaultValue={data?.semi_score}
                                register={register}
                                error={errors.midterm_score}
                            />
                            <InputField
                                label="Điểm cuối kỳ"
                                name="final_score"
                                type="number"
                                step="0.1"
                                defaultValue={data?.final_score}
                                register={register}
                                error={errors.final_score}
                            />
                        </div>
                    </div>
                    <button className="bg-blue-400 text-white p-2 rounded-md">
                        {type === "create" ? "Nhập điểm" : "Cập nhật"}
                    </button>
                </form>

            ) : (
                <div>
                    {type === "create" && (
                        <p className="text-green-600 text-lg font-semibold">✅ Thêm điểm thành công!</p>
                    )}
                    {type === "update" && (
                        <p className="text-green-600 text-lg font-semibold">✅ Cập nhật thành công!</p>
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

export default ResultForm;
