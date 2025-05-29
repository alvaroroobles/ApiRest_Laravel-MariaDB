<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MunicipiosAemetSeeder extends Seeder
{
    public function run()
    {
        $filePath = storage_path('datos.csv');
        if (!file_exists($filePath)) {
            $this->command->error("Archivo CSV no encontrado en: $filePath");
            return;
        }

        $file = fopen($filePath, 'r');
        $header = fgetcsv($file); // Leer la primera fila con los encabezados

        while (($row = fgetcsv($file)) !== false) {
            $data = array_combine($header, $row);

            DB::table('municipios_aemet')->updateOrInsert(
                ['codigo_municipio' => $data['codigo_municipio']],
                [
                    'codauto' => $data['CODAUTO'],
                    'cpro' => $data['CPRO'],
                    'cmun' => $data['CMUN'],
                    'dc' => $data['DC'],
                    'nombre' => $data['NOMBRE'],
                    'codigo_municipio' => $data['codigo_municipio'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        fclose($file);

        $this->command->info('Datos de municipios importados correctamente.');
    }
}


