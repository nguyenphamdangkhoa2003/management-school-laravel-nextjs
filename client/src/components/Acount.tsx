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
                isLogout: true, // Thêm thuộc tính để nhận diện nút logout
            },
        ],
    },
];

const Acount = () => {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("user"); 
        localStorage.removeItem("role"); 
        localStorage.removeItem("token"); 
        router.push("/sign-in"); 
    };

    return (
        <div className=''>
            {menuItems.map((i, index) => (
                <div key={index} className="flex flex-col gap-1">
                    {i.items.map((item) => {
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
