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
            $attendances = Attendance::with('students', 'lessons','lessons.subject_teacher','lessons.rooms','lessons.subject_teacher.teacher','lessons.subject_teacher.subject')->paginate(10);
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
            $attendance = Attendance::with([
                'students',
                'lessons',
                'lessons.subject_teacher',
                'lessons.rooms',
                'lessons.subject_teacher.teacher',
                'lessons.subject_teacher.subject'
            ])->findOrFail($id);
        
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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Attendance not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
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
            // Lấy các tham số tìm kiếm từ request
            $student_id = $request->query("student_id");
            $date = $request->query("date");
            $present = $request->query("present");
            $lesson_id = $request->query("lesson_id");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");

            // Khởi tạo truy vấn
            $query = Attendance::query();

            // Dùng orWhere để tìm kiếm với các trường khác nhau
            if ($student_id) {
                $query->orWhere("student_id", "=", $student_id);
            }
            if ($date) {
                $query->orWhereDate("date", "=", $date);
            }
            if ($present !== null) {
                $query->orWhere("present", "=", $present);
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
  // Khởi tạo query với eager loading các mối quan hệ
  $query = Attendance::with([
    'students',
    'lessons',
    'lessons.subject_teacher',
    'lessons.rooms',
    'lessons.subject_teacher.teacher',
    'lessons.subject_teacher.subject'
]);

// Thực hiện truy vấn và phân trang kết quả
$attendances = $query->paginate(10);

            // Kiểm tra kết quả và trả về phản hồi
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
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for attendances.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
public function getLessonAttendances($lessonId)
{
    try {
        $attendances = Attendance::with('students', 'lessons','lessons.subject_teacher','lessons.rooms','lessons.subject_teacher.teacher','lessons.subject_teacher.subject')
         ->whereHas('lessons', function($query) use ($lessonId) {
                // Tìm kiếm theo teacher_id hoặc name của teacher
                $query->where('id', $lessonId);       })    
            ->paginate(10);
            
        return AttendanceResource::collection($attendances);
    } catch (\Exception $e) {
        return response()->json([
            'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
            'message' => 'An error occurred while retrieving lesson attendances',
            'error' => $e->getMessage(),
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

public function getStudentAttendances($studentId)
{
    try {
        $attendances =  Attendance::with('students', 'lessons','lessons.subject_teacher','lessons.rooms','lessons.subject_teacher.teacher','lessons.subject_teacher.subject')
        ->whereHas('students', function($query) use ($studentId) {
               // Tìm kiếm theo teacher_id hoặc name của teacher
               $query->where('id', $studentId);       
            })    
           ->paginate(10);
            
        return AttendanceResource::collection($attendances);
    } catch (\Exception $e) {
        return response()->json([
            'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
            'message' => 'An error occurred while retrieving student attendances',
            'error' => $e->getMessage(),
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

}
