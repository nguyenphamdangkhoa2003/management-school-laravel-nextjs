<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResultResource extends JsonResource
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
            "process_score" => $this->process_score,
            "semi_score" => $this->semi_score,
            "final_scrore" => $this->final_scrore,
            "subject" => new SubjectResource($this->whenLoaded('subjects')),
            "student" =>  new StudentResource($this->whenLoaded('students')),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
