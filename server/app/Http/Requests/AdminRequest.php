<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminRequest extends FormRequest
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
            'username' => 'required|string|unique:admins,username,' . $this->route('id'),
            'password' => [
                $this->route('id') ? 'nullable' : 'required', // Bắt buộc khi tạo mới, không bắt buộc khi cập nhật
                'string',
                'min:8', // Ít nhất 8 ký tự
                'regex:/[a-z]/', // Ít nhất một chữ cái thường
                'regex:/[A-Z]/', // Ít nhất một chữ cái in hoa
                'regex:/[0-9]/', // Ít nhất một số
                'regex:/[@$!%*?&]/', // Ít nhất một ký tự đặc biệt
            ],
        ];
    }
}
