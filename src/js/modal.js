// Obtener la ventana modal
var modal = document.getElementById("myModal");
// Obtener el botón que abre la ventana modal
var btn = document.getElementById("myBtn");
// Obtener el botón de cerrar
var span = document.getElementsByClassName("close")[0];

// Cuando se haga clic en la X de cerrar, cerrar la ventana modal
span.onclick = function () {
    modal.style.display = "none";
}

// Cuando se haga clic fuera de la ventana modal, cerrarla
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function mostrarModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function cerrarModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

/**
 * Muestra un mensaje en la ventana modal
 * @param {*} mensaje 
 */
function mostrarMensaje(mensaje) {
    const modal = document.getElementById("myModal");
    const modalContent = modal.querySelector(".modal-content");
    const mensajeEl = document.createElement("p");
    mensajeEl.textContent = mensaje;
    modalContent.insertBefore(mensajeEl, modalContent.firstChild);
    modal.style.display = "block";
}