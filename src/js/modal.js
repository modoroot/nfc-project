// Obtener la ventana modal
var modal = document.getElementById("myModal");

// Obtener el botón que abre la ventana modal
var btn = document.getElementById("myBtn");

// Obtener el botón de cerrar
var span = document.getElementsByClassName("close")[0];

// Obtener los botones Aceptar y Cerrar
var acceptBtn = document.getElementsByClassName("accept-btn")[0];
var closeBtn = document.getElementsByClassName("close-btn")[0];
var outputDiv = document.getElementById("content");

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