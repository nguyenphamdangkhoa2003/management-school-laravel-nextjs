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
        if ($this->isMethod('post')) {
            return [
                'process_score' => 'sometimes|numeric|min:0|max:10',
                'semi_score' => 'sometimes|numeric|min:0|max:10',
                'final_score' => 'sometimes|numeric|min:0|max:10',
                'subject_id' => 'required|exists:subjects,id',
                'student_id' => 'required|exists:students,id',
            ];
        }
        return [
            'process_score' => 'sometimes|numeric|min:0|max:10',
            'semi_score' => 'sometimes|numeric|min:0|max:10',
            'final_score' => 'sometimes|numeric|min:0|max:10',
        ];
    }
}