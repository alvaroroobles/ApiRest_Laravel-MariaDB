<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\Autonomy;

class AutonomyController extends Controller
{
    public function getAutonomyClimate($autonomy){

        if (!$autonomy || !is_string($autonomy)) {
            return response()->json(['error' => 'Parámetro de autonomía inválido'], 400);
        }

        $searchedAutonomy = Autonomy::where('NOMBRE_AUTONOMA', 'like', '%' . $autonomy . '%')->first();

        if (!$searchedAutonomy) {
            return response()->json(['error' => 'No se encontró la comunidad autónoma en los datos de la API'], 404);
        }

        try {
            $url = "https://www.el-tiempo.net/api/json/v2/provincias";
            $response = Http::get($url);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Error al obtener datos de la API externa',
                    'status' => $response->status()
                ], 500);
            }

            $listadoProvincias = $response->json();

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Excepción capturada: ' . $e->getMessage()
            ], 500);
        }

        $searchedCode = (string) $searchedAutonomy->CODAUT;

        $provinciasFiltradas = collect($listadoProvincias['provincias'])->filter(function ($provincia) use ($searchedCode) {
            return (string) $provincia['CODAUTON'] === $searchedCode;
        })->values();

        if ($provinciasFiltradas->isEmpty()) {
            return response()->json(['error' => 'No se encontraron provincias para esa comunidad autónoma'], 404);
        }

        return response()->json([
            'autonomia' => $searchedAutonomy->NOMBRE_AUTONOMA,
            'provincias' => $provinciasFiltradas
        ]);
    }

    public function normalizeString($str)
    {
        $str = mb_strtolower($str, 'UTF-8');
        $str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);
        $str = preg_replace('/[^a-z]/', '', $str);
        return $str;
    }
}



