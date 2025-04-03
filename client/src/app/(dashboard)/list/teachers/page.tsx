"use client";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTeachers, getTeacher, getSubjectTeachers } from "@/services/api";

type Teacher = {
  id: number;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  school_classes: string[];
  address: string;
};

const columns = [
  {
    header: "Thông tin",
    accessor: "info",
  },
  {
    header: "Mã giảng viên",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Môn học",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Lớp",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Điện thoại",
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

const TeacherListPage = () => {
  const [teachers, setAllTeachers] = useState([]);
  const [subjectteacher, setAllSubjectTeacher] = useState([]);
  const [error, setError] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem("role");


  useEffect(() => {
    const fetchAllTeachers = async () => {
      try {
        const teacherData = await getTeachers(currentPage, 10);

        const firstPage = await getSubjectTeachers(1, 10);
        const totalPages = firstPage.meta?.last_page || 1;

        const allSubjectPages = await Promise.all(
          Array.from({ length: totalPages }, (_, i) => getSubjectTeachers(i + 1, 10))
        );
        const allSubjectTeachers = allSubjectPages.flatMap((page) => page.data);
        setAllTeachers(teacherData.data);
        setAllSubjectTeacher(allSubjectTeachers);
        setTotalPages(teacherData.meta?.last_page || 1);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchAllTeachers();
  }, [currentPage]);



  const renderRow = (item: Teacher) => {
    const subjectname = subjectteacher
      ?.filter((subtea) => Number(item.id) === Number(subtea?.teacher?.id))
      ?.map((subtea) => subtea?.subject?.name)
      ?.join(", ") || "N/A";

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item?.img ? `${item.img}` : "/avatar.png"}
            alt="Teacher Avatar"
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.surname + " " + item.name}</h3>
            <p className="text-xs text-gray-500">{item?.email}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.id}</td>
        <td className="hidden md:table-cell">
          {subjectname}
        </td>
        <td className="hidden md:table-cell">
          {Array.isArray(item.school_classes) && item.school_classes.length > 0
            ? item.school_classes.map((cls) => cls.name).join(", ")
            : ""}
        </td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/teachers/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <Image src="/view.png" alt="" width={16} height={16} />
              </button>
            </Link>
            {role === "admin" && (
              <FormModal table="teacher" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();

    if (searchValue === "") {
      const data = await getTeachers(currentPage, 10);
      setAllTeachers(data.data);
      return;
    }

    try {
      const filteredTeachers = await getTeacher(searchValue);
      setAllTeachers(filteredTeachers);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm giáo viên:", error);
    }
  };


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách giảng viên</h1>
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
              <>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                  <FormModal table="teacher" type="create" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teachers} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default TeacherListPage;
