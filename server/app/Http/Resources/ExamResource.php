<?php

namespace App\Http\Resources;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "startTime" => $this->startTime,
            "endTime" => $this->endTime,
            "lesson" =>new LessonResource(Lesson::find($this->lesson_id)),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
