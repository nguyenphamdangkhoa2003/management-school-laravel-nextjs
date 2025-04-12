<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Subject;
use App\Models\Result;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StudentScoreController extends Controller
{
    /**
     * Lấy thông tin điểm của sinh viên theo môn học
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudentScores(Request $request)
    {
        try {
            $student_id = $request->query('student_id');
            
            if (!$student_id) {
                return response()->json([
                    'status' => Response::HTTP_BAD_REQUEST,
                    'message' => 'Student ID is required',
                ], Response::HTTP_BAD_REQUEST);
            }
            
            // Kiểm tra sinh viên tồn tại
            $student = Student::findOrFail($student_id);
            
            // Lấy tất cả kết quả của sinh viên kèm thông tin môn học
            $results = Result::where('student_id', $student_id)
                ->with('subjects') // Changed from 'subject' to 'subjects' to match the method name in Result model
                ->get();
            
            $subjectScores = [];
            $counter = 1;
            
            foreach ($results as $result) {
                $subject = $result->subjects; // Changed from $result->subject to $result->subjects
                
                // Tính toán điểm tổng kết
                $processScore = $result->process_score ?? 0;
                $semiScore = $result->semi_score ?? 0;
                $finalScore = $result->final_score ?? 0;
                
                $processPercent = $subject->process_percent / 100;
                $midtermPercent = $subject->midterm_percent / 100;
                $finalPercent = $subject->final_percent / 100;
                
                // Tính điểm tổng kết 1 (thang điểm 10)
                $totalScore1 = ($processScore * $processPercent) + 
                               ($semiScore * $midtermPercent) + 
                               ($finalScore * $finalPercent);
                
                $totalScore1 = round($totalScore1, 2);
                
                // Tính điểm tổng kết 2 (thang điểm 4)
                $totalScore2 = $this->convertTo4Scale($totalScore1);
                
                // Tính điểm tổng kết 3 (điểm chữ)
                $totalScore3 = $this->convertToLetterGrade($totalScore1);
                
                $subjectScores[] = [
                    'stt' => $counter++,
                    'subject_code' => $subject->id, // Không có trường code trong bảng subjects, dùng id thay thế
                    'subject_name' => $subject->name,
                    'credits' => $subject->credit,
                    'course_credits' => $subject->course_credit,
                    'process_percent' => $subject->process_percent,
                    'midterm_percent' => $subject->midterm_percent,
                    'final_percent' => $subject->final_percent,
                    'process_score' => $result->process_score,
                    'semi_score' => $result->semi_score,
                    'final_score' => $result->final_score,
                    'total_score_1' => $totalScore1,
                    'total_score_2' => $totalScore2,
                    'total_score_3' => $totalScore3,
                    'final_total_score' => $totalScore1,
                    'result' => $totalScore1 >= 5 ? 'Đạt' : 'X'
                ];
            }
            
            return response()->json([
                'status' => Response::HTTP_OK,
                'message' => 'Student scores retrieved successfully',
                'data' => $subjectScores
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => Response::HTTP_NOT_FOUND,
                'message' => 'Student not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'An error occurred while retrieving student scores',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Chuyển đổi điểm thang 10 sang thang 4
     *
     * @param float $score
     * @return float
     */
    private function convertTo4Scale($score)
    {
        if ($score >= 8.5) return 4.0;
        if ($score >= 8.0) return 3.7;
        if ($score >= 7.5) return 3.5;
        if ($score >= 7.0) return 3.0;
        if ($score >= 6.5) return 2.5;
        if ($score >= 5.5) return 2.0;
        if ($score >= 5.0) return 1.5;
        if ($score >= 4.0) return 1.0;
        return 0.0;
    }
    
    /**
     * Chuyển đổi điểm thang 10 sang điểm chữ
     *
     * @param float $score
     * @return string
     */
    private function convertToLetterGrade($score)
    {
        if ($score >= 8.5) return 'A';
        if ($score >= 8.0) return 'B+';
        if ($score >= 7.0) return 'B';
        if ($score >= 6.5) return 'C+';
        if ($score >= 5.5) return 'C';
        if ($score >= 5.0) return 'D+';
        if ($score >= 4.0) return 'D';
        return 'F';
    }
}
