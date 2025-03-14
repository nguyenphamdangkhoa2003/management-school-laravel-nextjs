<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'username' => $this->username,
            'name' => $this->name,
            'surname' => $this->surname,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'job' => $this->job,
            'sex' => $this->sex,
            'password' => $this->password, // Lưu ý: bạn có thể muốn loại bỏ password khi trả về API (tùy vào bảo mật)
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
