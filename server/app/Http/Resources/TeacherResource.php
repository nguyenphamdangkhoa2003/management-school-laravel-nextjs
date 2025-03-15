<?php

namespace App\Http\Resources;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            "username" => $this->username,
            'name' => $this->name,
            "surname" => $this->surname,
            "phone" => $this->phone,
            "address" => $this->address,
            "img" => $this->img,
            'email' => $this->email,
            "bloodType" => $this->bloodType,
            "sex" => $this->sex,
            "school_classes" => ClassResource::collection($this->school_classes),
        ];
    }
}
