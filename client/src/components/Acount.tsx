"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    items: [
      {
        icon: "/profile.png",
        label: "Hồ sơ",
        href: "/profile", // Sẽ được cập nhật động sau
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
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Nếu có user, cập nhật link "Hồ sơ" để trỏ đến /student/[id]
  if (user) {
    menuItems[0].items = menuItems[0].items.map((item) =>
      item.label === "Hồ sơ" ? { ...item, href: `/student/${user.id}` } : item
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    router.push("/sign-in");
  };

  return (
    <div className="">
      {menuItems.map((group, index) => (
        <div key={index} className="flex flex-col gap-1">
          {group.items.map((item) => {
            return item.isLogout ? (
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
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Acount;
