"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSubjectTeachers } from "@/services/api";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type SubjectTeacher = {
  id: number;
  subject: string;
  teacher: string;
};

const columns = [
  {
    header: "Tên môn học",
    accessor: "name",
  },
  {
    header: "Giảng viên",
    accessor: "class",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const SubjectTeacherListPage = () => {
  const [subjectteachers,setAllSubjectTeacher ] = useState([]);
    const role = localStorage.getItem("role")
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState([null]);
    useEffect(() => {
      const fetchSubjectTeacher = async () => {
        try {
          const data = await getSubjectTeachers(currentPage, 10);
          setAllSubjectTeacher(data.data);
          setTotalPages(data.meta?.last_page || 1);
        } catch (error:any) {
          setError(error.message);
        }
      };
      fetchSubjectTeacher();
    }, [currentPage]);
  const renderRow = (item: SubjectTeacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.teacher.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="subjectteacher" type="update" data={item} />
              <FormModal table="subjectteacher" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="subjectteacher" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={subjectteachers} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

    </div>
  );
};

export default SubjectTeacherListPage;
