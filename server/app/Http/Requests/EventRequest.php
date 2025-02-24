<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
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
            'title' => 'required|string|unique:events,title,' . $this->route('id'),
            'description' => 'required|string',
            'startTime' => 'required|date_format:Y-m-d H:i:s',
            'endTime' => 'required|date_format:Y-m-d H:i:s|after:startTime',
            'school_class_id' => 'required|exists:school_classes,id'
        ];
    }
}
