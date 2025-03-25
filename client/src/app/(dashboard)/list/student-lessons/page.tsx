"use client";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { getAllAttendance, searchAttendance } from "@/services/api";

const columns = [
    { header: "Mã sinh viên", accessor: "code" },
    { header: "Tên sinh viên", accessor: "studentname", className: "hidden md:table-cell" },
    { header: "Tên môn học", accessor: "subjectname", className: "hidden md:table-cell" },
    { header: "Tên giảng viên", accessor: "teachername", className: "hidden lg:table-cell" },
    { header: "Thứ", accessor: "dayofweek", className: "hidden lg:table-cell" },
    { header: "Ngày bắt đầu", accessor: "startdate", className: "hidden lg:table-cell" },
    { header: "Ngày kết thúc", accessor: "enddate", className: "hidden lg:table-cell" },
    { header: "Tùy chọn", accessor: "action" },
];

const StudentLessons = () => {
    const [attendance, setAllSAttendance] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    const fetchAttendance = useCallback(async (page = 1) => {
        try {
            const data = await getAllAttendance(page, 10);
            setAllSAttendance(data.data);
            setTotalPages(data.meta?.last_page || 1);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu điểm danh:", err);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchAttendance(currentPage);
    }, [fetchAttendance, currentPage]);

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateString));
    };


    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.trim();
        if (searchValue === "") {
            fetchAttendance(currentPage);
            return;
        }
        try {
            const filteredAttendance = await searchAttendance(searchValue);
            setAllSAttendance(filteredAttendance);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        }
    };

    const renderRow = (item: any) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td>{item.student.id}</td>
            <td className="hidden md:table-cell">{item.student.name}</td>
            <td className="hidden md:table-cell">{item.lesson.subject_teacher.subject.name}</td>
            <td className="hidden md:table-cell">{item.lesson.subject_teacher.teacher.name}</td>
            <td className="hidden md:table-cell">{item.lesson.day}</td>
            <td className="hidden md:table-cell">{formatDate(item.lesson.startTime)}</td>
            <td className="hidden md:table-cell">{formatDate(item.lesson.endTime)}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/students/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/view.png" alt="View" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "admin" && <FormModal table="student" type="delete" id={item.id} />}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Danh sách đăng ký môn học</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch onChange={handleSearch} />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="Filter" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="Sort" width={14} height={14} />
                        </button>
                        {role === "admin" && <FormModal table="student" type="create" />}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={attendance} />

            {/* PAGINATION */}
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default StudentLessons;
