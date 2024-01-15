<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class cobaget extends Model
{
    use HasFactory;
    protected $table = "recap";
    protected $fillable = ["temperature", "humidity", "sum"];
}
