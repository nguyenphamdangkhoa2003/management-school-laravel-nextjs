"use client";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { getLessonsByTeacherid, getOneTeachers } from "@/services/api";
import moment from "moment";

type Teacher = {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: string;
  sex: string;
  img: string;
};

type Lesson = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  subject: string;
  teacher_id: number;
};

type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
  teacherId: number;
  location: string;
  subject: string;
};

const SingleTeacherPage = () => {
  const { id } = useParams();
  const teacherId = typeof id === 'string' ? Number(id) : 0;
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [lessons, setAllLessonById] = useState<Lesson[]>([]);
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (!id) return;
    const teacherId = typeof id === 'string' ? Number(id) : 0;

    const fetchData = async () => {
      try {
        // Lấy thông tin giáo viên
        const teacherRes = await getOneTeachers(teacherId);
        console.log("teacher>>", teacherRes)
        setTeacher(teacherRes);

        // Lấy danh sách bài giảng
        const lessonData = await getLessonsByTeacherid(teacherId);
        setAllLessonById(lessonData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={(teacher?.img) ? `${teacher?.img}` : "/avatar.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{teacher?.surname + " " + teacher?.name}</h1>
                {role === "admin" && <FormModal
                  table="teacher"
                  type="update"
                  data={{
                    username: teacher?.username || "",
                    email: teacher?.email || "",
                    password: "password",
                    surname: teacher?.surname || "",
                    name: teacher?.name || "",
                    phone: teacher?.phone || "",
                    address: teacher?.address || "",
                    bloodType: teacher?.bloodType || "",
                    birthday: teacher?.birthday ? new Date(teacher.birthday).toISOString().split("T")[0] : "",
                    sex: teacher?.sex || "",
                    img: teacher?.img ? `${process.env.NEXT_PUBLIC_API_URL}/${teacher.img}` : "",
                  }}
                />}
              </div>
              <p className="text-sm text-gray-500">

              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{teacher?.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{moment(teacher?.birthday, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY")}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{teacher?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{teacher?.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendar events={lessons} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Teacher&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Teacher&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />

      </div>
    </div>
  );
};

export default SingleTeacherPage;
