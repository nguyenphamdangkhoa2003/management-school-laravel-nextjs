<?php

use App\Http\Controllers\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get("/teachers", [TeacherController::class, "index"]);
Route::get("/teachers/{id}", [TeacherController::class, "show"])->where('id', '[0-9]+');
Route::get("/teachers/search", [TeacherController::class, "search"]);
Route::post('/teachers', [TeacherController::class, 'store']);
Route::put('/teachers/{id}', [TeacherController::class, 'update']);
