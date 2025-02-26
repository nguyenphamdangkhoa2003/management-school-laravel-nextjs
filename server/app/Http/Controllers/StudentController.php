<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StudentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $students = Student::all();
            return response()->json($students);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving students.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(StudentRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            if ($request->hasFile('img')) {
                $imagePath = $request->file('img')->store('images/students', 'public');
                $validatedData['img'] = $imagePath;
            }

            $student = Student::create($validatedData);
            return response()->json($student, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // HTTP status 422 cho lỗi validation
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
                'data' => $request->all(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR); // HTTP status 500 cho lỗi server
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);
            return response()->json($student);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Student not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the student',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(StudentRequest $request, string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);
            $validatedData = $request->validated();

            if ($request->hasFile('img')) {
                if ($student->img && Storage::disk('public')->exists($student->img)) {
                    Storage::disk('public')->delete($student->img);
                }
                $imagePath = $request->file('img')->store('images/students', 'public');
                $validatedData['img'] = $imagePath;
            }

            $student->update($validatedData);
            return response()->json($student, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // HTTP status 422 cho lỗi validation
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'An error occurred while updating the student',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);

            if ($student->img && Storage::disk('public')->exists($student->img)) {
                Storage::disk('public')->delete($student->img);
            }

            $student->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the student',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $name = $request->query("name");
            $username = $request->query("username");
            $code = $request->query("code");
            $surname = $request->query("surname");
            $email = $request->query("email");
            $phone = $request->query("phone");
            $address = $request->query("address");
            $img = $request->query("img");
            $sex = $request->query("sex");
            $bloodType = $request->query("bloodType");
            $birthday = $request->query("birthday");
            $password = $request->query("password");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");
            $guardian_id = $request->query("guardian_id");
            $school_class_id = $request->query("school_class_id");
            $grade_id = $request->query("grade_id");
    
            // Khởi tạo truy vấn
            $query = Student::query();
    
            // Điều kiện tìm kiếm theo các tham số được truyền vào
            if ($name) {
                $query->where("name", "like", "%" . $name . "%");
            }
    
            if ($username) {
                $query->orWhere("username", "like", "%" . $username . "%");
            }
    
            if ($code) {
                $query->orWhere("code", "like", "%" . $code . "%");
            }
    
            if ($surname) {
                $query->orWhere("surname", "like", "%" . $surname . "%");
            }
    
            if ($email) {
                $query->orWhere("email", "like", "%" . $email . "%");
            }
    
            if ($phone) {
                $query->orWhere("phone", "like", "%" . $phone . "%");
            }
    
            if ($address) {
                $query->orWhere("address", "like", "%" . $address . "%");
            }
    
            if ($img) {
                $query->orWhere("img", "like", "%" . $img . "%");
            }
    
            if ($sex) {
                $query->orWhere("sex", "like", "%" . $sex . "%");
            }
    
            if ($bloodType) {
                $query->orWhere("bloodType", "like", "%" . $bloodType . "%");
            }
    
            if ($birthday) {
                $query->orWhere("birthday", "like", "%" . $birthday . "%");
            }
    
            if ($password) {
                $query->orWhere("password", "like", "%" . $password . "%");
            }
    
            if ($created_at) {
                $query->orWhere("created_at", "like", "%" . $created_at . "%");
            }
    
            if ($updated_at) {
                $query->orWhere("updated_at", "like", "%" . $updated_at . "%");
            }
    
            if ($guardian_id) {
                $query->orWhere("guardian_id", "=", $guardian_id);
            }
    
            if ($school_class_id) {
                $query->orWhere("school_class_id", "=", $school_class_id);
            }
    
            if ($grade_id) {
                $query->orWhere("grade_id", "=", $grade_id);
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $students = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$students->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Students retrieved successfully.',
                    'data' => $students,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No students found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for students.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
