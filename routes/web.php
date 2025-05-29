<?php

use App\Http\Controllers\AutonomyController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\MunicipioAemetController;
use App\Http\Controllers\PointController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('inicio');
Route::get('/tiempo/AEMET/{municipio}', [MunicipioAemetController::class, 'obtenerDatosClimaPorMunicipio'])->name('municipioAemet');
Route::get('/tiempo/CCAA/{autonomy}', [AutonomyController::class, 'getAutonomyClimate'])->name('autonomy');
Route::get('/tiempo/{provincia}/{municipio}', [MunicipioController::class, 'getTiempoMunicipio'])->name('municipio');
Route::get('/tiempo/{provincia}', [ProvinciaController::class, 'getCodigoProvincia'])->name('provincia');
Route::post('/guardar-punto', [PointController::class, 'storePointByCoords']);
Route::get('/datosGlobales/{codigoIdema}', [MunicipioAemetController::class, 'getDatosGlobales'])->name('datosGlobales');	