<?php

use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use function PHPUnit\Framework\returnArgument;

Route::get("/", function () {
    return view("welcome");
});
