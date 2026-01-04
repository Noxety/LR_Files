<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Message extends Model
{
    use HasFactory, Notifiable, SoftDeletes;
    protected $table = "messages";
    protected $guarded = [];
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
