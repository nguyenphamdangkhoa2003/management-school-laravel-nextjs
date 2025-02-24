<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'score' => 'required|integer|min:0|max:100',
            'exam_id' => 'nullable|exists:exams,id',
            'assignment_id' => 'nullable|exists:assignments,id',
            'student_id' => 'required|exists:students,id'
        ];
    }
}
