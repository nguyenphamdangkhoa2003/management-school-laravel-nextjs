"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getParents,getParent,getStudents } from "@/services/api";
import Image from "next/image";
import { useState,useEffect } from "react";

type Parent = {
  id: number;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student Names",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ParentListPage = () => {
  const [parents, setAllParent]=useState([]);
  const [students, setAllStudens]=useState([]);
  const [error, setError]=useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem("role");
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [parentData, studentData] = await Promise.all([
        getParents(currentPage, 10),
        getStudents(currentPage, 10),
      ]);

      setAllParent(parentData.data);
      setAllStudens(studentData.data);
      setTotalPages(parentData.meta?.last_page || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchData();
}, [currentPage]);

  const renderRow = (item: Parent) => {
    
  const studentNames = students
    .filter((student) => Number(student.guardian.id) === Number(item.id)) 
    .map((student) => student.name)
    .join(", ");
    return(
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{studentNames}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  }
  const handleSearch =async(e: React.ChangeEvent<HTMLInputElement>)=>{
      const searchValue = e.target.value.trim();
      if(searchValue ===" "){
        const data= getParents(currentPage,10)
        setAllParent(data.data)
        return
      }
      try {
        const filtered = await getParent(searchValue);
        setAllParent(filtered);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm phụ huynh:", error);
      }
    }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onChange={handleSearch}/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <FormModal table="parent" type="create"/>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={parents} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

    </div>
  );
};

export default ParentListPage;
