export class BloqueDoble {
  constructor(config) {
    // Creo la sección con createElement y añadir dos clases para estilos
    const section = document.createElement("section");
    section.className = "w-container form"; // <-- aquí la clase 'form'

    section.innerHTML = `
      <label for="${config.input}">${config.nombre}</label>
      <input id="${config.input}" name="${config.input}" type="text" placeholder="${config.placeholderInput}">
      <label for="${config.input2}">${config.nombre2}</label>
      <input id="${config.input2}" name="${config.input2}" type="text" placeholder="${config.placeholderInput2}">
      <button id="${config.idBoton}" type="button">${config.placeholderBoton}</button>
      <button id="${config.idBotonAemet}" type="button">${config.placeholderBotonAemet}</button>
    `;

    const padre = document.getElementById(config.padre);
    padre.appendChild(section);

    // Añadir listener al botón ya insertado en el DOM
    const boton = document.getElementById(config.idBoton);
    const botonAEMET = document.getElementById(config.idBotonAemet);
    boton.addEventListener("click", config.action);
    botonAEMET.addEventListener("click", config.buscarAEMET);
  }
}