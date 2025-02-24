<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuardianRequest extends FormRequest
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
            'username' => 'required|string|unique:guardians,username,' .$this->route('id'),
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'nullable|email|unique:guardians,email,' . $this->route('id'),
            'phone' => 'nullable|string|unique:guardians,phone,' . $this->route('id'),
            'address' => 'required|string',
            'job' => 'nullable|string',
            'sex' => 'required|in:MALE,FEMALE'
        ];
    }
}
