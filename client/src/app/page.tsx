"use client";
import React, { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/services/api";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    if (id) {
      if (role === "admin")
        router.push("/admin");
      else if (role === "student")
        router.push("/student");
      else
        router.push("/teacher");

    }

  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập!");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.guard);
      localStorage.setItem("user", JSON.stringify(data.user));

      const rolePaths = {
        admin: "/admin",
        student: "/student",
        teacher: "/teacher",
        parent: "/parent",
      };

      router.push(rolePaths[data.guard as keyof typeof rolePaths] || "/");

    } catch (error) {
      setError("Tên tài khoản hoặc mật khẩu không đúng.");
      setTimeout(() => setError(""), 5000);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex bg-gray-200">
      <div className="flex-1">
        <img src="/banner.jpg" className="w-full h-screen object-cover" alt="Banner" />
      </div>
      <div className="w-[500px] p-8 flex flex-col justify-center shadow-lg bg-white">
        <div className="text-center mb-6">
          <img src="/logostu.png" alt="Logo" className="max-h-52 mx-auto" />
          <h2 className="text-xl font-semibold text-[#2E3192]">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ SÀI GÒN</h2>
          <h3 className="text-lg text-[#172B4D]">CỔNG THÔNG TIN ĐÀO TẠO</h3>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#2E3192] mb-5">ĐĂNG NHẬP</h2>
          {error && <p className="text-red-600 bg-red-100 border border-red-400 text-center mb-4 px-3 py-2 rounded-md">{error}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <FormInput
              icon={<User className="absolute left-4 top-3 text-gray-500" />}
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
            <FormInput
              icon={<Lock className="absolute left-4 top-3 text-gray-500" />}
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            <button
              type="submit"
              className="h-11 w-full text-lg text-white bg-[#2E3192] hover:bg-[#1D1F6F] rounded-md transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ icon, type, placeholder, value, onChange, rightIcon }: any) => (
  <div className="relative">
    {icon}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-12 text-lg px-12 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 mb-4"
      autoComplete="off"
    />
    {rightIcon}
  </div>
);

export default SigninPage;
