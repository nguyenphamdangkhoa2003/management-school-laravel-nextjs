<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
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
            "date" => $this->date,
            "present" => $this->present,
            "student" => new StudentResource($this->whenLoaded('students')),
            "lesson" => new LessonResource($this->whenLoaded('lessons')),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
