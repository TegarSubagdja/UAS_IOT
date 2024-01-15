<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreVisitor extends Model
{
    use HasFactory;
    protected $table = "store_visitors";
    protected $fillable = ['jumlah'];
}
