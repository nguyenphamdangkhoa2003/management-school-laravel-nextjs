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
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        $ruleCreate = [
            'username' => 'required|string|unique:guardians,username,' . $this->route('id'),
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'nullable|email|unique:guardians,email,' . $this->route('id'),
            'phone' => 'nullable|string|unique:guardians,phone,' . $this->route('id'),
            'address' => 'required|string',
            'job' => 'nullable|string',
            'sex' => 'required|in:MALE,FEMALE',
            'password' => 'required|string|min:6'
        ];

        $ruleUpdate = [
            'username' => 'sometimes|string|unique:guardians,username,' . $this->route('id'),
            'name' => 'sometimes|string',
            'surname' => 'sometimes|string',
            'email' => 'nullable|email|unique:guardians,email,' . $this->route('id'),
            'phone' => 'nullable|string|unique:guardians,phone,' . $this->route('id'),
            'address' => 'sometimes|string',
            'job' => 'nullable|string',
            'sex' => 'sometimes|in:MALE,FEMALE',
            'password' => 'sometimes|string|min:6'
        ];

        if ($isUpdate)
            return $ruleUpdate;
        return $ruleCreate;
    }
}
