"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    items: [
      {
        icon: "/home.png",
        label: "Trang chủ",
        href: "/admin",
        visible: ["admin"],
      },

      {
        icon: "/home.png",
        label: "Trang chủ",
        href: "/",
        visible: ["teacher", "student", "parent"],
      },

      {
        icon: "/teacher.png",
        label: "Lịch dạy",
        href: "/teacher",
        visible: ["teacher"],
      },
      {
        icon: "/teacher.png",
        label: "Lịch học",
        href: "/student",
        visible: ["student"],
      },

      {
        icon: "/teacher.png",
        label: "Giáo viên",
        href: "/list/teachers",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        label: "Sinh viên",
        href: "/list/students",
        visible: ["admin"],
      },
      {
        icon: "/parent.png",
        label: "Phụ huynh",
        href: "/list/parents",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Môn học",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Lớp học",
        href: "/list/classes",
        visible: ["admin"],
      },

      {
        icon: "/class.png",
        label: "Phòng học",
        href: " /list/rooms",
        visible: ["admin"],
      },

      {
        icon: "/list.png",
        label: "Danh sách đăng ký môn",
        href: "/list/student-lessons",
        visible: ["admin"],
      },

      {
        icon: "/lesson.png",
        label: "Bài giảng",
        href: "/list/lessons",
        visible: ["admin"],
      },
      {
        icon: "/exam.png",
        label: "Môn giảng dạy",
        href: "/list/subject-teacher",
        visible: ["admin"],
      },

      {
        icon: "/result.png",
        label: "Kết quả",
        href: "/list/results",
        visible: ["admin"],
      },

      {
        icon: "/result.png",
        label: "Kết quả",
        href: "/results/1",
        visible: ["student"],
      },

      {
        icon: "/exam.png",
        label: "Niên khóa",
        href: "/list/grade",
        visible: ["admin"],
      },

      {
        icon: "/announcement.png",
        label: "Thông báo",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    console.log(localStorage.getItem("user"));
  }, []);

  if (!role) return null; // hoặc loading UI tùy bạn

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i, index) => (
        <div className="flex flex-col gap-1" key={`menu-group-${index}`}>
          {i.items.map((item) => {
            if (role && item.visible.includes(role)) {
              return (
                <Link
                  href={item.href.trim()}
                  key={`${item.label}-${item.href}`}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
