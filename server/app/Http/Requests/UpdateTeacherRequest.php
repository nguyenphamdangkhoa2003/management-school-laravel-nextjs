<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:teachers,username,' . $this->teacher,
            'email' => 'sometimes|email|max:255|unique:teachers,email,' . $this->teacher,
            'phone' => 'sometimes|string|max:20',
            'surname' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'img' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bloodType' => 'sometimes|string|max:10',
            'birthday' => 'sometimes|date',
            'subject_id' => 'sometimes|exists:subjects,id',
            'password' => 'sometimes|string|min:6',
            'sex' => 'sometimes|in:male,female,other'
        ];
    }
}
