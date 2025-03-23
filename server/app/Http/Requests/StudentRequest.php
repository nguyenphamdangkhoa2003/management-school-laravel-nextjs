<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //  return Auth::check() && Auth::user()->role === 'admin';
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
        $rulesCreate = [
            'code' => 'required|string|unique:students,code,' . $this->route('id'),
            'username' => 'required|string|unique:students,username,' . $this->route('id'),
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'nullable|email|unique:students,email,' . $this->route('id'),
            'phone' => 'nullable|string|unique:students,phone,' . $this->route('id'),
            'address' => 'required|string',
            'img' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'password' => "required|string",
            'sex' => 'required|in:MALE,FEMALE',
            'bloodType' => 'required|string',
            'birthday' => 'required|date',
            'guardian_id' => 'required|exists:guardians,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'grade_id' => 'required|exists:grades,id',
        ];

        $rulesUpdate = [
            'code' => 'sometimes|string|unique:students,code,' . $this->route('id'),
            'username' => 'sometimes|string|unique:students,username,' . $this->route('id'),
            'name' => 'sometimes|string',
            'surname' => 'sometimes|string',
            'email' => 'sometimes|email|unique:students,email,' . $this->route('id'),
            'phone' => 'nullable|string|unique:students,phone,' . $this->route('id'),
            'address' => 'sometimes|string',
            'img' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'password' => "nullable|string",
            'sex' => 'sometimes|in:MALE,FEMALE',
            'bloodType' => 'sometimes|string',
            'birthday' => 'sometimes|date',
            'guardian_id' => 'sometimes|exists:guardians,id',
            'school_class_id' => 'sometimes|exists:school_classes,id',
            'grade_id' => 'sometimes|exists:grades,id',
        ];
        // Nếu là create, password là required
        if ($isUpdate) {
            return $rulesUpdate;
        } else {
            // Nếu là update, password là nullable (không bắt buộc)
            return $rulesCreate;
        }
    }
}