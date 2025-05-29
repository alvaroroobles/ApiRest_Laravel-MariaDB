<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Provincia;

class ProvinciaController extends Controller
{
    public function getCodigoProvincia($provincia)
    {
        if (!$provincia || !is_string($provincia)) {
            return response()->json(['error' => 'Parámetro provincia inválido'], 400);
        }

        $provinciaModel = Provincia::where('NOMBRE_PROVINCIA', 'like', '%' . $provincia . '%')->first();

        if (!$provinciaModel) {
            return response()->json(['error' => 'No se encontró la provincia'], 404);
        }

        $codigoProvincia = $provinciaModel->CODPROV;
        $capitalNombre = $provinciaModel->CAPITAL_PROVINCIA;  // Campo capital en BBDD

        $url = "https://www.el-tiempo.net/api/json/v2/provincias/{$codigoProvincia}";

        $response = Http::get($url);

        if ($response->successful()) {
            $datosTiempo = $response->json();
            $capital = null;

            //Todas las islas tienen el arrayList de ciudades vacio, y su informacion la muestran en <p>
            if(empty($datosTiempo['ciudades'])) {
                return $datosTiempo;
            }

            foreach ($datosTiempo['ciudades'] as $ciudad) {

                if ($this->normalizeString($ciudad['name']) === $this->normalizeString($capitalNombre)) {
                    $capital = $ciudad;
                    break;
                }
            }

            if (!$capital) {
                return response()->json(['error' => 'No se encontró la ciudad capital en los datos de la API'], 404);
            }

            return $capital;
        }

        return response()->json(['message' => 'Error al obtener los datos del tiempo'], 500);
    }

    private function normalizeString($str)
    {
        $str = mb_strtolower($str, 'UTF-8');
        $str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);
        $str = preg_replace('/[^a-z]/', '', $str);
        return $str;
    }
}

