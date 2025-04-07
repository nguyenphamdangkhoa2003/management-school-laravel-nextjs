"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getClasses, getClass } from "@/services/api";
type Class = {
  id: number;
  name: string;
  capacity: number;
  grade_id: number;
  supervisor_id: string;
};

const columns = [
  {
    header: "Tên lớp",
    accessor: "name",
  },
  {
    header: "Sĩ số",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Niên khóa",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Người giám sát",
    accessor: "supervisor",
    className: "hidden md:table-cell",
  },
  {
    header: "Tùy chọn",
    accessor: "action",
  },
];

const ClassListPage = () => {
  const [classes, setAllClass] = useState([]);
  const [error, setError] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses(currentPage, 10);
        setAllClass(data.data);
        console.log(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchClasses();
  }, [currentPage]);
  const renderRow = (item: Class) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.grade_id}</td>
      <td className="hidden md:table-cell">{item.supervisor_id}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="class" type="update" data={{
                id: item.id,
                classname: item.name,
                capacity: item.capacity,
                gradeID: item.grade_id,
              }} />
              <FormModal table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
    if (searchValue === "") {
      const data = await getClasses(currentPage, 10);
      setAllClass(data.data);
      return
    }
    try {
      const filtered = await getClass(searchValue);
      setAllClass(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm lớp học:", error);
    }
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách lớp</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onChange={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={classes} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

    </div>
  );
};

export default ClassListPage;
