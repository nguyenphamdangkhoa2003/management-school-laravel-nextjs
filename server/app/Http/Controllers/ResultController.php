<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResultRequest;
use App\Http\Resources\ResultResource;
use App\Models\Result;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class ResultController extends Controller
{
    public function index()
    {
        try {
            $results = Result::with('students','subjects')->paginate(10);
            return ResultResource::collection($results);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving results.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(ResultRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $result = Result::create($validatedData);
            return response()->json($result, 201);
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

    public function show(string $id)
    {
        try {
            $result = Result::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $result
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Result not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the result',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(ResultRequest $request, string $id): JsonResponse
    {
        try {
            $result = Result::find($id);
    
            if (!$result) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Result not found.',
                    'error' => "No query results for model [App\\Models\\Result] $id"
                ], Response::HTTP_NOT_FOUND);
            }
    
            $validatedData = $request->validated();
            $result->update($validatedData);
    
            return response()->json($result, Response::HTTP_OK);
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
                'error' => 'An error occurred while updating the result.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id)
    {
        try {
            $result = Result::findOrFail($id);
            $result->delete();
            return response()->json(['message' => 'Result deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the result',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $student_id = $request->query('student_id');
            $process_score = $request->query('process_score');
            $semi_score = $request->query('semi_score');
            $final_score = $request->query('final_score');
            $subject_id = $request->query('subject_id');
            $created_at = $request->query('created_at');
            $updated_at = $request->query('updated_at');
    
            // Khởi tạo truy vấn
            $query = Result::query();
    
            // Điều kiện tìm kiếm cho các tham số
            if ($student_id) {
                $query->where('student_id', '=', $student_id);
            }
    
            if ($process_score) {
                $query->orWhere('process_score', '=', $process_score);
            }
    
            if ($semi_score) {
                $query->orWhere('semi_score', '=', $semi_score);
            }
    
            if ($final_score) {
                $query->orWhere('final_score', '=', $final_score);
            }
            if ($subject_id) {
                $query->orWhere('subject_id', '=', $subject_id);
            }
            if ($created_at) {
                $query->orWhere('created_at', 'like', '%' . $created_at . '%');
            }
    
            if ($updated_at) {
                $query->orWhere('updated_at', 'like', '%' . $updated_at . '%');
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $results = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$results->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Results retrieved successfully.',
                    'data' => $results,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No results found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for results.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
