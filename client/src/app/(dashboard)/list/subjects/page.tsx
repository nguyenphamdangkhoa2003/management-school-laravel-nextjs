"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSubjects,getSubject } from "@/services/api";
import Image from "next/image";
import React, { useState,useEffect } from "react";

type Subject = {
  id: number;
  name: string;
  teachers: string;
};

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const SubjectListPage = () => {
  const [subjects, setAllSubjects] = useState([]);
  const role =localStorage.getItem("role")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError]=useState([null]);
  useEffect (()=>{
    const fetchSubjects = async () => {
      
      try {
        const data = await getSubjects(currentPage,10);
        setAllSubjects(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchSubjects();
  },[currentPage]);
  const renderRow = (item: Subject) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell"></td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="subject" type="update" data={item} />
              <FormModal table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const searchValue = e.target.value.trim();
        if(searchValue ===""){
          const data = await getSubjects(currentPage,10);
          setAllSubjects(data.data);
          return
        }
        try {
          const filteredStudent = await getSubject(searchValue);
          setAllSubjects(filteredStudent);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm môn học:", error);
        }
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onChange={handleSearch}/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
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
