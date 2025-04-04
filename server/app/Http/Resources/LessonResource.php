<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
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
            "link" => $this->link,
            "day" => $this->day,
            "startTime" => $this->startTime,
            "endTime" => $this->endTime,
            "class_time" => $this->class_time,
            "ending_class_time" => $this->ending_class_time,
            "subject_teacher" => new SubjectTeacherResource($this->whenLoaded('subject_teacher')),
            "room" => new RoomResource($this->whenLoaded('rooms')),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
