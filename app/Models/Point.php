<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    protected $table = 'points';  // no es obligatorio si sigue la convención, pero queda claro
    protected $fillable = ['municipio', 'latitud', 'longitud'];
}