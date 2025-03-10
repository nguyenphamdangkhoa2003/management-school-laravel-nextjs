<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'code' => $this->code,
            'username' => $this->username,
            'name' => $this->name,
            'surname' => $this->surname,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'img' => $this->img,
            'sex' => $this->sex,
            'bloodType' => $this->bloodType,
            'school_class' => new SchoolClassResource($this->whenLoaded('schoolClass')),
            'guardian' => new GuardResource($this->whenLoaded('guardians')),
            'grade' => new GradeResource($this->whenLoaded('grades')),
        ];
    }
}
