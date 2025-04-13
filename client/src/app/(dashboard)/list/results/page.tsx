"use client";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { getAllresults } from "@/services/api";
import { date } from "zod";

const columns = [
  { header: "Mã sinh viên", accessor: "studentcode" },
  { header: "Tên sinh viên", accessor: "name" },
  { header: "Môn học", accessor: "subject" },
  { header: "Điểm quá trình", accessor: "processscore" },
  { header: "Điểm giữa kì", accessor: "midtermscore" },
  { header: "Điểm cuối kì", accessor: "finalscore" },
  { header: "Điểm tổng", accessor: "averagescore" },
  { header: "Tùy chọn", accessor: "action" },
];

type Result = {
  id: number;
  student: {
    id: number;
    code: string;
    surname: string;
    name: string;
  };
  subject: {
    id: number;
    name: string;
    process_percent: number;
    midterm_percent: number,
    final_percent: number,
  };
  process_score: number;
  semi_score: number;
  final_score: number;
  average_score: number;
};


const ResutlsList = () => {
  const [results, setAllresults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const fetchAttendance = useCallback(async (page = 1) => {
    try {
      const data = await getAllresults(page, 10);
      console.log(">><>>", data);
      setAllresults(data.data);
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
  //   const searchValue = e.target.value.trim();
  //   if (searchValue === "") {
  //     fetchAttendance(currentPage);
  //     return;
  //   }
  //   try {
  //     const filteredResults = await searchAttendance(searchValue);
  //     setAllresults(filteredResults);
  //   } catch (error) {
  //     console.error("Lỗi khi tìm kiếm:", error);
  //   }
  // }, [currentPage]);

  const renderRow = (item: Result) => {


    const ps = item.process_score;
    const ss = item.semi_score;
    const fs = item.final_score;
    let average = "";
    if (ps != null && ss != null && fs != null) {
      const p = item.subject?.process_percent || 0;
      const m = item.subject?.midterm_percent || 0;
      const f = item.subject?.final_percent || 0;
      const totalWeight = p + m + f;
      average =
        totalWeight > 0
          ? ((ps * p + ss * m + fs * f) / totalWeight).toFixed(2)
          : "0";
    }

    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.student.code}</td>
        <td>{`${item.student.surname} ${item.student.name}`}</td>
        <td>{item.subject.name}</td>
        <td>{item.process_score}</td>
        <td>{item.semi_score}</td>
        <td>{item.final_score}</td>
        <td>{average}</td>
        <td className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="result" type="update" data={{
                id: item.id,
                student_id: item.student.id,
                student_name: `${item.student.surname} ${item.student.name} `,
                subject_id: item.subject.id,
                subject_name: item.subject.name,
                process_score: item.process_score,
                semi_score: item.semi_score,
                final_score: item.final_score,
              }} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách điểm</h1>
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
              <FormModal table="result" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={results} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default ResutlsList;
