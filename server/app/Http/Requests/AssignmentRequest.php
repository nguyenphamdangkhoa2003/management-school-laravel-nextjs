<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignmentRequest extends FormRequest
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
            'title' => 'required|string|unique:assignments,title,' . $this->route('id'),
            'startDate' => 'required|date_format:Y-m-d H:i:s',
            'dueDate' => 'required|date_format:Y-m-d H:i:s|after:startDate',
            'lesson_id' => 'required|exists:lessons,id'
        ];
    }
}
