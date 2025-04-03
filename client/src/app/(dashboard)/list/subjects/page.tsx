"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSubjects, getSubject } from "@/services/api";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type Subject = {
  id: number;
  name: string;
  credit: number;
  course_credit: number
  process_percent: number
  midterm_percent: number
  final_percent: number
};

const columns = [
  {
    header: "Tên môn học",
    accessor: "name",
  },

  {
    header: "Hệ số điểm",
    accessor: "credits",
  },
  {
    header: "Tín chỉ",
    accessor: "credits",
  },
  {
    header: "Tín chỉ học phần",
    accessor: "credit tuit",
  },
  {
    header: "Tùy chọn",
    accessor: "action",
  },
];

const SubjectListPage = () => {
  const [subjects, setAllSubjects] = useState([]);
  const role = localStorage.getItem("role")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState([null]);
  useEffect(() => {
    const fetchSubjects = async () => {

      try {
        const data = await getSubjects(currentPage, 10);
        console.log("data>>", data);
        setAllSubjects(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchSubjects();
  }, [currentPage]);
  const renderRow = (item: Subject) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="">{`${item?.process_percent || 0} | ${item?.midterm_percent || 0} | ${item?.final_percent || 0}`} </td>
      <td className="">{item.credit}</td>
      <td className="">{item.course_credit}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="subject" type="update" data={{
                id: item.id,
                subjectname: item.name,
                credit: item.credit,
                credittuit: item.course_credit,
              }} />
              <FormModal table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr >
  );
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
    if (searchValue === "") {
      const data = await getSubjects(currentPage, 10);
      setAllSubjects(data.data);
      return
    }
    try {
      const filtered = await getSubject(searchValue);
      setAllSubjects(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm môn học:", error);
    }
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách môn học</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onChange={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="subject" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={subjects} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

    </div>
  );
};

export default SubjectListPage;
