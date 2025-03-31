"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  {
    items: [
      {
        icon: "/profile.png",
        label: "Hồ sơ",
        href: "/profile", // default, sẽ được cập nhật động
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Cài đặt",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Đăng xuất",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
        isLogout: true,
      },
    ],
  },
];

const Acount = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const storedRole = localStorage.getItem("role") || "";
    setUser(storedUser);
    setRole(storedRole);
  }, []);

  // Cập nhật link "Hồ sơ" dựa trên vai trò và user
  const updatedMenuItems = menuItems.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.label === "Hồ sơ" && user && role) {
        let href = "/profile"; // default
        if (role === "teacher") href = `/teacher/${user.id}`;
        else if (role === "student") href = `/student/${user.id}`;
        else if (role === "parent") href = `/parent/${user.id}`;
        else if (role === "admin") href = `/profile/${user.id}`; // admin có thể có route riêng nếu cần
        return { ...item, href };
      }
      return item;
    }),
  }));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    router.push("/sign-in");
  };

  return (
    <div>
      {updatedMenuItems.map((group, index) => (
        <div key={index} className="flex flex-col gap-1">
          {group.items.map((item) =>
            item.isLogout ? (
              <button
                key={item.label}
                onClick={handleLogout}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200 w-full"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Acount;
