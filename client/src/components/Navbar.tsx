"use client"

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Acount from "./Acount";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const guard = localStorage.getItem("role");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(
    user?.img ? `${user.img}` : "/avatar.png"
  );
  useEffect(() => {
    if (guard === "admin") {
      setRole("Quản trị viên");
    } else if (guard === "teacher") {
      setRole("Giảng viên");
    } else if (guard === "student") {
      setRole("Sinh viên");
    } else if (guard === "parent") {
      setRole("Phụ huynh")
    }
  }, [guard]);

  // Đóng menu khi click bên ngoài
  useEffect(() => {


    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{user.name ? user.surname + " " + user.name : user.username}</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>

        {/* AVATAR & MENU */}
        <div className="relative" ref={menuRef}>
          <Image
            src={avatar}
            alt=""
            width={36}
            height={36}
            className="rounded-full cursor-pointer object-cover w-[45px] h-[45px]"
            onClick={() => setMenuOpen((prev) => !prev)}
            onError={() => setAvatar("/avatar.png")}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-max bg-white shadow-lg rounded-lg  p-4 z-10 border border-gray-200">
              <Acount />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
