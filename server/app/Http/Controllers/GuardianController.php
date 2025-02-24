<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Http\Requests\GuardianRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuardianController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $guardians = Guardian::all();
            return response()->json($guardians);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving guardians.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(GuardianRequest $request): JsonResponse
    {
        try {
            $guardian = Guardian::create($request->validated());
            return response()->json($guardian, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while creating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while creating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $guardian = Guardian::findOrFail($id);
            return response()->json($guardian);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Guardian not found.',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(GuardianRequest $request, string $id): JsonResponse
    {
        try {
            $guardian = Guardian::findOrFail($id);
            $guardian->update($request->validated());
            return response()->json($guardian, 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'status' => Response::HTTP_BAD_REQUEST,
                'message' => 'Database error occurred while updating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while updating the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $guardian = Guardian::findOrFail($id);
            $guardian->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while deleting the guardian.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request)
    {
        try {
            $name = $request->query("name");
            $username = $request->query("username");

            $query = Guardian::query();

            if ($name) {
                $query->where("name", "like", "%" . $name . "%");
            }
            if ($username) {
                $query->where("username", "like", "%" . $username . "%");
            }

            $guardians = $query->paginate(10);

            if (!$guardians->isEmpty()) {
                return response()->json([
                    'status' => Response::HTTP_OK,
                    'message' => 'Guardians retrieved successfully.',
                    'data' => $guardians,
                ]);
            } else {
                return response()->json([
                    'status' => Response::HTTP_NOT_FOUND,
                    'message' => 'No guardians found.',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while searching for guardians.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
