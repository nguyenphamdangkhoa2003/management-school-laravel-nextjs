<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SchoolClassRequest extends FormRequest
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
            'name' => 'required|string|unique:school_classes,name,' . $this->route('id'),
            'capacity' => 'required|integer|min:1',
            'supervisor_id' => 'required|exists:teachers,id',
            'grade_id' => 'required|exists:grades,id'
        ];
    }
}
