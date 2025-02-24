<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AttendanceController extends Controller
{
    public function index()
    {
        try {
            $attendances = Attendance::paginate(10);
            return AttendanceResource::collection($attendances);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving attendances.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(AttendanceRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $attendance = Attendance::create($validatedData);
            return response()->json($attendance, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi cơ sở dữ liệu khi tạo Attendance
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating attendance.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            // Lỗi tổng quát khi tạo Attendance
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the attendance.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id)
    {
        try {
            $attendance = Attendance::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $attendance,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Attendance not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the attendance.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(AttendanceRequest $request, string $id)
    {
        try {
            $attendance = Attendance::findOrFail($id);
            $validatedData = $request->validated();
            $attendance->update($validatedData);
            return response()->json($attendance, 200);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi cơ sở dữ liệu khi cập nhật Attendance
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating attendance.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the attendance.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $attendance = Attendance::findOrFail($id);
            $attendance->delete();
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Attendance deleted successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the attendance.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            $student_id = $request->query("student_id");
            $date = $request->query("date");
            $present = $request->query("present");
            $query = Attendance::query();

            if ($student_id) {
                $query->where("student_id", $student_id);
            }
            if ($date) {
                $query->whereDate("date", $date);
            }
            if ($present !== null) {
                $query->where("present", $present);
            }

            $attendances = $query->paginate(10);

            if (!$attendances->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Attendances retrieved successfully.',
                    'data' => $attendances,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No attendances found.',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for attendances.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
