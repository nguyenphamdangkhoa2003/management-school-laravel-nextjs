<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StudentRequest;
use App\Http\Resources\StudentResource;
use App\Services\CloudinaryService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class StudentController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $students = Student::with('schoolClass', 'guardians', 'grades')->paginate(10);
        return StudentResource::collection($students);
    }

    public function store(StudentRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            if ($request->hasFile('img')) {
                // Upload ảnh lên Cloudinary và lưu URL vào trường img
                $validatedData['img'] = $this->cloudinaryService->upload($request->file('img'), 'students');
            }

            $student = Student::create($validatedData);
            return response()->json($student, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
                'data' => $request->all(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
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
            $student = Student::find($id);

            if (!$student) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Student not found.',
                    'error' => "No query results for model [App\\Models\\Student] $id"
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();

            if ($request->hasFile('img')) {
                // Xóa ảnh cũ từ Cloudinary nếu có và là URL Cloudinary
                if ($student->img && strpos($student->img, 'cloudinary.com') !== false) {
                    $this->cloudinaryService->deleteByUrl($student->img);
                }

                // Upload ảnh mới lên Cloudinary
                $validatedData['img'] = $this->cloudinaryService->upload($request->file('img'), 'students');
            }

            $student->update($validatedData);

            return response()->json($student, Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'An error occurred while updating the student.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $student = Student::findOrFail($id);

            // Xóa ảnh từ Cloudinary nếu có và là URL Cloudinary
            if ($student->img && strpos($student->img, 'cloudinary.com') !== false) {
                $this->cloudinaryService->deleteByUrl($student->img);
            }
            $student->delete();
            return response()->json(['message' => 'Student deleted successfully'], 200);
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

    public function update_password(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
                'new_password_confirmation' => 'required|string|same:new_password',
            ]);

            $student = Student::findOrFail($id);

            if (!Hash::check($request->current_password, $student->password)) {
                return response()->json([
                    'status' => Response::HTTP_UNAUTHORIZED,
                    'message' => 'Current password is incorrect',
                ], Response::HTTP_UNAUTHORIZED);
            }

            $student->password = Hash::make($request->new_password);
            $student->save();

            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Student password updated successfully',
                'data' => [
                    'student_id' => $student->id,
                    'updated_at' => $student->updated_at
                ]
            ]);

        } catch (ModelNotFoundException $ex) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Student not found',
                'error' => $ex->getMessage()
            ], Response::HTTP_NOT_FOUND);

        } catch (ValidationException $ex) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => 'Validation failed',
                'errors' => $ex->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (Exception $ex) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Failed to update password',
                'error' => $ex->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

  
