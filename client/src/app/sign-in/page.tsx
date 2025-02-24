"use client";
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from "lucide-react";

const SigninPage = () => {
    const [showPassword, setShowPassword] = useState(false);

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

                    <form className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-3 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="h-12 text-lg px-12 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 mb-6"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                className="h-12 text-lg px-12 pr-12 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 mb-6"
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
                            className="h-12 w-full text-lg text-white bg-[#2E3192] hover:bg-[#1D1F6F] rounded-md transition-colors"
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
