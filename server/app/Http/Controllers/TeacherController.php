<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

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
    public function update(Request $request, string $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validatedData = $request->validated();

        if ($request->hasFile('img')) {
            if ($teacher->img && Storage::disk('public')->exists($teacher->img)) {
                Storage::disk('public')->delete($teacher->img);
            }

            $imagePath = $request->file('img')->store('images/teachers', 'public');
            $validatedData['img'] = $imagePath;
        }

        $teacher->update($validatedData);

        return response()->json($teacher, 200);
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

        $query = Teacher::query();

        if ($name) {
            $query->where("name", "like", "%" . $name . "%");
        }
        if ($username) {
            $query->where("username", "like", "%" . $username . "%");
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
