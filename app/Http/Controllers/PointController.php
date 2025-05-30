<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Point;
use Illuminate\Support\Facades\Log;

class PointController extends Controller
{
    public function storePointByCoords(Request $request)
    {
        try {
            $lat = $request->input('lat');
            $lon = $request->input('lon');

            $url = "https://nominatim.openstreetmap.org/reverse";

            $response = Http::withHeaders([
                'User-Agent' => 'proyectoTrevenque/1.0 (alvaro@proyectoTrevenque.com)'
            ])->get($url, [
                'lat' => $lat,
                'lon' => $lon,
                'format' => 'json',
                'addressdetails' => 1
            ]);

            if ($response->failed()) {
                Log::error('Error al obtener municipio: ' . $response->body());
                return response()->json(['error' => 'No se pudo obtener el municipio'], 500);
            }

            $data = $response->json();

            $address = $data['address'] ?? [];

            $municipio = $address['municipality']
                ?? $address['town']
                ?? $address['city']
                ?? $address['village']
                ?? $address['hamlet']
                ?? null;

                Log::info("Municipio detectado por Nominatim: $municipio");
            if (!$municipio) {
                Log::error('Municipio no encontrado en la respuesta: ' . $response->body());
                return response()->json(['error' => 'Municipio no encontrado'], 404);
            }

            // Llamada al controlador de AEMET para obtener datos climáticos
            $municipioAemetController = new MunicipioAemetController();

            $clima = $municipioAemetController->obtenerDatosClimaPorMunicipio($municipio);

            if (!$clima) {
                return response()->json(['error' => 'Datos climatológicos no encontrados'], 404);
            }

            $point = Point::create(attributes: [
                'municipio' => $municipio,
                'latitud' => $lat,
                'longitud' => $lon,
            ]);

            return response()->json([
                'success' => true,
                'municipio' => $municipio,
                'clima' => $clima,
            ]);
        } catch (\Exception $e) {
            Log::error('Excepción al guardar punto: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }
}
