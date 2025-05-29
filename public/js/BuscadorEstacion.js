  export class BuscadorEstacion {
    constructor(config) {
      // Creo la sección con createElement y añadir dos clases para estilos
      const sectionStation = document.createElement("section");
      sectionStation.id = config.idcss;

      sectionStation.innerHTML = `
              <h3>Selecciona una estación</h3>
              <select id="${config.idSelect}">
                  <option name=REUS value="0016A">REUS/AEROPUERTO</option>
                  <option name=MADRID value="1082">MADRID/RETIRO</option>
                  <option name=CÓRDOBA value="3195">CÓRDOBA</option>
                  <option name=GRANADA value="3129">GRANADA/AEROPUERTO</option>
              </select>
            <button id="${config.idBoton}">Generar</button>
          </section>`;
      document.getElementById("stationContainer").appendChild(sectionStation);

      const botonBuscar = document.getElementById(config.idBoton);
      botonBuscar.addEventListener("click", config.action);
    }
  }