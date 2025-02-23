"use client";

import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
    {
        items: [
            {
                icon: "/profile.png",
                label: "Hồ sơ",
                href: "/profile",
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
            },
        ],
    },

];

const Acount = () => {
    return (
        <div className=''>
            {menuItems.map((i) => (
                <div className="flex flex-col gap-1">

                    {i.items.map((item) => {

                        return (
                            <Link
                                href={item.href}
                                key={item.label}
                                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                            >
                                <Image src={item.icon} alt="" width={20} height={20} />
                                <span className="hidden lg:block">{item.label}</span>
                            </Link>
                        );

                    })}
                </div>
            ))}
        </div>
    )
}

export default Acount