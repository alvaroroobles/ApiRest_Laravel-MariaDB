<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use App\Models\MunicipioAemet;
use Illuminate\Support\Facades\Log;

class MunicipioAemetController extends Controller
{
    // Método que devuelve solo los datos o null en error
    public function obtenerDatosClimaPorMunicipio(string $nombreMunicipio): ?array
    {
        // Normalizar nombre recibido para evitar problemas con espacios y barras
        $nombreMunicipio = trim($nombreMunicipio);
        $nombreMunicipio = str_replace(' / ', '/', $nombreMunicipio);

        // Primero: búsqueda exacta
        $municipioSolicitado = MunicipioAemet::where('nombre', $nombreMunicipio)->first();

        // Si no encuentra, busca por coincidencia parcial en nombres alternativos
        if (!$municipioSolicitado) {
            // Dividir el nombre recibido en partes por '/'
            $partesNombre = explode('/', $nombreMunicipio);

            $municipioSolicitado = MunicipioAemet::get()->first(function ($m) use ($partesNombre) {
                // Dividir el nombre del municipio en la BD en partes por '/'
                $nombresAlternativos = explode('/', $m->nombre);

                // Comprobar si alguna parte del nombre recibido coincide con algún nombre alternativo en la BD
                foreach ($partesNombre as $parte) {
                    foreach ($nombresAlternativos as $alternativo) {
                        if (strcasecmp(trim($alternativo), trim($parte)) === 0) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        if (!$municipioSolicitado) {
            return null;
        }

        $codigoMunicipioURL = $municipioSolicitado->codigo_municipio;
        $apiKey = env('AEMET_API_KEY');

        $url = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/{$codigoMunicipioURL}";

        try {
            $response = Http::withHeaders([
                'accept' => 'application/json',
                'api_key' => $apiKey,
            ])->get($url);

            if ($response->failed()) {
                Log::error("Error al obtener datos AEMET (1ª llamada): código {$codigoMunicipioURL}, status {$response->status()}");
                return null;
            }

            $jsonTemporal = $response->json();

            if (!isset($jsonTemporal['datos'])) {
                Log::error("Respuesta sin 'datos' de AEMET para código {$codigoMunicipioURL}");
                return null;
            }

            $urlDefinitiva = $jsonTemporal['datos'];

            $jsonFinal = Http::withHeaders([
                'accept' => 'application/json',
                'api_key' => $apiKey,
            ])->get($urlDefinitiva);

            if ($jsonFinal->failed()) {
                Log::error("Error al obtener datos AEMET (2ª llamada): código {$codigoMunicipioURL}, status {$jsonFinal->status()}");
                return null;
            }

            $jsonStringLimpio = trim(mb_convert_encoding($jsonFinal->body(), 'UTF-8', 'UTF-8'));
            $datosClimatologicos = json_decode($jsonStringLimpio, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("Error JSON en datos AEMET para código {$codigoMunicipioURL}: " . json_last_error_msg());
                return null;
            }

            return $datosClimatologicos;

        } catch (\Exception $e) {
            Log::error("Excepción al obtener datos AEMET para código {$codigoMunicipioURL}: " . $e->getMessage());
            return null;
        }
    }


    // Método para responder vía API (Lo del Mapa);
    public function getTiempoMunicipio($nombreMunicipio)
    {
        // Normalizar nombre recibido también aquí, por si acaso
        $nombreMunicipio = trim($nombreMunicipio);
        $nombreMunicipio = str_replace(' / ', '/', $nombreMunicipio);

        $datos = $this->obtenerDatosClimaPorMunicipio($nombreMunicipio);

        if (!$datos) {
            return response()->json(['error' => 'Datos climatológicos no encontrados'], 404);
        }
        return response()->json($datos);
    }

    public function getDatosGlobales($codigoIdema)
    {
        try {
            $apiKey = env('AEMET_API_KEY');
            $urlInicial = "https://opendata.aemet.es/opendata/api/valores/climatologicos/normales/estacion/{$codigoIdema}";

            $responseInicial = Http::withHeaders([
                'accept' => 'application/json',
                'api_key' => $apiKey,
            ])->get($urlInicial);

            if ($responseInicial->failed()) {
                Log::error("Error al obtener datos AEMET (1ª llamada): código {$codigoIdema}, status {$responseInicial->status()}");
                return null;
            }

            $jsonTemporal = $responseInicial->json();

            if (!isset($jsonTemporal['datos'])) {
                Log::error("Respuesta sin 'datos' de AEMET para código {$codigoIdema}");
                return null;
            }

            $urlDefinitiva = $jsonTemporal['datos'];

            $jsonFinal = Http::withHeaders([
                'accept' => 'application/json',
                'api_key' => $apiKey,
            ])->get($urlDefinitiva);

            if ($jsonFinal->failed()) {
                Log::error("Error al obtener datos AEMET (2ª llamada): código {$codigoIdema}, status {$jsonFinal->status()}");
                return null;
            }

            $jsonStringLimpio = trim(mb_convert_encoding($jsonFinal->body(), 'UTF-8', 'UTF-8'));

            $datosEstaciones = json_decode($jsonStringLimpio, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("Error JSON en datos AEMET para código {$codigoIdema}: " . json_last_error_msg());
                return null;
            }

            return $datosEstaciones;

        } catch (\Exception $e) {
            Log::error("Excepción al obtener datos AEMET para código {$codigoIdema}: " . $e->getMessage());
            return null;
        }
    }

}
