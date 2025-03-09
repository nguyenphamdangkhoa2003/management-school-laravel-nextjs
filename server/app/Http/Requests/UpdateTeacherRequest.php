<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'username' => [
                'sometimes', 'string', 'max:255',
                Rule::unique('teachers')->ignore($this->route('id')) // Cho phép giữ nguyên username cũ
            ],
            'name' => 'sometimes|string|max:255',
            'surname' => 'sometimes|string|max:255',
            'email' => [
                'sometimes', 'string', 'email', 'max:255',
                Rule::unique('teachers')->ignore($this->route('teacher')) // Email không cần unique khi cập nhật
            ],
            'phone' => 'sometimes|string|max:15',
            'address' => 'sometimes|string|max:255',
            'img' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bloodType' => 'sometimes|string|max:3',
            'sex' => ['sometimes', 'string', Rule::in(["MALE", "FEMALE"])],
            'birthday' => 'sometimes|date',
            'password' => 'sometimes|min:8', // Không bắt buộc nhập lại mật khẩu khi cập nhật
        ];
    }
}