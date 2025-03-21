<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
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
        $rules = [
            'code_room' => 'required|string|max:255',
            'floor' => 'required|integer',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer',
            'type' => 'required|string|max:255',
            'is_available' => 'required|boolean',
        ];

        // For update requests, make code_room unique except for the current record
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['code_room'] = 'required|string|max:255|unique:rooms,code_room,' . $this->route('room');
        } else {
            $rules['code_room'] = 'required|string|max:255|unique:rooms,code_room';
        }

        return $rules;
    }
}
