<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use App\Services\CloudinaryService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UpdateTeacherRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TeacherController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teacher = Teacher::paginate(10);
        return TeacherResource::collection($teacher);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherRequest $request)
    {
        try {
            $validatedData = $request->validated();
            
            if ($request->hasFile('img')) {
                // Upload ảnh lên Cloudinary và lưu URL vào trường img
                $validatedData['img'] = $this->cloudinaryService->upload($request->file('img'), 'teachers');
            }

            $teacher = Teacher::create($validatedData);

            return response()->json($teacher, 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'An error occurred while creating the teacher.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            return response()->json([
                "status" => Response::HTTP_OK, // 200
                "data" => $teacher
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                "status" => Response::HTTP_NOT_FOUND, // 404
                "message" => "Teacher not found",
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                "status" => Response::HTTP_INTERNAL_SERVER_ERROR, // 500
                "message" => "An error occurred while retrieving the teacher",
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, string $id): JsonResponse
    {
        try {
            $teacher = Teacher::find($id);

            if (!$teacher) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Teacher not found.',
                    'error' => "No query results for model [App\\Models\\Teacher] $id"
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();

            if ($request->hasFile('img')) {
                // Xóa ảnh cũ từ Cloudinary nếu có và là URL Cloudinary
                if ($teacher->img && strpos($teacher->img, 'cloudinary.com') !== false) {
                    $this->cloudinaryService->deleteByUrl($teacher->img);
                }

                // Upload ảnh mới lên Cloudinary
                $validatedData['img'] = $this->cloudinaryService->upload($request->file('img'), 'teachers');
            }

            $teacher->update($validatedData);

            return response()->json($teacher, Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'An error occurred while updating the teacher.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            // Xóa ảnh từ Cloudinary nếu có và là URL Cloudinary
            if ($teacher->img && strpos($teacher->img, 'cloudinary.com') !== false) {
                $this->cloudinaryService->deleteByUrl($teacher->img);
            }

            $teacher->delete();

            return response()->json(['message' => 'Teacher deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Teacher not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'error' => 'An error occurred while deleting the teacher.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        $filterableFields = [
            'name',
            'username',
            'email',
            'phone',
            'surname',
            'address',
            'img',
            'bloodType',
            'birthday',
            'password',
            'sex',
            'created_at',
            'updated_at'
        ];

        $query = Teacher::query();
        $hasConditions = false;

        foreach ($filterableFields as $field) {
            if ($value = $request->query($field)) {
                $query->orWhere($field, 'like', "%{$value}%");
                $hasConditions = true;
            }
        }

        // Nếu không có điều kiện nào, trả về tất cả giáo viên
        if (!$hasConditions) {
            $teachers = Teacher::paginate(10);
        } else {
            $teachers = $query->paginate(10);
        }

        return response()->json([
            'status' => $teachers->isNotEmpty()
                ? Response::HTTP_OK
                : Response::HTTP_NOT_FOUND,
            'message' => $teachers->isNotEmpty()
                ? 'Teachers retrieved successfully.'
                : 'No teachers found.',
            'data' => $teachers->isNotEmpty() ? $teachers : null,
        ]);
    }

    public function update_password(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            $user = Teacher::findOrFail($id);

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => Response::HTTP_UNAUTHORIZED,
                    'message' => 'Current password is incorrect',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Cập nhật mật khẩu mới
            $user->setPasswordAttribute($request->new_password);
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Password updated successfully',
            ]);
        } catch (ModelNotFoundException $ex) {
            return response()->json([
                "status" => Response::HTTP_NOT_FOUND, // 404
                "message" => "Teacher not found",
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $ex) {
            return response()->json([
                "status" => Response::HTTP_INTERNAL_SERVER_ERROR,
                "message" => $ex->getMessage()
            ]);
        }
    }
}
