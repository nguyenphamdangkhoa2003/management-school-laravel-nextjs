<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\Admin;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\Teacher;
use Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $request->validated();

        $username = $request->username;
        $password = $request->password;

        // Kiểm tra trong từng bảng
        $user = null;
        $guard = null;

        if ($user = Student::where('username', $username)->first()) {
            $guard = 'student';
        } elseif ($user = Guardian::where('username', $username)->first()) {
            $guard = 'parent';
        } elseif ($user = Teacher::where('username', $username)->first()) {
            $guard = 'teacher';
        } elseif ($user = Admin::where('username', $username)->first()) {
            $guard = 'admin';
        }

        // Kiểm tra mật khẩu
        if ($user && Hash::check($password, $user->password)) {
            // Tạo token và trả về thông tin người dùng
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'guard' => $guard,
                'token' => $token,
            ], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
