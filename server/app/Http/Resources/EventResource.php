<?php

namespace App\Http\Resources;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            "description" => $this->description,
            "startTime" => $this->startTime,
            "endTime" => $this->endTime,
            "schoolclass_id" =>  new SchoolClassResource($this->whenLoaded('school_classes')),
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at,
        ]; 
    }
}