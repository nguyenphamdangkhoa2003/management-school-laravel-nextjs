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
        return [
            'code' => 'required|string|unique:students,code,' . $this->route('id'),
            'username' => 'required|string|unique:students,username,' . $this->route('id'),
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'nullable|email|unique:students,email,' . $this->route('id'),
            'phone' => 'nullable|string|unique:students,phone,' . $this->route('id'),
            'address' => 'required|string',
            'img' => 'nullable|string',
            'sex' => 'required|in:MALE,FEMALE',
            'bloodType' => 'required|string',
            'birthday' => 'required|date',
            'password' => 'required|string',
        ];
    }
}
