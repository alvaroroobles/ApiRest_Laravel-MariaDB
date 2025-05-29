<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    // Protección para permitir asignación de datos masiva
    // (A través de un array o en mi caso un JSON)
    protected $fillable = [
        'CODPROV',
        'NOMBRE_PROVINCIA',
        'CODAUTON',
        'COMUNIDAD_CIUDAD_AUTONOMA',
        'CAPITAL_PROVINCIA'
    ];
}
