var ChromeSamples = {
  log: function () {
    var line = Array.prototype.slice.call(arguments).map(function (argument) {
      return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');
    document.querySelector('#log').textContent += line + '\n';
  },

  clearLog: function () {
    document.querySelector('#log').textContent = '';
  },

  setStatus: function (status) {
    document.querySelector('#status').textContent = status;
  },

  setContent: function (newContent) {
    var content = document.querySelector('#content');
    while (content.hasChildNodes()) {
      content.removeChild(content.lastChild);
    }
    content.appendChild(newContent);
  }
};
log = ChromeSamples.log;
if (!("NDEFReader" in window))
  ChromeSamples.setStatus("Web NFC no funciona en este dispositivo. Utiliza Chrome Android");
const { NDEFReader, NDEFWriter, NDEFRecord, NDEFMessage } = window;
//inicialización de forma global para poder cerrar y abrir el NDEFReader
let ndef = new NDEFReader();
/**
 * Lee el contenido de una etiqueta NFC y redirige a la URL guardada en la etiqueta NFC
 * @param {string} data - Contenido de la etiqueta NFC
 */
async function leerNfc() {
  try {
    //si el NDEFReader está cerrado, se abre
    if (ndef.state == "closed") {
      ndef = new NDEFReader();
    }
    //espera a que se encuentre una etiqueta NFC
    await ndef.scan();
    log("Esperando a escanear...");

    ndef.addEventListener("readingerror", () => {
      log("Error en la lectura del NFC");
    });
    ndef.addEventListener("reading", ({ message }) => {
      // Si el registro es de tipo "url"
      if (message.records[0].recordType == "url") {
        if ('toURL' in message.records[0]) {
          window.location.href = message.records[0].toURL();
        } else {
          const dataView = new DataView(message.records[0].data.buffer);
          const decoder = new TextDecoder('utf-8');
          const urlBytes = decoder.decode(dataView);
          window.location.href = urlBytes;
        }
      }
      // Si el registro es de tipo "text"
      else if (message.records[0].recordType == "text") {
        if ('toText' in message.records[0]) {
        } else {
          const dataView = new DataView(message.records[0].data.buffer);
          const decoder = new TextDecoder('utf-8');
          const textBytes = decoder.decode(dataView);
          alert(textBytes);
        }
      }
    });
  } catch (error) {
    log(error);
  } finally {
    //cierra el flujo de entrada de datos del NDEFReader
    ndef.stopScanning();
  }
}
async function escribirNfc() {
  // Obtener una referencia al botón de confirmación
  const btnConfirmar = document.getElementById('confirmar');

  // Agregar un evento al botón de confirmación
  btnConfirmar.addEventListener('click', async () => {
    // Limpia la lista de los checkbox
    checkboxesSeleccionados = [];
    // Recorrer los checkbox
    document.querySelectorAll('#checkboxes input[type="checkbox"]').forEach(checkbox => {
      // Si el checkbox está marcado, agregarlo a la lista de checkboxes seleccionados
      if (checkbox.checked) {
        checkboxesSeleccionados.push(checkbox.id);
      }
    });

    // Establecer la variable de bloqueo en verdadero
    escribiendoNfc = true;

    // Bucle hasta que se escriba una etiqueta NFC
    for (let i = 0; i < checkboxesSeleccionados.length; i++) {
      const checkboxId = checkboxesSeleccionados[i];

      // Llamar a la función escribirNfc() para cada checkbox seleccionado
      await escribirNfc(checkboxId);

      // Esperar un segundo antes de verificar si se escribió una etiqueta NFC
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Si se escribió una etiqueta NFC, salir del bucle
      if (etiquetaNfcEscrita) {
        break;
      }
    }

    // Establecer la variable de bloqueo en falso
    escribiendoNfc = false;
    // Establecer la variable de etiquetaNfcEscrita en falso
    etiquetaNfcEscrita = false;

  });

  // Variable booleana para bloquear la ejecución de la función escribirNfc()
  let escribiendoNfc = false;

  // Variable booleana para indicar si se escribió una etiqueta NFC
  let etiquetaNfcEscrita = false;

  // Lista de checkboxes seleccionados
  let checkboxesSeleccionados = [];

  /**
   * Escribe una URL en una etiqueta NFC
   * @param {string} checkboxId id del checkbox
   */
  async function escribirNfc(checkboxId) {
    //si el NDEFReader está cerrado, se abre
    if (ndef.state == "closed") {
      ndef = new NDEFReader();
    }

    if ("NDEFReader" in window) {
      try {
        const inputData = prompt(`Introduce la URL a escribir en la etiqueta NFC para el checkbox ${checkboxId} (Ej: google.es)`);
        // Espera a que se encuentre una etiqueta NFC y escribe el contenido escrito por el usuario en el prompt
        await ndef.write({
          records: [{ recordType: "url", data: "https://" + inputData }]
        }).then(() => {
          consoleLog(`Etiqueta NFC para el checkbox ${checkboxId} escrita correctamente: ${inputData}`);
          etiquetaNfcEscrita = true;
        });
      } catch (error) {
        consoleLog(`Error al escribir en la etiqueta NFC para el checkbox ${checkboxId}: ${error}`);
      } finally {
        ndef.stopScanning();
        // Establecer la variable de bloqueo en falso
        escribiendoNfc = false;
      }
    } else {
      consoleLog("Navegador no soportado");
      // Establecer la variable de bloqueo en falso
      escribiendoNfc = false;
    }
  }

}

function consoleLog(data) {
  var logElement = document.getElementById('log');
  logElement.innerHTML += data + '\n';
}
