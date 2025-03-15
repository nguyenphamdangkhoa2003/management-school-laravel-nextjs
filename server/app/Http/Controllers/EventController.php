<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EventController extends Controller
{
    public function index()
    {
        try {
            $events = Event::with('school_classes')->paginate(10);
            return EventResource::collection($events);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving events.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(EventRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $event = Event::create($validatedData);
            return response()->json($event, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi cơ sở dữ liệu khi tạo sự kiện
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating event.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            // Lỗi tổng quát khi tạo sự kiện
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the event.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id)
    {
        try {
            $event = Event::findOrFail($id);
            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $event,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Event not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the event.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(EventRequest $request, string $id)
    {
        try {
            $event = Event::findOrFail($id);
            $validatedData = $request->validated();
            $event->update($validatedData);
            return response()->json($event, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Event not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi cơ sở dữ liệu khi cập nhật sự kiện
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating event.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the event.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->delete();
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Event deleted successfully.',
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Event not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the event.',
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
            $startTime = $request->query("startTime");
            $endTime = $request->query("endTime");
            $school_class_id = $request->query("school_class_id");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");

            // Khởi tạo truy vấn
            $query = Event::query();

            // Dùng orWhere để tìm kiếm với các trường khác nhau
            if ($title) {
                $query->orWhere("title", "like", "%" . $title . "%");
            }
            if ($description) {
                $query->orWhere("description", "like", "%" . $description . "%");
            }
            if ($startTime) {
                $query->orWhere("startTime", "=", $startTime);
            }
            if ($endTime) {
                $query->orWhere("endTime", "=", $endTime);
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
            $events = $query->paginate(10);

            // Kiểm tra kết quả và trả về phản hồi
            if (!$events->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Events retrieved successfully.',
                    'data' => $events,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No events found.',
                ]);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for events.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
