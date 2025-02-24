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
            $announcements = Announcement::paginate(10);
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
            $title = $request->query("title");
            $school_class_id = $request->query("school_class_id");
            $query = Announcement::query();

            if ($title) {
                $query->where("title", "like", "%" . $title . "%");
            }
            if ($school_class_id) {
                $query->where("school_class_id", $school_class_id);
            }

            $announcements = $query->paginate(10);

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
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for announcements.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
