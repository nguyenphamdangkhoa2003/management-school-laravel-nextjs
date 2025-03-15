<?php

namespace App\Http\Controllers;

use App\Http\Requests\PersonalAccessTokenRequest;
use App\Http\Resources\PersonalAccessTokenResource;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;
class PersonalAccessTokenController extends Controller
{
    public function index()
    {
        $tokens = PersonalAccessToken::paginate(10);
        return PersonalAccessTokenResource::collection($tokens);
    }

    public function store(PersonalAccessTokenRequest $request)
    {
        $validatedData = $request->validated();
        $token = PersonalAccessToken::create($validatedData);
        return response()->json($token, 201);
    }

    public function show(string $id)
    {
        try {
            $token = PersonalAccessToken::findOrFail($id);
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_OK,
                "data" => $token
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
                "message" => "Token not found",
            ], \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR,
                "message" => "An error occurred while retrieving the token",
            ], \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(PersonalAccessTokenRequest $request, string $id)
    {
        try {
            $token = PersonalAccessToken::find($id);
    
            if (!$token) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Personal Access Token not found.',
                    'error' => "No query results for model [App\\Models\\PersonalAccessToken] $id"
                ], Response::HTTP_NOT_FOUND);
            }
    
            $validatedData = $request->validated();
            $token->update($validatedData);
    
            return response()->json($token, Response::HTTP_OK);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating the token.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the token.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        $token = PersonalAccessToken::findOrFail($id);
        $token->delete();
        return response()->json(['message' => 'Token deleted successfully'], 200);
    }

    public function search(Request $request)
    {
        try {
            // Lấy các tham số từ request
            $name = $request->query('name');
            $tokenable_type = $request->query('tokenable_type');
            $tokenable_id = $request->query('tokenable_id');
            $token = $request->query('token');
            $abilities = $request->query('abilities');
            $last_used_at = $request->query('last_used_at');
            $expires_at = $request->query('expires_at');
            $created_at = $request->query('created_at');
            $updated_at = $request->query('updated_at');
    
            // Khởi tạo truy vấn
            $query = PersonalAccessToken::query();
    
            // Điều kiện tìm kiếm cho các tham số
            if ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            }
    
            if ($tokenable_type) {
                $query->where('tokenable_type', $tokenable_type);
            }
    
            if ($tokenable_id) {
                $query->orWhere('tokenable_id', '=', $tokenable_id);
            }
    
            if ($token) {
                $query->orWhere('token', 'like', '%' . $token . '%');
            }
    
            if ($abilities) {
                $query->orWhere('abilities', 'like', '%' . $abilities . '%');
            }
    
            if ($last_used_at) {
                $query->orWhere('last_used_at', 'like', '%' . $last_used_at . '%');
            }
    
            if ($expires_at) {
                $query->orWhere('expires_at', 'like', '%' . $expires_at . '%');
            }
    
            if ($created_at) {
                $query->orWhere('created_at', 'like', '%' . $created_at . '%');
            }
    
            if ($updated_at) {
                $query->orWhere('updated_at', 'like', '%' . $updated_at . '%');
            }
    
            // Thực hiện truy vấn và phân trang kết quả
            $tokens = $query->paginate(10);
    
            // Kiểm tra kết quả và trả về phản hồi
            if (!$tokens->isEmpty()) {
                return response()->json([
                    "status" => \Symfony\Component\HttpFoundation\Response::HTTP_OK,
                    'message' => 'Tokens retrieved successfully.',
                    'data' => $tokens,
                ]);
            } else {
                return response()->json([
                    "status" => \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
                    'message' => 'No tokens found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for tokens.',
                'error' => $e->getMessage(),
            ], \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}
