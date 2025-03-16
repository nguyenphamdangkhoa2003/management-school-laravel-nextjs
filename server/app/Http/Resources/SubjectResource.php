<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
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
            'name' => $this->name,
            'tin_chi' => $this->tin_chi,
            'tin_chi_hoc_phan' => $this->tin_chi_hoc_phan,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
