<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTeacherRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TeacherController extends Controller
{
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
        $validatedData = $request->validated();
        if ($request->hasFile('img')) {
            $imagePath = $request->file('img')->store('images/teachers', 'public');
            $validatedData['img'] = $imagePath;
        }

        $teacher = Teacher::create($validatedData);

        return response()->json($teacher, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_OK, // 200
                "data" => $teacher
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND, // 404
                "message" => "Teacher not found",
            ], \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR, // 500
                "message" => "An error occurred while retrieving the teacher",
            ], \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR);
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
                // Xóa ảnh cũ nếu tồn tại
                if ($teacher->img && Storage::disk('public')->exists($teacher->img)) {
                    Storage::disk('public')->delete($teacher->img);
                }

                // Lưu ảnh mới
                $imagePath = $request->file('img')->store('images/teachers', 'public');
                $validatedData['img'] = $imagePath;
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
        } catch (\Exception $e) {
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
        $teacher = Teacher::findOrFail($id);

        if ($teacher->img && Storage::disk('public')->exists($teacher->img)) {
            Storage::disk('public')->delete($teacher->img);
        }

        $teacher->delete();

        return response()->json(['message' => 'Teacher deleted successfully'], 200);
    }

    public function search(Request $request)
    {
        $name = $request->query("name");
        $username = $request->query("username");
        $email = $request->query("email");
        $phone = $request->query("phone");
        $surname = $request->query("surname");
        $address = $request->query("address");
        $img = $request->query("img");
        $bloodType = $request->query("bloodType");
        $birthday = $request->query("birthday");
        $password = $request->query("password");
        $sex = $request->query("sex");
        $created_at = $request->query("created_at");
        $updated_at = $request->query("updated_at");

        $query = Teacher::query();

        if ($name) {
            $query->where("name", "like", "%" . $name . "%");
        }

        if ($username) {
            $query->orWhere("username", "like", "%" . $username . "%");
        }

        if ($email) {
            $query->orWhere("email", "like", "%" . $email . "%");
        }

        if ($phone) {
            $query->orWhere("phone", "like", "%" . $phone . "%");
        }

        if ($surname) {
            $query->orWhere("surname", "like", "%" . $surname . "%");
        }

        if ($address) {
            $query->orWhere("address", "like", "%" . $address . "%");
        }

        if ($img) {
            $query->orWhere("img", "like", "%" . $img . "%");
        }

        if ($bloodType) {
            $query->orWhere("bloodType", "like", "%" . $bloodType . "%");
        }

        if ($birthday) {
            $query->orWhere("birthday", "like", "%" . $birthday . "%");
        }

        if ($password) {
            $query->orWhere("password", "like", "%" . $password . "%");
        }

        if ($sex) {
            $query->orWhere("sex", "like", "%" . $sex . "%");
        }

        if ($created_at) {
            $query->orWhere("created_at", "like", "%" . $created_at . "%");
        }

        if ($updated_at) {
            $query->orWhere("updated_at", "like", "%" . $updated_at . "%");
        }

        $teachers = $query->paginate(10);

        if (!$teachers->isEmpty()) {
            return response()->json(
                [
                    "status" => \Symfony\Component\HttpFoundation\Response::HTTP_OK,
                    'message' => 'Teachers retrieved successfully.',
                    "data" => $teachers,
                ]
            );
        } else {
            return response()->json(
                [
                    "status" => \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
                    'message' => 'No teachers found.',
                ]
            );
        }
    }
}
