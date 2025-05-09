"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getLessons, getLesson } from "@/services/api";
import moment from "moment";
import Image from "next/image";
import { useState, useEffect } from "react";

type Lesson = {
  id: number;
  day: string;
  subject: string;
  class: string;
  teacher: string;
  startTime: string;
  endTime: string;
  class_time: string;
  ending_class_time: string;
  room: {
    id: number;
    code_room: string;
  }
  subject_teacher: {
    id: number,
    subject: {
      name: string;
    },
    teacher: {
      name: string;
    }
  }
};

const columns = [
  {
    header: "Môn học",
    accessor: "name",
  },
  {
    header: "Thứ",
    accessor: "day",
  },
  {
    header: "Ngày bắt đầu",
    accessor: "startday",
  },
  {
    header: "Ngày kết thúc",
    accessor: "endday",
  },
  {
    header: "giờ học",
    accessor: "hourstudy",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Phòng học",
    accessor: "room",
  },
  {
    header: "Tùy chọn",
    accessor: "action",
  },
];

const LessonListPage = () => {
  const [lessons, setAllLesson] = useState([]);
  const [error, setError] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessons(currentPage, 10);
        setAllLesson(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchLessons();
  }, [currentPage]);
  const renderRow = (item: Lesson) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject_teacher.subject.name}</td>
      <td>{item.day}</td>
      <td>{moment(item.startTime).format("DD/MM/YYYY")}</td>
      <td>{moment(item.endTime).format("DD/MM/YYYY")}</td>
      <td>
        {moment(item.class_time, "HH:mm:ss").format("HH:mm") + " - " + moment(item.ending_class_time, "HH:mm:ss").format("HH:mm")}
      </td>
      <td>{item.room.code_room}</td>

      <td className="hidden md:table-cell">{item.subject_teacher.teacher.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={{
                id: item.id,
                teacherSubjectId: item.subject_teacher.id,
                weekday: item.day,
                startdate: item?.startTime ? new Date(item.startTime).toLocaleDateString("en-CA") : "",
                enddate: item?.endTime ? new Date(item.endTime).toLocaleDateString("en-CA") : "",
                starttime: item.class_time,
                endtime: item.ending_class_time,
                roomId: item.room.id,
              }} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
    if (searchValue === "") {
      const data = await getLessons(currentPage, 10);
      setAllLesson(data.data);
      return
    }
    try {
      const filtered = await getLesson(searchValue);
      setAllLesson(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm lớp học:", error);
    }
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Danh sách bài giảng</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onChange={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="lesson" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={lessons} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default LessonListPage;
