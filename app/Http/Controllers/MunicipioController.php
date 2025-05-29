<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provincia;
use Illuminate\Support\Facades\Http;

class MunicipioController extends Controller
{
    public function getTiempoMunicipio($nombreProvincia, $nombreMunicipio)
    {
        $codigoProvincia_Asociada = $this->getcodigoProvincia($nombreProvincia);

        if (is_a($codigoProvincia_Asociada, 'Illuminate\Http\JsonResponse')) {
            return $codigoProvincia_Asociada; // Devuelve el error si lo hay
        }

        $url = "https://www.el-tiempo.net/api/json/v2/provincias/{$codigoProvincia_Asociada}/municipios";

        $respuesta = Http::get($url);

        if ($respuesta->successful()) {
            $ListadoMunicipios = $respuesta->json();
            $municipioBuscado = null;
            foreach ($ListadoMunicipios['municipios'] as $municipio) {
                if ($this->normalizeString($municipio['NOMBRE']) === $this->normalizeString($nombreMunicipio)) {
                    $municipioBuscado = $municipio;
                    break;
                }
            }
            //Damos un error si el municipio que hemos buscado no está en esa provincia
            if (!$municipioBuscado) {
                return response()->json(['error' => 'No se encontró el municipio en los datos de la API'], 404);
            }

            //Accedemos al codigo del municipio

            $codigoMunicipio = substr($municipioBuscado['CODIGOINE'], 0, 5);

            //Peticion HTTP de los Datos Climatológicos de municipio
            $urlMunicipio = "https://www.el-tiempo.net/api/json/v2/provincias/{$codigoProvincia_Asociada}/municipios/{$codigoMunicipio}";
            $respuestaMunicipio = Http::get($urlMunicipio);

            if ($respuestaMunicipio->successful()) {
                $datosMunicipio = $respuestaMunicipio->json();
                $indiceHoraActual = $this->getIndiceHoraActual();

                $datosActuales = [
                    'temperatura_actual' => $datosMunicipio['temperatura_actual'] ?? null,
                    'temperatura_max' => $datosMunicipio['temperaturas']['max'] ?? null,
                    'temperatura_min' => $datosMunicipio['temperaturas']['min'] ?? null,
                    'humedad' => $datosMunicipio['humedad'] ?? null,
                    'viento' => $datosMunicipio['viento'] ?? null,
                    'precipitacion' => $datosMunicipio['precipitacion'] ?? null,
                    'probabilidad_lluvia' => $datosMunicipio['lluvia'] ?? null,
                    'orto' => $datosMunicipio['pronostico']['hoy']['@attributes']['orto'] ?? null,
                    'ocaso' => $datosMunicipio['pronostico']['hoy']['@attributes']['ocaso'] ?? null,

                    //Estado del cielo para la hora actual
                    'estado_cielo_actual' => $datosMunicipio['pronostico']['hoy']['estado_cielo'][$indiceHoraActual] ?? null,

                    //Temperatura,sensación termica y humedad relativa para la hora actual
                    'temperatura_hora_actual' => $datosMunicipio['pronostico']['hoy']['temperatura'][$indiceHoraActual] ?? null,
                    'sens_termica_actual' => $datosMunicipio['pronostico']['hoy']['sens_termica'][$indiceHoraActual] ?? null,
                    'humedad_relativa_actual' => $datosMunicipio['pronostico']['hoy']['humedad_relativa'][$indiceHoraActual] ?? null,
                ];

                return response()->json($datosActuales);
                //return view('datosProvincia', ['datosActuales' => $datosActuales,]);

            }
        }
    }

    private function getcodigoProvincia($nombreProvincia)
    {
        if (!$nombreProvincia || !is_string($nombreProvincia)) {
            return response()->json(['error' => 'Parámetro provincia inválido'], 400);
        }

        $provinciaModel = Provincia::where('NOMBRE_PROVINCIA', 'like', '%' . $nombreProvincia . '%')->first();

        if (!$provinciaModel) {
            return response()->json(['error' => 'No se encontro la provincia'], 404);
        }

        $codigoProvincia = $provinciaModel->CODPROV;

        return $codigoProvincia;
    }

    private function normalizeString($str)
    {
        $str = mb_strtolower($str, 'UTF-8');
        $str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);
        $str = preg_replace('/[^a-z]/', '', $str);
        return $str;
    }

    //Necesitamos saber la hora actual,ya que hay datos que vienen en un arrayList de 24 posiciones,una para cada hora.
    private function getIndiceHoraActual(): int
    {
        return (int) date('G'); // Hora actual (0-23)
    }


}
