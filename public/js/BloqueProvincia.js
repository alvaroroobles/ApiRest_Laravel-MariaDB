export class BloqueProvincia {
  constructor(config) {
    // Creo la sección con createElement y añadir dos clases para estilos
    const section = document.createElement("section");
    section.className = "w-container form"; // <-- aquí la clase 'form'

    section.innerHTML = `
      <label for="${config.input}">${config.nombre}</label>
      <input id="${config.input}" name="${config.input}" type="text" placeholder="${config.placeholderInput}">
      <button id="${config.idBoton}" type="button">${config.placeholderBoton}</button>
      <button id="${config.idBotonAemet}" type="button">${config.placeholderBotonAemet}</button>
    `;

    const padre = document.getElementById(config.padre);
    padre.appendChild(section);

    // Añadir listener al botón ya insertado en el DOM
    const boton = document.getElementById(config.idBoton);
    boton.addEventListener("click", config.action);

    const botonAEMET= document.getElementById(config.idBotonAemet);
    botonAEMET.addEventListener("click", config.buscarAEMET);
  }
}