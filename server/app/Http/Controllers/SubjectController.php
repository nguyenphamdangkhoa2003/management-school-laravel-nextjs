<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\SubjectRequest;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SubjectController extends Controller
{
    public function index()
    {
        try {
            $subjects = Subject::paginate(10);
            return SubjectResource::collection($subjects);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving subjects.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(SubjectRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $subject = Subject::create($validatedData);
            return response()->json($subject, 201);
        } catch (ValidationException $e) {
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
            ], Response::HTTP_INTERNAL_SERVER_ERROR); // HTTP status 500 cho lỗi server
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $subject = Subject::findOrFail($id);
            return response()->json($subject);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Subject not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the subject',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(SubjectRequest $request, string $id): JsonResponse
    {
        try {
            $subject = Subject::find($id);
    
            if (!$subject) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Subject not found.',
                    'error' => "No query results for model [App\\Models\\Subject] $id"
                ], Response::HTTP_NOT_FOUND);
            }
    
            $validatedData = $request->validated();
            $subject->update($validatedData);
    
            Log::info('Subject updated successfully', ['subject' => $subject]);
    
            return response()->json($subject, Response::HTTP_OK);
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
                'error' => 'An error occurred while updating the subject.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message' => 'Subject deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the subject',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $name = $request->query("name");
            $credit = $request->query("credit");
            $course_credit = $request->query("course_credit");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");
    
            // Khởi tạo truy vấn
            $query = Subject::query();
    
            // Nếu có tên, tìm kiếm theo tên
            if ($name) {
                $query->where("name", "like", "%" . $name . "%");
            }
    
            // Nếu có created_at, tìm kiếm theo created_at
            if ($created_at) {
                $query->orWhere("created_at", "like", "%" . $created_at . "%");
            }
    
            // Nếu có updated_at, tìm kiếm theo updated_at
            if ($updated_at) {
                $query->orWhere("updated_at", "like", "%" . $updated_at . "%");
            }
    
            // Nếu có teacher_id, tìm kiếm theo teacher_id
            if ($credit) {
                $query->orWhere("credit", "=", $credit);
            }
            if ($course_credit) {
                $query->orWhere("course_credit", "=", $course_credit);
            }
            // Thực hiện truy vấn và phân trang kết quả
            $subjects = $query->paginate(10);
            Log::info("Executing SQL: " . $query->toSql());
            // Kiểm tra kết quả và trả về phản hồi
            if (!$subjects->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Subjects retrieved successfully.',
                    'data' => $subjects,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No subjects found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for subjects.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
