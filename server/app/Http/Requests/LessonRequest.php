<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LessonRequest extends FormRequest
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
            'link' => 'required|string|unique:lessons,link,' . $this->route('id'),
            'day' => 'required|in:MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY',
            'startTime' => 'required|date_format:Y-m-d H:i:s',
            'endTime' => 'required|date_format:Y-m-d H:i:s|after:startTime',
            'class_time' => 'required|date_format:H:i:s',
            'ending_class_time' => 'required|date_format:H:i:s|after:class_time',
            'subject_teacher_id' => 'required|exists:subject_teacher,id',
            'school_class_id' => 'required|exists:school_classes,id'
        ];
    }
}
