<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('municipios_aemet', function (Blueprint $table) {
            $table->id();
            $table->string('codauto', 10)->nullable();    // CODAUTO, nullable
            $table->string('cpro', 2);                    // Código provincia: 2 dígitos
            $table->string('cmun', 3);                    // Código municipio: 3 dígitos
            $table->string('dc', 1)->nullable();          // Dígito control, nullable
            $table->string('nombre');                      // Nombre municipio
            $table->string('codigo_municipio', 5)->unique(); // Concatenación cpro + cmun para la API
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('municipios_aemet');
    }
};

