"use client";
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/services/api";
import { useRouter } from 'next/navigation';

const SigninPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin đăng nhập!");
            setTimeout(() => setError(""), 5000);
            return;
        }
        try {
            const data = await login(username, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.guard);
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.guard == "admin") {
                router.push("/admin");
            } else if (data.guard == "student") {
                router.push("/student");
            } else if (data.guard == "teacher") {
                router.push("/teacher");
            } else if (data.guard == "parent") {
                router.push("/parent");
            }
        } catch (error) {
            setError("Sai tài khoản hoặc mật khẩu!");
            setTimeout(() => setError(""), 5000);
        }
    }
    return (
        <div className="w-full h-screen flex bg-gray-200 overflow-hidden">
            <div className='flex-1'>
                <img src="/banner.jpg" className="w-full h-screen object-cover" alt="Banner" />
            </div>
            <div className="w-[500px] p-8 flex flex-col justify-center shadow-lg">

                <div className="text-center mb-6">
                    <img src="/logostu.png" alt="Logo" className="max-h-52 mx-auto" />
                    <h2 className="text-xl font-semibold text-[#2E3192]">
                        TRƯỜNG ĐẠI HỌC CÔNG NGHỆ SÀI GÒN
                    </h2>
                    <h3 className="text-lg text-[#172B4D]">CỔNG THÔNG TIN ĐÀO TẠO</h3>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-[#2E3192] mb-5">ĐĂNG NHẬP</h2>
                    {error && (
                        <p className="text-red-600 bg-red-100 border border-red-400 text-center mb-4 px-3 py-2 rounded-md">
                            {error}
                        </p>
                    )}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="relative">
                            <User className="absolute left-4 top-3 text-gray-500" />
                            <input
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập"
                                className="h-12 text-lg px-12 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}

                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                className="h-12 text-lg px-12 pr-12 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 mb-5"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3 text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="h-11 w-full text-lg text-white bg-[#2E3192] hover:bg-[#1D1F6F] rounded-md transition-colors"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
