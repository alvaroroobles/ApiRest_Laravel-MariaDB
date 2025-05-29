import { BloqueCCAA } from "./BloqueCCAA.js";
import { BloqueDoble } from "./BloqueDoble.js";
import { BloqueClima } from "./BloqueClima.js";
import { BloqueProvincia } from "./BloqueProvincia.js";
import { BuscadorEstacion } from "./BuscadorEstacion.js";
import { Grafica } from "./Grafica.js";

// Variables del mapa de Leaflet para su carga
const mapaLeafet = L.map('map').setView([40.4166, -3.7037], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(mapaLeafet);


// Sacamos el token CSRF una vez, una especie de API KEY que nos obliga a introducir LARAVEL al hacer un POST.
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Función para guardar los datos
mapaLeafet.on('click', function (e) {
  const lat = e.latlng.lat.toFixed(6);
  const lon = e.latlng.lng.toFixed(6);

  fetch('/guardar-punto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify({ lat, lon })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        // Mostrar error en popup
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`<b>Error:</b> ${data.error}`)
          .openOn(mapaLeafet);
      } else {
        // Mostrar municipio y datos climáticos (adaptar según estructura del JSON)
        const municipio = normalizarNombreProvincia(data.municipio);
        console.log(municipio);
        const clima = data.clima;
        const contenidoPopup = BloqueClima.crearContenidoPopupClima(clima, municipio);
        L.popup()
          .setLatLng(e.latlng)
          .setContent(contenidoPopup)
          .openOn(mapaLeafet);
      }
    })
    .catch(err => {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<b>Error de red:</b> ${err.message}`)
        .openOn(mapaLeafet);
    });
});





const contenedor = document.createElement('div');
contenedor.id = 'section-container';
document.getElementById('botones').appendChild(contenedor);

//Creamos un contenedor para los resultados,para aplicarle la clase de flex
const containerResultados = document.createElement('div');
containerResultados.className = 'container-resultados form';

document.getElementById('resultadoBusqueda').appendChild(containerResultados);

//Crea un elemento div para mostrar los resultados y lo añade al body
const resultados = document.createElement('div');
// Asignamos clase para css
resultados.className = 'resultados';
resultados.id = 'resultado-clima';
containerResultados.appendChild(resultados);



const bloqueProvincias = new BloqueProvincia({
  padre: "section-container",
  nombre: "Buscar el tiempo de su provincia",
  input: "provincia",
  idBoton: "botonProvincia",
  idBotonAemet: "botonAemetProvincia",
  placeholderInput: "Inserte su provincia",
  placeholderBoton: "Buscar en eltiempo.net",
  placeholderBotonAemet: "Buscar en AEMET",
  action: function () {
    const input = document.getElementById("provincia");
    const provincia = input.value.trim();

    if (provincia === "") {
      alert("Por favor, introduce una provincia");
      return;
    }

    const url = `/tiempo/${provincia}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error,no se encontró la provincia');
        }
        return response.json();
      })
      .then(data => {
        if (('ciudades' in data)) {
          BloqueClima.mostrarIsla(data, provincia);
        } else {
          BloqueClima.mostrarProvincia(data, provincia);
        }
        document.getElementById('provincia').value = "";
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
      })
      .catch(error => {
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
        document.getElementById('resultado-clima').innerHTML = `<p style="color:red;">${error.message}</p>`;
      });
  },

  buscarAEMET: function () {
    const input = document.getElementById("provincia");
    const provincia = input.value.trim();
    const provinciaArreglada=normalizarNombreProvincia(provincia);

    if (provincia === "") {
      alert("Por favor, introduce una provincia");
      return;
    }

    const url = `/tiempo/AEMET/${provincia}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error,no se encontró la provincia');
        }
        return response.json();
      })
      .then(data => {
        BloqueClima.mostrarProvinciaAEMET(data, provinciaArreglada,BloqueClima.obtenerFechaHoy());
        document.getElementById('provincia').value = "";
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
      })
      .catch(error => {
        console.log(provincia);
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
        document.getElementById('resultado-clima').innerHTML = `<p style="color:red;">${error.message},</p>`;
      });
  },
});


const bloqueCCAA = new BloqueCCAA({
  padre: "section-container",
  nombre: "Comunidad Autónoma",
  input: "ccaa",
  idBoton: "botonCCAA",
  placeholderInput: "Inserte su comunidad autónoma",
  placeholderBoton: "Buscar en eltiempo.net",
  action: async function () {
    const input = document.getElementById("ccaa");
    const autonomy = input.value.trim();

    if (autonomy === "") {
      alert("Por favor, introduce una comunidad autónoma");
      return;
    }

    const url = `/tiempo/CCAA/${encodeURIComponent(autonomy)}`;

    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error en la petición: ${response.status}`);
        } else {
          const text = await response.text();
          throw new Error(`Error en la petición: ${response.status}. Respuesta no JSON: ${text.slice(0, 100)}...`);
        }
      }

      const data = await response.json();

      const contenedor = document.getElementById('resultado-clima');
      contenedor.innerHTML = ''; // Limpiar resultados previos
      contenedor.style.backgroundColor = 'wheat'; // Cambiar fondo

      if (data.provincias && data.provincias.length > 0) {
        for (const provincia of data.provincias) {
          try {
            const nombreNormalizado = normalizarNombreProvincia(provincia.NOMBRE_PROVINCIA);
            const res = await fetch(`/tiempo/${encodeURIComponent(nombreNormalizado)}`);
            if (!res.ok) throw new Error(`Error al obtener datos para ${nombreNormalizado}`);
            const datosProvincia = await res.json();
            BloqueClima.agregarProvincia(datosProvincia, nombreNormalizado);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        contenedor.innerHTML = '<p>No se encontraron provincias.</p>';
      }

      input.value = ""; // Vaciar input al finalizar

    } catch (error) {
      document.getElementById('resultado-clima').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  }
});

function normalizarNombreProvincia(nombre) {
  if (nombre.includes("/")) {
    // Nos quedamos con el nombre más común (el segundo, en español)
    return nombre.split("/")[1].trim();
  }
  return nombre.trim();
}

const bloqueMunicipio = new BloqueDoble({
  padre: "section-container",
  nombre: "Provincia",
  nombre2: "Municipio",
  input: "provinciaMunicipal",
  input2: "municipio",
  idBoton: "botonMunicipio",
  idBotonAemet: "botonMunicipioAemet",
  placeholderInput: "Inserte su provincia",
  placeholderInput2: "Inserte su municipio",
  placeholderBoton: "Buscar en eltiempo.net",
  placeholderBotonAemet: "Buscar en AEMET",
  action: function () {
    const nombreProvincia = document.getElementById("provinciaMunicipal").value.trim();
    const nombreMunicipio = document.getElementById("municipio").value.trim();

    if (nombreProvincia === "" || nombreMunicipio === "") {
      alert("Por favor, introduce una provincia y un municipio");
      return;
    }

    const url = `/tiempo/${nombreProvincia}/${nombreMunicipio}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error, la provincia o el municipio no existen o no se encontró la información');
        }
        return response.json();
      })
      .then(data => {
        BloqueClima.mostrarMunicipio(data, nombreProvincia, nombreMunicipio);
        document.getElementById("provinciaMunicipal").value = "";
        document.getElementById("municipio").value = "";
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
      })
      .catch(error => {
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
        document.getElementById('resultado-clima').innerHTML = `<p style="color:red;">${error.message}</p>`;
      });
  },
  buscarAEMET: function () {
    const input = document.getElementById("municipio");
    const municipio = input.value.trim();

    if (municipio === "") {
      alert("Por favor, introduce una provincia");
      return;
    }

    const url = `/tiempo/AEMET/${municipio}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error,no se encontró el municipio');
        }
        return response.json();
      })
      .then(data => {
        BloqueClima.mostrarProvinciaAEMET(data, municipio,BloqueClima.obtenerFechaHoy());
        document.getElementById('provincia').value = "";
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
      })
      .catch(error => {
        document.getElementById('resultado-clima').style.backgroundColor = 'wheat';
        document.getElementById('resultado-clima').innerHTML = `<p style="color:red;">${error.message}</p>`;
      });
  },
});

const buscadorEstacion = new BuscadorEstacion({
  idSelect: "idema-station",
  idBoton: "botonEstacion",
  idcss: "station",

  action: function () {
    const input = document.getElementById("idema-station");
    const codigoIdema = input.value.trim();

    if (codigoIdema === "") {
      alert("Por favor, introduce una estación");
      return;
    }

    const url = `/datosGlobales/${codigoIdema}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error, no se encontró la estación');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos recibidos (array):", data);
        if (data.length === 0) {
          throw new Error("No hay datos en el array");
        }

        // Llamamos a la función para generar la gráfica
          generarGrafica(data, data.length, "chartTemp","e_min","e_md","e_max","Datos acerca de la Temperatura (°C)","Obtenidos de AEMET","Grados Celsius","Temperatura");
          generarGrafica(data, data.length, "chartEvap","evap_min","evap_md","evap_max","Datos acerca de la Evaporación (mm)","Obtenidos de AEMET","mm3/h","Evaporación");
        })
        .catch(error => {
          document.getElementById("chartTemp").innerHTML = `<p style="color:red;">${error.message}</p>`;
        });
    },
  });

  function generarGrafica(data, n, idContainer = "chartContainer", minKey, medKey, maxKey,titleRequested,xlabelRequested,ylabelRequested,generalLabel) {
  let minima = Infinity;
  let maxima = -Infinity;
  let sumaMed = 0, sumaMin = 0, sumaMax = 0;
    console.log(titleRequested);
  for (let i = 0; i < n; i++) {
    const item = data[i];

    const min = parseFloat(item[minKey]) / 10 || 0;
    const med = parseFloat(item[medKey]) / 10 || 0;
    const max = parseFloat(item[maxKey]) / 10 || 0;

    if (min < minima) minima = min;
    if (max > maxima) maxima = max;

    sumaMed += med;
    sumaMin += min;
    sumaMax += max;
  }

  const mediaMed = n > 0 ? sumaMed / n : 0;
  const promedioMin = n > 0 ? sumaMin / n : 0;
  const promedioMax = n > 0 ? sumaMax / n : 0;

  new Grafica({
    idContainer,
    labels: [generalLabel],
    datasets: [
      { label: "Mínima Absoluta", data: [minima], color: "rgba(1, 5, 255, 0.7)" },
      { label: "Mínima Promedio", data: [promedioMin], color: "rgba(9, 238, 162, 0.7)" },
      { label: "Promedio de la Estación", data: [mediaMed], color: "rgba(18, 240, 55, 0.7)" },
      { label: "Máximo promedio", data: [promedioMax], color: "rgba(216, 153, 17, 0.7)" },
      { label: "Máxima Absoluta", data: [maxima], color: "rgba(255, 1, 1, 0.7)" },
    ],
    title: titleRequested,
    xLabel: xlabelRequested,
    yLabel: ylabelRequested,
  });
}







