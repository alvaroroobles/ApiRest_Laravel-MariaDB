<?php

namespace Database\Seeders;
use Http;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Autonomy;

class AutonomySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comunidades = [
            ['codigo' => '01', 'nombre' => 'Andalucía'],
            ['codigo' => '02', 'nombre' => 'Aragón'],
            ['codigo' => '03', 'nombre' => 'Principado de Asturias'],
            ['codigo' => '04', 'nombre' => 'Illes Balears'],
            ['codigo' => '05', 'nombre' => 'Canarias'],
            ['codigo' => '06', 'nombre' => 'Cantabria'],
            ['codigo' => '07', 'nombre' => 'Castilla y León'],
            ['codigo' => '08', 'nombre' => 'Castilla-La Mancha'],
            ['codigo' => '09', 'nombre' => 'Cataluña/Catalunya'],
            ['codigo' => '10', 'nombre' => 'Comunitat Valenciana'],
            ['codigo' => '11', 'nombre' => 'Extremadura'],
            ['codigo' => '12', 'nombre' => 'Galicia'],
            ['codigo' => '13', 'nombre' => 'Madrid'],
            ['codigo' => '14', 'nombre' => 'Murcia'],
            ['codigo' => '15', 'nombre' => 'Navarra'],
            ['codigo' => '16', 'nombre' => 'País Vasco/Euskadi'],
            ['codigo' => '17', 'nombre' => 'La Rioja'],
            ['codigo' => '18', 'nombre' => 'Ceuta'],
            ['codigo' => '19', 'nombre' => 'Melilla'],
        ];
        foreach ($comunidades as $comunidad) {
            Autonomy::updateOrCreate(
                ['CODAUT' => $comunidad['codigo']],
                ['NOMBRE_AUTONOMA' => $comunidad['nombre']]
            );
        }

    }
}
