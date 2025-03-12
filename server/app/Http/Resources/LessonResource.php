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
            "name" => $this->name,
            "day" => $this->day,
            "startTime" => $this->startTime,
            "endTime" => $this->endTime,
            "subject" => new SubjectResource($this->whenLoaded('subjects')),
            "teacher" => new TeacherResource($this->whenLoaded('teachers')),
            "school_class" => new SchoolClassResource($this->whenLoaded('school_classes')),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
