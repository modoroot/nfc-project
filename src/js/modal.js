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

// Cuando se haga clic en el botón, abrir la ventana modal
btn.onclick = function () {
    modal.style.display = "flex";
}

// Cuando se haga clic en la X de cerrar, cerrar la ventana modal
span.onclick = function () {
    modal.style.display = "none";
}

// Cuando se haga clic en Aceptar, guardar la URL y mostrarla en la salida
acceptBtn.onclick = function () {
    // Obtener el valor del campo de entrada de texto
    var urlInput = document.getElementById("url-input");
    var url = urlInput.value;

    // Guardar la URL en la salida
    outputDiv.innerHTML = url;

    // Cerrar la ventana modal
    modal.style.display = "none";
}

// Cuando se haga clic en Cerrar, cerrar la ventana modal
closeBtn.onclick = function () {
    modal.style.display = "none";
}

// Cuando se haga clic fuera de la ventana modal, cerrarla
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}