<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends Controller
{
    public function index()
    {
        // Paginate rooms data
        $rooms = Room::paginate(10);
        
        // Return resource collection
        return RoomResource::collection($rooms);
    }
    
    public function store(RoomRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $room = Room::create($validatedData);
            
            return response()->json(new RoomResource($room), 201);
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
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
                'data' => $request->all(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $room = Room::findOrFail($id);
            return response()->json(new RoomResource($room));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Room not found',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the room',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(RoomRequest $request, string $id): JsonResponse
    {
        try {
            $room = Room::find($id);

            if (!$room) {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'Room not found.',
                    'error' => "No query results for model [App\\Models\\Room] $id"
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();
            $room->update($validatedData);

            return response()->json(new RoomResource($room), Response::HTTP_OK);
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
                'error' => 'An error occurred while updating the room.',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $room = Room::findOrFail($id);
            $room->delete();
            
            return response()->json([
                'message' => 'Room deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the room',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            // Get parameters from request
            $code_room = $request->query("code_room");
            $floor = $request->query("floor");
            $name = $request->query("name");
            $capacity = $request->query("capacity");
            $type = $request->query("type");
            $is_available = $request->query("is_available");
            $created_at = $request->query("created_at");
            $updated_at = $request->query("updated_at");
    
            // Initialize query
            $query = Room::query();
    
            // Search conditions based on parameters
            if ($code_room) {
                $query->where("code_room", "like", "%" . $code_room . "%");
            }
    
            if ($floor) {
                $query->orWhere("floor", "=", $floor);
            }
    
            if ($name) {
                $query->orWhere("name", "like", "%" . $name . "%");
            }
    
            if ($capacity) {
                $query->orWhere("capacity", "=", $capacity);
            }
    
            if ($type) {
                $query->orWhere("type", "like", "%" . $type . "%");
            }
    
            if ($is_available !== null) {
                $query->orWhere("is_available", "=", $is_available);
            }
    
            if ($created_at) {
                $query->orWhere("created_at", "like", "%" . $created_at . "%");
            }
    
            if ($updated_at) {
                $query->orWhere("updated_at", "like", "%" . $updated_at . "%");
            }
    
            // Execute query and paginate results
            $rooms = $query->paginate(10);
    
            // Check results and return response
            if (!$rooms->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Rooms retrieved successfully.',
                    'data' => RoomResource::collection($rooms),
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No rooms found.',
                ]);
            }
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for rooms.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
