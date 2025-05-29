<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Tiempo</title>
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>

<body>
    <header id="header">
        <img src="{{ asset('images/logo_web.png') }}" width="100" height="100" alt="Logo" />
        @include('navbar')
    </header>

    <div id="background">
        <h2>Descubre el clima de tu zona</h2>
        <button id="cta-button">Saber más</button>
    </div>

    <section class="separator" id="sep1">
        <h2>Herramienta del tiempo</h2>
        <p>Para conocer datos acerca del clima en su zona, utilice las 3 opciones disponibles: </p>
    </section>

    <section id="botones"></section>
    <section id="resultadoBusqueda"></section>
    <section class="separator" id="sep2">
        <h2>Mapa de España</h2>
        <p>¡Haga click en el Mapa para conocer los datos de su zona!</p>
    </section>

    <section id="map-container">
        <div id="map"></div>
    </section>

    <section class="separator" id="sep3">
        <h2>Gráfica de la Estación Meteorológica</h2>
        <p>Selecciona tu estación favorita y dale click a generar para ver su gráfica</p>
    </section>

    <section id="stationContainer"> </section>


    <!-- Graficas -->
    <section id="chartGroup">
        <section id="chartTemp"></section>
        <div id="chartEvap"></div>
    </section>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script type="module" src="{{ asset('js/nuevaRest.js') }}"></script>
</body>

</html>