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
    { header: "Mã phòng", accessor: "code_room" },
    { header: "Tên phòng", accessor: "name" },
    { header: "Tầng", accessor: "floor" },
    { header: "Số chỗ ngồi", accessor: "capacity" },
    { header: "Loại phòng", accessor: "type" },
    { header: "Tình trạng hoạt động", accessor: "is_available" },
    { header: "Tùy chọn", accessor: "action" },
];

type Room = {
    id: number;
    code_room: string;
    name: string;
    floor: number;
    capacity: number;
    type: "lecture" | "lab" | "office" | "meeting"; // hoặc string nếu không chắc chắn
    is_available: boolean;
};


const ListRoom = () => {
    const [rooms, setAllrooms] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    const fetchAttendance = useCallback(async (page = 1) => {
        try {
            const data = await getAllrooms(page, 10);
            setAllrooms(data.data);
            setTotalPages(data.meta?.last_page || 1);
        } catch (err: any) {
            console.error("Lỗi khi lấy dữ liệu phòng học:", err);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchAttendance(currentPage);
    }, [fetchAttendance, currentPage]);

    // const handleSearch = useCallback(async (e) => {
    //     const searchValue = e.target.value.trim();
    //     if (searchValue === "") {
    //         fetchAttendance(currentPage);
    //         return;
    //     }
    //     try {
    //         const filteredRooms = await searchAttendance(searchValue);
    //         setAllrooms(filteredRooms);
    //     } catch (error) {
    //         console.error("Lỗi khi tìm kiếm:", error);
    //     }
    // }, [currentPage]);

    const renderRow = (item: Room) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="p-4">{item.code_room}</td>
            <td>{item.name}</td>
            <td>{item.floor}</td>
            <td>{item.capacity}</td>
            <td>{item.type === "lecture" ? "Lý thuyết" : item.type === "lab" ? "Thực hành" : item.type === "office" ? "Văn phòng" : "Phòng họp"}</td>
            <td>{item.is_available ? "Hoạt động" : "Ngưng hoạt động"}</td>
            <td className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="room" type="update" data={{
                            id: item.id,
                            code_room: item.code_room,
                            name: item.name,
                            floor: item.floor,
                            capacity: item.capacity,
                            type: item.type,
                            is_available: item.is_available,
                        }} />
                        <FormModal table="room" type="delete" id={item.id} />
                    </>
                )}
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Danh sách phòng học</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* <TableSearch onChange={handleSearch} /> */}
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
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

export default ListRoom;
