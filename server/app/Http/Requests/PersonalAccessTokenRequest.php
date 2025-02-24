<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersonalAccessTokenRequest extends FormRequest
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
            'name' => 'required|string',
            'token' => 'required|string|unique:personal_access_tokens,token,' . $this->route('id'),
            'abilities' => 'nullable|string',
            'tokenable_type' => 'required|string',
            'tokenable_id' => 'required|integer',
            'last_used_at' => 'nullable|date_format:Y-m-d H:i:s',
            'expires_at' => 'nullable|date_format:Y-m-d H:i:s|after:now'
        ];
    }
}
