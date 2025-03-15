<?php

namespace App\Http\Controllers;

use App\Http\Requests\SchoolClassRequest;
use App\Http\Resources\SchoolClassResource;
use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class SchoolClassController extends Controller
{
    public function index()
    {
        try {
            $schoolClasses = SchoolClass::paginate(10);
            return SchoolClassResource::collection($schoolClasses);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving school classes.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(SchoolClassRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $schoolClass = SchoolClass::create($validatedData);
            return response()->json($schoolClass, 201);
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
            $schoolClass = SchoolClass::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $schoolClass
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'School Class not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the school class',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(SchoolClassRequest $request, string $id): JsonResponse
    {
        try {
            $schoolClass = SchoolClass::find($id);
    
            if (!$schoolClass) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'School class not found.',
                    'error' => "No query results for model [App\\Models\\SchoolClass] $id"
                ], Response::HTTP_NOT_FOUND);
            }
    
            $validatedData = $request->validated();
            $schoolClass->update($validatedData);
    
            return response()->json($schoolClass, Response::HTTP_OK);
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
                'error' => 'An error occurred while updating the school class.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id)
    {
        try {
            $schoolClass = SchoolClass::findOrFail($id);
            $schoolClass->delete();
            return response()->json(['message' => 'School Class deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the school class',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $name = $request->query('name');
            $capacity = $request->query('capacity');
            $supervisor_id = $request->query('supervisor_id');
            $created_at = $request->query('created_at');
            $updated_at = $request->query('updated_at');
            $grade_id = $request->query('grade_id');
    
            // Khởi tạo truy vấn
            $query = SchoolClass::query();
    
            // Điều kiện tìm kiếm cho các tham số
            if ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            }
    
            if ($capacity) {
                $query->orWhere('capacity', '=', $capacity);
            }
    
            if ($supervisor_id) {
                $query->orWhere('supervisor_id', '=', $supervisor_id);
            }
    
            if ($created_at) {
                $query->orWhere('created_at', 'like', '%' . $created_at . '%');
            }
    
            if ($updated_at) {
                $query->orWhere('updated_at', 'like', '%' . $updated_at . '%');
            }
    
            if ($grade_id) {
                $query->orWhere('grade_id', '=', $grade_id);
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $schoolClasses = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$schoolClasses->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'School Classes retrieved successfully.',
                    'data' => $schoolClasses,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No school classes found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for school classes.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
