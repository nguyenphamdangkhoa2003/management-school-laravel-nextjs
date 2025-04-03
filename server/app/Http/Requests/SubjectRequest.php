<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubjectRequest extends FormRequest
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
            'name' => 'required|string|unique:subjects,name,' . $this->route('id'),
            'credit' => 'required|integer',
            'course_credit' => 'required|integer',
            'process_percent' => 'required|numeric|min:0|max:100',
            'midterm_percent' => 'required|numeric|min:0|max:100',
            'final_percent' => 'required|numeric|min:0|max:100',
        ];
    }
}
