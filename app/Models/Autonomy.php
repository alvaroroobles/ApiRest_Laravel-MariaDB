<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Autonomy extends Model
{
    protected $table = 'autonomy';
    protected $fillable = [
        'CODAUT',
        'NOMBRE_AUTONOMA',
    ];
}
