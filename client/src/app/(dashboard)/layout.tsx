"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const accessControl = {
  admin: ["/admin", "/list/teachers", "/list/students", "/list/parents", "/list/subjects", "/list/classes", "/list/lessons", "/list/subject-teacher", "/list/assignments", "/list/results", "/list/attendance", "/list/messages", "/list/announcements", "/list/student-lessons", "/list/rooms"],
  teacher: ["/teacher", "/list/classes", "/list/teachers", "/list/students", "/list/parents", "/list/lessons", "/list/assignments", "/list/results", "/list/attendance", "/list/messages", "/list/announcements"],
  student: ["/student", "/list/assignments", "/list/results", "/list/attendance", "/list/messages", "/list/announcements"],
  parent: ["/list/assignments", "/list/results", "/list/attendance", "/list/messages", "/list/announcements"],
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (!storedRole) {
      router.push("/sign-in");
      return;
    }

    const isAllowed = accessControl[storedRole]?.some(route =>
      pathname.startsWith(route) || new RegExp(`^${route.replace("[id]", "[^/]+")}$`).test(pathname)
    );

    if (!isAllowed) {
      router.push("/");
    }

  }, [router, pathname]);

  if (!role) {
    return null;
  }

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <img src="/newlogostu.png" className="w-full block lg:hidden" alt="Logo" />
          <img src="/newlogo2.png" className="w-full hidden lg:block" alt="Logo" />
        </Link>
        <Menu />
      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
