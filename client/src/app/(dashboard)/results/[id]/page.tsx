"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getStudent, getResultByStudentId } from "@/services/api";
import { useParams } from "next/navigation";

const columns = [
    {
        header: "STT",
        accessor: "stt",
    },
    {
        header: "Mã môn",
        accessor: "subjectid",
    },
    {
        header: "Tên môn",
        accessor: "subjectname",
    },
    {
        header: "TC",
        accessor: "credits",
    },
    {
        header: "%QT",
        accessor: "%qt",
    },
    {
        header: "%GK",
        accessor: "%gk",
    },
    {
        header: "%CK",
        accessor: "%ck",
    },

    {
        header: "QT",
        accessor: "qt",
    },

    {
        header: "GK",
        accessor: "gk",
    },

    {
        header: "CK",
        accessor: "ck",
    },

    {
        header: "TK1",
        accessor: "tk1",
    },

    {
        header: "TK2",
        accessor: "tk2",
    },

    {
        header: "KQ",
        accessor: "result",
    },
];

const ResultPage = () => {
    const [students, setAllStudens] = useState([]);
    const [error, setError] = useState([null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const role = localStorage.getItem("role");
    const { id } = useParams();
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getResultByStudentId(Number(id));
                setAllStudens(data.data);
                setTotalPages(data.meta?.last_page || 1);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchStudents();
    }, [currentPage]);
    const renderRow = (item: any) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="p-4">{item.stt}</td>
            <td >{item.subject_code}</td>
            <td >{item.subject_name}</td>
            <td >{item.credits}</td>
            <td >{item.process_percent}</td>
            <td >{item.midterm_percent}</td>
            <td >{item.final_percent}</td>
            <td >{item.process_score}</td>
            <td >{item.semi_score}</td>
            <td >{item.final_score}</td>
            <td >{(item.process_score != null && item.semi_score != null && item.final_score != null) ? item.final_total_score : ""}</td>
            <td >{(item.process_score != null && item.semi_score != null && item.final_score != null) ? item.total_score_3 : ""}</td>
            <td >{(item.process_score != null && item.semi_score != null && item.final_score != null) ? item.result : ""}</td>
        </tr>
    );
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.trim();
        if (searchValue === "") {
            setAllStudens(students);
            return
        }
        try {
            const filteredStudent = await getStudent(searchValue);
            setAllStudens(filteredStudent);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sinh viên:", error);
        }
    }
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Bảng điểm</h1>
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
                            <FormModal table="student" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={students} />
            {/* PAGINATION */}
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default ResultPage;