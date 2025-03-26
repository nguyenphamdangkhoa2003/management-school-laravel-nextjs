"use client";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { getAllrooms } from "@/services/api";

const columns = [
    { header: "Mã phòng", accessor: "code" },
    { header: "Tên phòng", accessor: "studentname" },
    { header: "Tùy chọn", accessor: "action" },
];

const StudentLessons = () => {
    const [rooms, setAllrooms] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    const fetchAttendance = useCallback(async (page = 1) => {
        try {
            const data = await getAllrooms(page, 10);
            setAllrooms(data.data);
            console.log(">>>>>", data.data);
            setTotalPages(data.meta?.last_page || 1);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu điểm danh:", err);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchAttendance(currentPage);
    }, [fetchAttendance, currentPage]);


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
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >

            <td className="flex items-center gap-4 p-4">{item.id}</td>
            <td >{item.code_room}</td>

            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/students/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/view.png" alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "admin" && (
                        <FormModal table="room" type="delete" id={item.id} />
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Danh sách sinh viên</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch onChange={handleSearch} />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            //   <Image src="/plus.png" alt="" width={14} height={14} />
                            // </button>
                            <FormModal table="room" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={rooms} />
            {/* PAGINATION */}
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default StudentLessons;
