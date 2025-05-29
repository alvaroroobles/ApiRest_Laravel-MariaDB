<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MunicipioAemet extends Model
{
    protected $table = 'municipios_aemet'; // Nombre exacto de tu tabla

    protected $fillable = [
        'codauto',
        'cpro',
        'cmun',
        'dc',
        'nombre',
        'codigo_municipio',
    ];
}
