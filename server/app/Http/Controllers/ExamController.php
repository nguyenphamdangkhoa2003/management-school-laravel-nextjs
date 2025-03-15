<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExamController extends Controller
{
    public function index()
    {
        try {
            $exams = Exam::paginate(10);
            return ExamResource::collection($exams);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving exams.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(ExamRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $exam = Exam::create($validatedData);
            return response()->json($exam, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi cơ sở dữ liệu khi tạo bài thi
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating the exam.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            // Lỗi tổng quát khi tạo bài thi
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the exam.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id)
    {
        try {
            $exam = Exam::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $exam,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Exam not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the exam.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(ExamRequest $request, string $id)
    {
        try {
            $exam = Exam::findOrFail($id);
            $validatedData = $request->validated();
            $exam->update($validatedData);
            return response()->json($exam, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Exam not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi cơ sở dữ liệu khi cập nhật bài thi
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating the exam.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the exam.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $exam = Exam::findOrFail($id);
            $exam->delete();
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Exam deleted successfully.',
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Exam not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the exam.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số tìm kiếm từ request
            $title = $request->query("title");
            $startTime = $request->query("startTime");
            $endTime = $request->query("endTime");
            $lesson_id = $request->query("lesson_id");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");

            // Khởi tạo truy vấn
            $query = Exam::query();

            // Sử dụng orWhere để tìm kiếm với các trường khác nhau
            if ($title) {
                $query->orWhere("title", "like", "%" . $title . "%");
            }
            if ($startTime) {
                $query->orWhere("startTime", "=", $startTime);
            }
            if ($endTime) {
                $query->orWhere("endTime", "=", $endTime);
            }
            if ($lesson_id) {
                $query->orWhere("lesson_id", "=", $lesson_id);
            }
            if ($created_at) {
                $query->orWhere("created_at", "=", $created_at);
            }
            if ($updated_at) {
                $query->orWhere("updated_at", "=", $updated_at);
            }

            // Thực hiện truy vấn và phân trang kết quả
            $events = $query->paginate(10);

            // Kiểm tra kết quả và trả về phản hồi
            if (!$events->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Events retrieved successfully.',
                    'data' => $events,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No events found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for events.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


}
