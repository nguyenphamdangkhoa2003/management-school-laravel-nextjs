<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AnnouncementController extends Controller
{
    public function index()
    {
        try {
            $announcements = Announcement::with('school_classes')->paginate(10);
            return AnnouncementResource::collection($announcements);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving announcements.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(AnnouncementRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $announcement = Announcement::create($validatedData);
            return response()->json($announcement, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Thường xảy ra lỗi khi dữ liệu không hợp lệ, chẳng hạn như lỗi trùng dữ liệu
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating announcement.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            // Lỗi tổng quát khi tạo announcement
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the announcement.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $announcement,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Announcement not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the announcement.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(AnnouncementRequest $request, string $id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            $validatedData = $request->validated();
            $announcement->update($validatedData);
            return response()->json($announcement, 200);
        } catch (\Illuminate\Database\QueryException $e) {
            // Thường xảy ra lỗi khi dữ liệu không hợp lệ, chẳng hạn như lỗi trùng dữ liệu
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating announcement.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the announcement.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->delete();
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Announcement deleted successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the announcement.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
{
    try {
        // Lấy các tham số tìm kiếm từ request
        $title = $request->query("title");
        $description = $request->query("description");
        $date = $request->query("date");
        $school_class_id = $request->query("school_class_id");
        $created_at = $request->query("created_at");
        $updated_at = $request->query("updated_at");

        // Khởi tạo truy vấn
        $query = Announcement::query();

        // Dùng orWhere để tìm kiếm với các trường khác nhau
        if ($title) {
            $query->orWhere("title", "like", "%" . $title . "%");
        }
        if ($description) {
            $query->orWhere("description", "like", "%" . $description . "%");
        }
        if ($date) {
            $query->orWhere("date", "=", $date);
        }
        if ($school_class_id) {
            $query->orWhere("school_class_id", "=", $school_class_id);
        }
        if ($created_at) {
            $query->orWhere("created_at", "=", $created_at);
        }
        if ($updated_at) {
            $query->orWhere("updated_at", "=", $updated_at);
        }

        // Thực hiện truy vấn và phân trang kết quả
        $announcements = $query->paginate(10);

        // Kiểm tra kết quả và trả về phản hồi
        if (!$announcements->isEmpty()) {
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Announcements retrieved successfully.',
                'data' => $announcements,
            ]);
        } else {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'No announcements found.',
            ]);
        }
    } catch (\Exception $e) {
        // Xử lý lỗi nếu có
        return response()->json([
            'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
            'message' => 'An error occurred while searching for announcements.',
            'error' => $e->getMessage(),
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

}
