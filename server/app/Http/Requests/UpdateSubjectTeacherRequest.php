<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateSubjectTeacherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
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
            'teacher_id' => [
                'sometimes',
                'required',
                'exists:teachers,id',
                Rule::unique('subject_teacher')->where(function ($query) {
                    return $query->where('teacher_id', $this->teacher_id)
                                ->where('subject_id', $this->subject_id);
                })->ignore($this->subject_teacher),
            ],
            'subject_id' => [
                'sometimes',
                'required',
                'exists:subjects,id',
            ],
        ];
    }
}
