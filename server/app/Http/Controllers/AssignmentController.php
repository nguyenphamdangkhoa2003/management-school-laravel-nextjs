<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignmentRequest;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AssignmentController extends Controller
{
    public function index()
    {
        try {
            $assignments = Assignment::paginate(10);
            return AssignmentResource::collection($assignments);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving assignments.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(AssignmentRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $assignment = Assignment::create($validatedData);
            return response()->json($assignment, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Thường xảy ra lỗi khi dữ liệu không hợp lệ, chẳng hạn như lỗi trùng dữ liệu
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating assignment.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            // Lỗi tổng quát khi tạo assignment
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the assignment.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id)
    {
        try {
            $assignment = Assignment::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $assignment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Assignment not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the assignment.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(AssignmentRequest $request, string $id)
    {
        try {
            $assignment = Assignment::findOrFail($id);
            $validatedData = $request->validated();
            $assignment->update($validatedData);
            return response()->json($assignment, 200);
        } catch (\Illuminate\Database\QueryException $e) {
            // Thường xảy ra lỗi khi dữ liệu không hợp lệ, chẳng hạn như lỗi trùng dữ liệu
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating assignment.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the assignment.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $assignment = Assignment::findOrFail($id);
            $assignment->delete();
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Assignment deleted successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the assignment.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số tìm kiếm từ request
            $title = $request->query("title");
            $startDate = $request->query("startDate");
            $dueDate = $request->query("dueDate");
            $lesson_id = $request->query("lesson_id");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");
    
            // Khởi tạo truy vấn
            $query = Assignment::query();
    
            // Dùng orWhere để tìm kiếm với các trường khác nhau
            if ($title) {
                $query->orWhere("title", "like", "%" . $title . "%");
            }
            if ($startDate) {
                $query->orWhere("startDate", "=", $startDate);
            }
            if ($dueDate) {
                $query->orWhere("dueDate", "=", $dueDate);
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
            $assignments = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$assignments->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Assignments retrieved successfully.',
                    'data' => $assignments,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No assignments found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for assignments.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
