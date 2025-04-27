"use client"
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import { teachercalendarEvents } from "@/lib/data";
import { getLessonsByTeacherid } from "@/services/api";
import { useState, useEffect } from "react";
const TeacherPage = () => {
  const [lessons, setAllLessonById] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const teacherId = user?.id;
  console.log(`>>>>>>>> ${teacherId}`)
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsByTeacherid(teacherId);
        setAllLessonById(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch học:", error);
      }
    };
    fetchLessons();
  }, []);
  console.log(lessons)
  return (
    <div className="flex-1 p-4">
      {/* LEFT */}
      <div className="w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Lịch giảng dạy</h1>
          <BigCalendar events={lessons} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">

      </div>
    </div>
  );
};

export default TeacherPage;
