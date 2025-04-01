<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Guardian; // Giả sử model Parent được đặt tên là Guardian
use App\Models\Attendance;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

class DashboardController extends Controller
{
    public function dashboardStats()
    {
        $stats = [
            'total_students' => Student::count(),
            'total_teachers' => Teacher::count(),
            'total_parents' => Guardian::count(),
            'male_students' => Student::where('sex', 'male')->count(),
            'female_students' => Student::where('sex', 'female')->count(),
        ];

        $currentYear = Carbon::now()->year;
        $previousYear = $currentYear - 1;

        $currentYearAttendances = Attendance::selectRaw('MONTH(date) as month, COUNT(*) as count')
            ->whereYear('date', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $previousYearAttendances = Attendance::selectRaw('MONTH(date) as month, COUNT(*) as count')
            ->whereYear('date', $previousYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $attendanceData = [];
        for ($month = 1; $month <= 12; $month++) {
            $attendanceData[] = [
                'month' => $month,
                'current_year' => $currentYearAttendances[$month] ?? 0,
                'previous_year' => $previousYearAttendances[$month] ?? 0,
            ];
        }

        return response()->json([
            'status' => Response::HTTP_OK,
            'data' => [
                'counts' => $stats,
                'attendance_trends' => $attendanceData,
                'current_year' => $currentYear,
                'previous_year' => $previousYear,
            ]
        ]);
    }
}
