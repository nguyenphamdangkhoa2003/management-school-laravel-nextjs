"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getStudents, getStudent } from "@/services/api";
export type Student = {
  id: number;
  code: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  address: string;
  img?: string;
  grade?: Grade;
  school_class?: SchoolClass;
  birthday?: string;
  bloodType?: string;
  guardian_id?: number;
};

type Grade = {
  id: number;
  level: string;
};

type SchoolClass = {
  id: number;
  name: string;
};

const columns = [
  {
    header: "Thông tin",
    accessor: "info",
  },
  {
    header: "Mã sinh viên",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Niên khóa",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "số điện thoại",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Địa chỉ",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Tùy chọn",
    accessor: "action",
  },
];

const StudentListPage = () => {
  const [students, setAllStudens] = useState([]);
  const [error, setError] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents(currentPage, 10);
        setAllStudens(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchStudents();
  }, [currentPage]);
  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item?.img ? `${item.img}` : "/avatar.png"}
          alt="Sinh viên"
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.surname + " " + item.name}</h3>
          <p className="text-xs text-gray-500">
            {item.school_class?.name || ""}
          </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.code}</td>
      <td className="hidden md:table-cell">{item.grade?.level || ""}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="student" type="delete" id={item.id} />
          )}
        </div>
      </td>
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

export default StudentListPage;
