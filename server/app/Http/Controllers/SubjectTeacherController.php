<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubjectTeacherRequest;
use App\Http\Requests\UpdateSubjectTeacherRequest;
use App\Http\Resources\SubjectTeacherResource;
use App\Models\SubjectTeacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class SubjectTeacherController extends Controller
{
    public function index()
    {
        // Eager load mối quan hệ 'teacher', 'subject' và phân trang dữ liệu
        $subjectTeachers = SubjectTeacher::with('teacher', 'subject')->paginate(10);
        
        // Trả về resource collection đã được phân trang
        return SubjectTeacherResource::collection($subjectTeachers);
    }
    
    
    public function store(SubjectTeacherRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $subjectTeacher = SubjectTeacher::create($validatedData);
            return response()->json($subjectTeacher, 201);
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
            $subjectTeacher = SubjectTeacher::with('teacher', 'subject')->findOrFail($id);
            return response()->json($subjectTeacher);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Subject-Teacher relationship not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the subject-teacher relationship',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(UpdateSubjectTeacherRequest $request, string $id): JsonResponse
    {
        try {
            $subjectTeacher = SubjectTeacher::find($id);

            if (!$subjectTeacher) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Subject-Teacher relationship not found.',
                    'error' => "No query results for model [App\\Models\\SubjectTeacher] $id"
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();
            $subjectTeacher->update($validatedData);

            return response()->json($subjectTeacher, Response::HTTP_OK);
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
                'error' => 'An error occurred while updating the subject-teacher relationship.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $subjectTeacher = SubjectTeacher::findOrFail($id);
            $subjectTeacher->delete();
            return response()->json(['message' => 'Subject-Teacher relationship deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the subject-teacher relationship',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $teacher_id = $request->query("teacher_id");
            $subject_id = $request->query("subject_id");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");
    
            // Khởi tạo truy vấn
            $query = SubjectTeacher::query();
    
            // Điều kiện tìm kiếm theo các tham số được truyền vào
            if ($teacher_id) {
                $query->where("teacher_id", "=", $teacher_id);
            }
    
            if ($subject_id) {
                $query->where("subject_id", "=", $subject_id);
            }
    
            if ($created_at) {
                $query->where("created_at", "like", "%" . $created_at . "%");
            }
    
            if ($updated_at) {
                $query->where("updated_at", "like", "%" . $updated_at . "%");
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $subjectTeachers = $query->with('teacher', 'subject')->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$subjectTeachers->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Subject-Teacher relationships retrieved successfully.',
                    'data' => $subjectTeachers,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No Subject-Teacher relationships found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for Subject-Teacher relationships.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get subjects for a specific teacher.
     */
    public function getTeacherSubjects($teacherId)
    {
        try {
            $subjectTeachers = SubjectTeacher::with('subject')
                ->where('teacher_id', $teacherId)
                ->paginate(10);
                
            return SubjectTeacherResource::collection($subjectTeachers);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving teacher subjects',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get teachers for a specific subject.
     */
    public function getSubjectTeachers($subjectId)
    {
        try {
            $subjectTeachers = SubjectTeacher::with('teacher')
                ->where('subject_id', $subjectId)
                ->paginate(10);
                
            return SubjectTeacherResource::collection($subjectTeachers);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving subject teachers',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
