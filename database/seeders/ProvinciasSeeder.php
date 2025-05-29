<?php

namespace Database\Seeders;

use Http;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Provincia;

class ProvinciasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Enlace de donde sacaremos todos los datos de mi tabla
        $url='https://www.el-tiempo.net/api/json/v2/provincias';

        // Respuesta de la petición HTTP
        $response=Http::get($url);

        if($response->successful()){
            // Decodificamos el JSON, convirtiendolo en un array asociativo.
            $provincias=$response->json()['provincias'];

            foreach($provincias as $provincia){
                //CREAMOS un registro (y un objeto provincia) usando el modelo;
                Provincia::create([
                    'CODPROV'=>$provincia['CODPROV'],
                    'NOMBRE_PROVINCIA'=>$provincia['NOMBRE_PROVINCIA'],
                    'CODAUTON'=>$provincia['CODAUTON'],
                    'COMUNIDAD_CIUDAD_AUTONOMA'=>$provincia['COMUNIDAD_CIUDAD_AUTONOMA'],
                    'CAPITAL_PROVINCIA'=>$provincia['CAPITAL_PROVINCIA'],
                ]);
            }
    }else{
        echo "Error al insertar las provincias";
        }
    }
}