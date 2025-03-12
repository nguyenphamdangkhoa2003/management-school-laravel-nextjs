<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
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
            "description" => $this->description,
            "date" => $this->date,
            "school_class_id" =>  new SchoolClassResource($this->whenLoaded('school_classes')),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
