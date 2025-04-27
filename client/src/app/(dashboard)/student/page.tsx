"use client"
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import { getLessonByStudentid } from "@/services/api";
import { useState, useEffect } from "react";

const StudentPage = () => {
  const [lessons, setAllLessonById] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const studentId = user?.id;
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonByStudentid(studentId);
        console.log(data)
        setAllLessonById(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch học:", error);
      }
    };
    fetchLessons();
  }, []);
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendar events={lessons} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />

      </div>
    </div>
  );
};

export default StudentPage;
