<?php

namespace App\Http\Controllers;

use App\Http\Requests\PersonalAccessTokenRequest;
use App\Http\Resources\PersonalAccessTokenResource;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PersonalAccessTokenController extends Controller
{
    public function index()
    {
        $tokens = PersonalAccessToken::paginate(10);
        return PersonalAccessTokenResource::collection($tokens);
    }

    public function store(PersonalAccessTokenRequest $request)
    {
        $validatedData = $request->validated();
        $token = PersonalAccessToken::create($validatedData);
        return response()->json($token, 201);
    }

    public function show(string $id)
    {
        try {
            $token = PersonalAccessToken::findOrFail($id);
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_OK,
                "data" => $token
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
                "message" => "Token not found",
            ], \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR,
                "message" => "An error occurred while retrieving the token",
            ], \Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(PersonalAccessTokenRequest $request, string $id)
    {
        $token = PersonalAccessToken::findOrFail($id);
        $validatedData = $request->validated();
        $token->update($validatedData);
        return response()->json($token, 200);
    }

    public function destroy($id)
    {
        $token = PersonalAccessToken::findOrFail($id);
        $token->delete();
        return response()->json(['message' => 'Token deleted successfully'], 200);
    }

    public function search(Request $request)
    {
        $name = $request->query("name");
        $tokenable_type = $request->query("tokenable_type");
        $query = PersonalAccessToken::query();

        if ($name) {
            $query->where("name", "like", "%" . $name . "%");
        }
        if ($tokenable_type) {
            $query->where("tokenable_type", $tokenable_type);
        }

        $tokens = $query->paginate(10);

        if (!$tokens->isEmpty()) {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_OK,
                'message' => 'Tokens retrieved successfully.',
                "data" => $tokens,
            ]);
        } else {
            return response()->json([
                "status" => \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
                'message' => 'No tokens found.',
            ]);
        }
    }
}
