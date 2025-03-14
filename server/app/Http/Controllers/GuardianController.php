<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Http\Requests\GuardianRequest;
use App\Http\Resources\GuardResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuardianController extends Controller
{
    public function index()
    {
        try {
            $guardians = Guardian::paginate(10);
            return GuardResource::collection($guardians);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving guardians.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(GuardianRequest $request): JsonResponse
    {
        try {
            $guardian = Guardian::create($request->validated());
            return response()->json($guardian, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $guardian = Guardian::findOrFail($id);
            return response()->json($guardian);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Guardian not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(GuardianRequest $request, string $id): JsonResponse
    {
        try {
            $guardian = Guardian::find($id);
    
            if (!$guardian) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Guardian not found.',
                    'error' => "No query results for model [App\\Models\\Guardian] $id"
                ], Response::HTTP_NOT_FOUND);
            }
    
            $guardian->update($request->validated());
    
            return response()->json($guardian, Response::HTTP_OK);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $guardian = Guardian::findOrFail($id);
            $guardian->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số tìm kiếm từ request
            $name = $request->query('name');
            $username = $request->query('username');
            $email = $request->query('email');
            $phone = $request->query('phone');
            $address = $request->query('address');
            $job = $request->query('job');
            $sex = $request->query('sex');
    
            // Khởi tạo truy vấn
            $query = Guardian::query();
    
            // Thêm các điều kiện tìm kiếm vào truy vấn
            if ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            }
    
            if ($username) {
                $query->Orwhere('username', 'like', '%' . $username . '%');
            }
    
            if ($email) {
                $query->Orwhere('email', 'like', '%' . $email . '%');
            }
    
            if ($phone) {
                $query->Orwhere('phone', 'like', '%' . $phone . '%');
            }
    
            if ($address) {
                $query->Orwhere('address', 'like', '%' . $address . '%');
            }
    
            if ($job) {
                $query->Orwhere('job', 'like', '%' . $job . '%');
            }
    
            if ($sex) {
                $query->Orwhere('sex', $sex);
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $guardians = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$guardians->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Guardians retrieved successfully.',
                    'data' => $guardians,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No guardians found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for guardians.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
