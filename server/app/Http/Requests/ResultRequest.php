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
        'process_score' => 'required|numeric|min:0|max:10',
        'semi_score' => 'required|numeric|min:0|max:10',
        'final_scrore' => 'required|numeric|min:0|max:10',
        'subject_id' => 'required|exists:subjects,id',
        'student_id' => 'required|exists:students,id',
        ];
    }
}
