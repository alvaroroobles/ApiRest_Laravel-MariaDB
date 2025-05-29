export class BloqueClima {

  static JsonAEMET = null;
  static fechaMostrada = null;
  static provinciaSeleccionada = ""


  static mostrarMunicipio(data, provincia, municipio) {
    const contenedor = document.getElementById('resultado-clima');

    if (data.error) {
      contenedor.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
      this._agregarBotonSalir();
      return;
    }

    contenedor.innerHTML = `
      <h3>Datos meteorológicos para ${municipio}, ${provincia}</h3>
      <ul>
        <li>Temperatura actual: ${data.temperatura_actual ?? 'N/A'} °C</li>
        <li>Temperatura máxima: ${data.temperatura_max ?? 'N/A'} °C</li>
        <li>Temperatura mínima: ${data.temperatura_min ?? 'N/A'} °C</li>
        <li>Humedad: ${data.humedad ?? 'N/A'} %</li>
        <li>Viento: ${data.viento ?? 'N/A'}</li>
        <li>Precipitación: ${data.precipitacion ?? 'N/A'}</li>
        <li>Probabilidad de lluvia: ${data.probabilidad_lluvia ?? 'N/A'}</li>
        <li>Orto: ${data.orto ?? 'N/A'}</li>
        <li>Ocaso: ${data.ocaso ?? 'N/A'}</li>
        <li>Estado del cielo actual: ${data.estado_cielo_actual ?? 'N/A'}</li>
        <li>Temperatura hora actual: ${data.temperatura_hora_actual ?? 'N/A'} °C</li>
        <li>Sensación térmica actual: ${data.sens_termica_actual ?? 'N/A'} °C</li>
        <li>Humedad relativa actual: ${data.humedad_relativa_actual ?? 'N/A'} %</li>
      </ul>
    `;

    this._agregarBotonSalir();
  }

  static mostrarIsla(data, isla) {
    const contenedor = document.getElementById('resultado-clima');

    if (data.error) {
      contenedor.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
      this._agregarBotonSalir();
      return;
    }
    const fraseCorta = data.today.p[0].split('.')[0] + '.';
    const oracionLimpia = this.fixEncoding(fraseCorta);
    contenedor.innerHTML = `
      <h3>Datos meteorológicos para ${isla}</h3>
      <p> ${oracionLimpia}</p>
    `;

    this._agregarBotonSalir();
  }



  static mostrarProvincia(data, provincia) {
    const contenedor = document.getElementById('resultado-clima');

    if (data.error) {
      contenedor.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
      this._agregarBotonSalir();
      return;
    }

    contenedor.innerHTML = `
      <h3>Datos meteorológicos para ${data.name}</h3>
      <ul>
        <li>Temperatura máxima: ${data.temperatures?.max ?? 'N/A'} °C</li>
        <li>Temperatura mínima: ${data.temperatures?.min ?? 'N/A'} °C</li>
        <li>Estado del cielo actual: ${data.stateSky?.description ?? 'N/A'}</li>
      </ul>
    `;

    this._agregarBotonSalir();
  }

  static mostrarProvinciaAEMET(datos, provincia, fecha) {
    const datosDiarios = this.filtrarDatosPorFecha(datos, fecha);

    const contenedor = document.getElementById('resultado-clima');
    if (!contenedor) return;

    if (!datos || datos.length === 0 || datosDiarios.length === 0) {
      contenedor.innerHTML = "<p>No hay datos para hoy.</p>";
      this._agregarBotonSalir();
      return;
    }
    const dia = datosDiarios[0]; // solo el primer día

    const fechaHoy = dia.fecha ? dia.fecha.split('T')[0] : "Fecha no disponible";
    const tempMax = dia.temperatura?.maxima ?? "N/A";
    const tempMin = dia.temperatura?.minima ?? "N/A";
    const estadoCieloDesc = dia.estadoCielo?.[2]?.descripcion ?? "No disponible";
    const probPrec = dia.probPrecipitacion?.[0]?.value ?? "N/A";
    const humedadRelativaMax = dia.humedadRelativa?.maxima ?? "N/A";
    const humedadRelativaMin = dia.humedadRelativa?.minima ?? "N/A";

    contenedor.innerHTML = `
      <h3>Datos meteorológicos para: ${provincia}</h3>
      <p>Fecha: ${fecha}</p>
      <p>Temperatura máxima: ${tempMax}°C</p>
      <p>Temperatura mínima: ${tempMin}°C</p>
      <p>Estado del cielo: ${estadoCieloDesc}</p>
      <p>Probabilidad de precipitación: ${probPrec}%</p>
      <p>Humedad Relativa máxima: ${humedadRelativaMax}%</p>
      <p>Humedad Relativa mínima: ${humedadRelativaMin}%</p>
    `;
    this.JsonAEMET = datos;
    this.provinciaSeleccionada = provincia;
    this.fechaMostrada = fecha;
    this.agregarBotonDiaAnterior();
    this.agregarBotonSiguienteDia();
    this._agregarBotonSalir();
  }

  static obtenerFechaHoy() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  static filtrarDatosPorFecha(datos, fechaBuscada) {
    if (!datos.length || !datos[0].prediccion || !datos[0].prediccion.dia) {
      console.warn("⚠️ No hay datos o estructura incorrecta.");
      return [];
    }

    const dias = datos[0].prediccion.dia;

    return dias.filter(dia => {
      if (!dia.fecha) return false;
      const fechaSolo = dia.fecha.split('T')[0];
      return fechaSolo === fechaBuscada;
    });
  }

  static siguienteDia() {
    const partes = this.fechaMostrada.split('-');
    const fechaActual = new Date(partes[0], partes[1] - 1, partes[2]);

    // Sumar un día
    fechaActual.setDate(fechaActual.getDate() + 1);

    // Formatear
    const yyyy = fechaActual.getFullYear();
    const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaActual.getDate()).padStart(2, '0');
    const nuevaFecha = `${yyyy}-${mm}-${dd}`;

    // Mostrar datos del nuevo día
    this.mostrarProvinciaAEMET(this.JsonAEMET, this.provinciaSeleccionada, nuevaFecha);
  }

  static anteriorDia() {
    const partes = this.fechaMostrada.split('-');
    const fechaActual = new Date(partes[0], partes[1] - 1, partes[2]);
    // Restar un día
    fechaActual.setDate(fechaActual.getDate() - 1);

    // Formatear
    const yyyy = fechaActual.getFullYear();
    const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaActual.getDate()).padStart(2, '0');
    const nuevaFecha = `${yyyy}-${mm}-${dd}`;

    // Mostrar datos del nuevo día
    this.mostrarProvinciaAEMET(this.JsonAEMET, this.provinciaSeleccionada, nuevaFecha);
  }









  static agregarProvincia(data, provincia) {
    const contenedor = document.getElementById('resultado-clima');
    this._agregarBotonSalir();

    if (data.error) {
      contenedor.insertAdjacentHTML('beforeend', `<p style="color:red;">Error: ${data.error}</p>`);
      this._agregarBotonSalir();
      return;
    }

    contenedor.insertAdjacentHTML('beforeend', `
      <h3>Datos meteorológicos para ${provincia}</h3>
      <ul>
        <li>Temperatura máxima: ${data.temperatures?.max ?? 'N/A'} °C</li>
        <li>Temperatura mínima: ${data.temperatures?.min ?? 'N/A'} °C</li>
        <li>Estado del cielo actual: ${data.stateSky?.description ?? 'N/A'}</li>
      </ul>
    `);


  }


  static salir() {
    const contenedor = document.getElementById('resultado-clima');
    if (contenedor) {
      contenedor.innerHTML = '';
      contenedor.style.backgroundColor = '';
      this.JsonAEMET = null;
      this.provinciaSeleccionada = "";
      this.fechaMostrada = null;
    }
  }

  // Método privado para añadir botón salir
  static _agregarBotonSalir() {
    const contenedor = document.getElementById('resultado-clima');;
    if (!contenedor) return;

    // Crear el botón solo si no existe (por si acaso)
    if (!document.getElementById('botonSalir')) {
      const botonSalir = document.createElement('button');
      botonSalir.id = 'botonSalir';
      botonSalir.type = 'button';
      botonSalir.textContent = 'Salir';
      botonSalir.addEventListener('click', () => BloqueClima.salir());
      contenedor.appendChild(botonSalir);
    }
  }


  static agregarBotonDiaAnterior() {
    const contenedor = document.getElementById('resultado-clima');
    if (!contenedor) return;

    // Crear el botón solo si no existe (por si acaso)
    if (!document.getElementById('botonDiaAnterior')) {
      const botonDiaAnterior = document.createElement('button');
      botonDiaAnterior.id = 'botonDiaAnterior';
      botonDiaAnterior.type = 'button';
      botonDiaAnterior.textContent = 'Dia Anterior';
      botonDiaAnterior.addEventListener('click', () => BloqueClima.anteriorDia());
      contenedor.appendChild(botonDiaAnterior);
    }
  }


  //Metodo para añadir boton de siguiente dia
  static agregarBotonSiguienteDia() {
    const contenedor = document.getElementById('resultado-clima');
    if (!contenedor) return;

    // Crear el botón solo si no existe (por si acaso)
    if (!document.getElementById('botonSiguienteDia')) {
      const botonSiguienteDia = document.createElement('button');
      botonSiguienteDia.id = 'botonSiguienteDia';
      botonSiguienteDia.type = 'button';
      botonSiguienteDia.textContent = 'Siguiente Día';
      botonSiguienteDia.addEventListener('click', () => BloqueClima.siguienteDia());
      contenedor.appendChild(botonSiguienteDia);
    }
  }

  static crearContenidoPopupClima(clima, municipio) {
    if (!clima || clima.length === 0) {
      return `<p>No hay datos climáticos disponibles para ${municipio}.</p>`;
    }

    // Extraemos los datos para la fecha actual
    const fechaHoy = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const dias = clima[0]?.prediccion?.dia ?? [];

    const datosHoy = dias.find(dia => dia.fecha?.startsWith(fechaHoy));

    if (!datosHoy) {
      return `<p>No hay datos climáticos para hoy en ${municipio}.</p>`;
    }

    const fecha = datosHoy.fecha ? datosHoy.fecha.split('T')[0] : "Fecha no disponible";
    const tempMax = datosHoy.temperatura?.maxima ?? "N/A";
    const tempMin = datosHoy.temperatura?.minima ?? "N/A";
    const estadoCieloDesc = datosHoy.estadoCielo?.[0]?.descripcion ?? "No disponible";
    const probPrec = datosHoy.probPrecipitacion?.[0]?.value ?? "N/A";
    const humedadRelativaMax = datosHoy.humedadRelativa?.maxima ?? "N/A";
    const humedadRelativaMin = datosHoy.humedadRelativa?.minima ?? "N/A";

    return `
    <h3>Datos meteorológicos para: ${municipio}</h3>
    <p>Fecha: ${fecha}</p>
    <p>Temperatura máxima: ${tempMax}°C</p>
    <p>Temperatura mínima: ${tempMin}°C</p>
    <p>Estado del cielo: ${estadoCieloDesc}</p>
    <p>Probabilidad de precipitación: ${probPrec}%</p>
    <p>Humedad Relativa máxima: ${humedadRelativaMax}%</p>
    <p>Humedad Relativa mínima: ${humedadRelativaMin}%</p>
  `;
  }

  static fixEncoding(str) {
    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  }


}
