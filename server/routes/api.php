<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PersonalAccessTokenController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SubjectTeacherController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Teacher Routes

Route::get("/teachers", [TeacherController::class, "index"]);
Route::get("/teachers/{id}", [TeacherController::class, "show"])->where('id', '[0-9]+');
Route::get("/teachers/search", [TeacherController::class, "search"]);
Route::post('/teachers', [TeacherController::class, 'store']);
Route::put('/teachers/{id}', [TeacherController::class, 'update']);
Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);

Route::apiResource('users', UserController::class);

// Student Routes
Route::get("/students", [StudentController::class, "index"]);
Route::get("/students/{id}", [StudentController::class, "show"])->where('id', '[0-9]+');
Route::get("/students/search", [StudentController::class, "search"]);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

// Guardian Routes
Route::get('/guardians', [GuardianController::class, 'index']);
Route::post('/guardians', [GuardianController::class, 'store']);
Route::get('/guardians/search', [GuardianController::class, 'search']);
Route::get('/guardians/{id}', [GuardianController::class, 'show']);
Route::put('/guardians/{id}', [GuardianController::class, 'update']);
Route::delete('/guardians/{id}', [GuardianController::class, 'destroy']);


// Subject Routes
Route::get('/subjects', [SubjectController::class, 'index']);
Route::post('/subjects', [SubjectController::class, 'store']);
Route::get('/subjects/search', [SubjectController::class, 'search']);
Route::get('/subjects/{id}', [SubjectController::class, 'show']);
Route::put('/subjects/{id}', [SubjectController::class, 'update']);
Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);


// Lesson Routes
Route::get("/lessons", [LessonController::class, "index"]);
Route::get("/lessons/{id}", [LessonController::class, "show"])->where('id', '[0-9]+');
Route::get("/lessons/search", [LessonController::class, "search"]);
Route::post('/lessons', [LessonController::class, 'store']);
Route::put('/lessons/{id}', [LessonController::class, 'update']);
Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
Route::get('lessons/{teacher}/teachers', [LessonController::class, 'getTeacherSubjects']);

// School Class Routes
Route::get("/school-classes", [SchoolClassController::class, "index"]);
Route::get("/school-classes/{id}", [SchoolClassController::class, "show"])->where('id', '[0-9]+');
Route::get("/school-classes/search", [SchoolClassController::class, "search"]);
Route::post('/school-classes', [SchoolClassController::class, 'store']);
Route::put('/school-classes/{id}', [SchoolClassController::class, 'update']);
Route::delete('/school-classes/{id}', [SchoolClassController::class, 'destroy']);

// Grade Routes
Route::get("/grades", [GradeController::class, "index"]);
Route::get("/grades/{id}", [GradeController::class, "show"])->where('id', '[0-9]+');
Route::get("/grades/search", [GradeController::class, "search"]);
Route::post('/grades', [GradeController::class, 'store']);
Route::put('/grades/{id}', [GradeController::class, 'update']);
Route::delete('/grades/{id}', [GradeController::class, 'destroy']);

// Exam Routes
Route::get("/exams", [ExamController::class, "index"]);
Route::get("/exams/{id}", [ExamController::class, "show"])->where('id', '[0-9]+');
Route::get("/exams/search", [ExamController::class, "search"]);
Route::post('/exams', [ExamController::class, 'store']);
Route::put('/exams/{id}', [ExamController::class, 'update']);
Route::delete('/exams/{id}', [ExamController::class, 'destroy']);

// Assignment Routes
Route::get("/assignments", [AssignmentController::class, "index"]);
Route::get("/assignments/{id}", [AssignmentController::class, "show"])->where('id', '[0-9]+');
Route::get("/assignments/search", [AssignmentController::class, "search"]);
Route::post('/assignments', [AssignmentController::class, 'store']);
Route::put('/assignments/{id}', [AssignmentController::class, 'update']);
Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);

// Result Routes
Route::get("/results", [ResultController::class, "index"]);
Route::get("/results/{id}", [ResultController::class, "show"])->where('id', '[0-9]+');
Route::get("/results/search", [ResultController::class, "search"]);
Route::post('/results', [ResultController::class, 'store']);
Route::put('/results/{id}', [ResultController::class, 'update']);
Route::delete('/results/{id}', [ResultController::class, 'destroy']);

// Attendance Routes
Route::get("/attendances", [AttendanceController::class, "index"]);
Route::get("/attendances/search", [AttendanceController::class, "search"]);
Route::get('/attendances/{lessonId}/lessons', [AttendanceController::class, 'getLessonAttendances']);
Route::get('/attendances/{studentId}/students', [AttendanceController::class, 'getStudentAttendances']);
Route::post('/attendances', [AttendanceController::class, 'store']);
Route::get("/attendances/{id}", [AttendanceController::class, "show"])->where('id', '[0-9]+');
Route::put('/attendances/{id}', [AttendanceController::class, 'update']);
Route::delete('/attendances/{id}', [AttendanceController::class, 'destroy']);


// Event Routes
Route::get("/events", [EventController::class, "index"]);
Route::get("/events/{id}", [EventController::class, "show"])->where('id', '[0-9]+');
Route::get("/events/search", [EventController::class, "search"]);
Route::post('/events', [EventController::class, 'store']);
Route::put('/events/{id}', [EventController::class, 'update']);
Route::delete('/events/{id}', [EventController::class, 'destroy']);

// Announcement Routes
Route::get("/announcements", [AnnouncementController::class, "index"]);
Route::get("/announcements/{id}", [AnnouncementController::class, "show"])->where('id', '[0-9]+');
Route::get("/announcements/search", [AnnouncementController::class, "search"]);
Route::post('/announcements', [AnnouncementController::class, 'store']);
Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

// Admin Routes
Route::get("/admins", [AdminController::class, "index"]);
Route::get("/admins/{id}", [AdminController::class, "show"])->where('id', '[0-9]+');
Route::get("/admins/search", [AdminController::class, "search"]);
Route::post('/admins', [AdminController::class, 'store']);
Route::put('/admins/{id}', [AdminController::class, 'update']);
Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

// SubjectTeacher Routes
Route::get('subject-teachers', [SubjectTeacherController::class,"index"]);
Route::get('subject-teachers/search', [SubjectTeacherController::class, 'search']);
Route::get('teachers/{teacher}/subjects', [SubjectTeacherController::class, 'getTeacherSubjects']);
Route::get('subjects/{subject}/teachers', [SubjectTeacherController::class, 'getSubjectTeachers']);
Route::get("/subject-teachers/{id}", [SubjectTeacherController::class, "show"])->where('id', '[0-9]+');
Route::post('/subject-teachers', [SubjectTeacherController::class, 'store']);
Route::put('/subject-teachers/{id}', [SubjectTeacherController::class, 'update']);
Route::delete('/subject-teachers/{id}', [SubjectTeacherController::class, 'destroy']);

//Room
Route::apiResource('rooms', RoomController::class);
Route::get('rooms/search/query', [RoomController::class, 'search']);

// Personal Access Token Routes
// Route::get("/tokens", [PersonalAccessTokenController::class, "index"]);
// Route::get("/tokens/{id}", [PersonalAccessTokenController::class, "show"])->where('id', '[0-9]+');
// Route::get("/tokens/search", [PersonalAccessTokenController::class, "search"]);
// Route::post('/tokens', [PersonalAccessTokenController::class, 'store']);
// Route::put('/tokens/{id}', [PersonalAccessTokenController::class, 'update']);
// Route::delete('/tokens/{id}', [PersonalAccessTokenController::class, 'destroy']);

//Auth Routes
Route::post('auth/login', [AuthController::class, 'login']);