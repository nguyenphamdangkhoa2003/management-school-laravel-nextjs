<?php

namespace App\Http\Controllers;

use App\Http\Requests\LessonRequest;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class LessonController extends Controller
{
    public function index()
    {
        try {
            $lessons = Lesson::paginate(10);
            return LessonResource::collection($lessons);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving lessons.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(LessonRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $lesson = Lesson::create($validatedData);
            return response()->json($lesson, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),  // Đây sẽ là mảng lỗi chi tiết theo các trường không hợp lệ
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

    public function show(string $id)
    {
        try {
            $lesson = Lesson::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $lesson
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Lesson not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the lesson',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(LessonRequest $request, string $id)
    {
        try {
            $lesson = Lesson::findOrFail($id);
            $validatedData = $request->validated();
            $lesson->update($validatedData);
            return response()->json($lesson, 200);
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
                'error' => 'An error occurred while updating the lesson',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id)
    {
        try {
            $lesson = Lesson::findOrFail($id);
            $lesson->delete();
            return response()->json(['message' => 'Lesson deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the lesson',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $name = $request->query('name');
            $day = $request->query('day');
            $startTime = $request->query('startTime');
            $endTime = $request->query('endTime');
            $subject_id = $request->query('subject_id');
            $teacher_id = $request->query('teacher_id');
            $school_class_id = $request->query('school_class_id');
    
            // Khởi tạo truy vấn
            $query = Lesson::query();
    
            // Điều kiện tìm kiếm cho các tham số
            if ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            }
    
            if ($day) {
                $query->Orwhere('day', $day);
            }
    
            if ($startTime) {
                $query->Orwhere('startTime', '>=', $startTime);
            }
    
            if ($endTime) {
                $query->Orwhere('endTime', '<=', $endTime);
            }
    
            if ($subject_id) {
                $query->Orwhere('subject_id', $subject_id);
            }
    
            if ($teacher_id) {
                $query->Orwhere('teacher_id', $teacher_id);
            }
    
            if ($school_class_id) {
                $query->Orwhere('school_class_id', $school_class_id);
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $lessons = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$lessons->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Lessons retrieved successfully.',
                    'data' => $lessons,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No lessons found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for lessons.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
