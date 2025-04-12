<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentScoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'stt' => $this['stt'],
            'subject_code' => $this['subject_code'],
            'subject_name' => $this['subject_name'],
            'credits' => $this['credits'],
            'course_credits' => $this['course_credits'],
            'process_percent' => $this['process_percent'],
            'midterm_percent' => $this['midterm_percent'],
            'final_percent' => $this['final_percent'],
            'process_score' => $this['process_score'],
            'semi_score' => $this['semi_score'],
            'final_score' => $this['final_score'],
            'total_score_1' => $this['total_score_1'],
            'total_score_2' => $this['total_score_2'],
            'total_score_3' => $this['total_score_3'],
            'final_total_score' => $this['final_total_score'],
            'result' => $this['result'],
        ];
    }
}
