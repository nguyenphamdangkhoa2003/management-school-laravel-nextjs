"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Table from "@/components/Table";
import { getListLessonsByTeacherid } from "@/services/api";

type ClassSubject = {
    classname: string;
    subjectname: string;
    dayofweek: string;
    startdate: string;
    enddate: string;
    link: string;
};

const columns = [
    { header: "Lớp", accessor: "classname" },
    { header: "Môn học", accessor: "subjectname" },
    { header: "Thứ", accessor: "dayofweek", className: "" },
    { header: "Ngày bắt đầu", accessor: "startdate", className: "hidden md:table-cell" },
    { header: "Ngày kết thúc", accessor: "enddate", className: "hidden md:table-cell" },
    { header: "Tùy chọn", accessor: "", className: "" },
];

const TeacherClasses = () => {
    const { id } = useParams();
    const [classes, setClasses] = useState<ClassSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const renderRow = (item: Class) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.classname}</td>
            <td className="">{item.subjectname}</td>
            <td className="">{item.dayofweek}</td>
            <td className="hidden md:table-cell">{item.startdate}</td>
            <td className="hidden md:table-cell">{item.enddate}</td>

        </tr>
    );
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (!id) return;
                const data = await getListLessonsByTeacherid(id);
                const formattedData = data.map((item: any) => ({
                    ...item,
                    startdate: new Date(item.startdate).toISOString().split("T")[0],
                    enddate: new Date(item.enddate).toISOString().split("T")[0],
                }));
                setClasses(formattedData);
            } catch (err) {
                setError("Không thể tải danh sách lớp học.");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [id]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <h1 className="text-lg font-semibold">Danh sách lớp học của giáo viên</h1>
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <Table
                    columns={columns}
                    data={classes}
                    renderRow={renderRow}
                />
            )}
        </div>
    );
};

export default TeacherClasses;
