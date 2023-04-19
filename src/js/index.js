var ChromeSamples = {
  log: function () {
    var line = Array.prototype.slice.call(arguments).map(function (argument) {
      return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');
    document.querySelector('#log').textContent += line + '\n';
  },
  setStatus: function (status) {
    document.querySelector('#status').textContent = status;
  },
};

log = ChromeSamples.log;
if (!("NDEFReader" in window))
  ChromeSamples.setStatus("Web NFC no funciona en este dispositivo. Utiliza Chrome Android");

const { NDEFReader, NDEFWriter, NDEFRecord, NDEFMessage } = window;
//inicialización de forma global para poder cerrar y abrir el NDEFReader
let ndef = new NDEFReader();

// Variable booleana para bloquear la ejecución de la función escribirNfc()
let escribiendoNfc = false;

// Variable booleana para indicar si se escribió una etiqueta NFC
let etiquetaNfcEscrita = false;

// Lista de checkboxes seleccionados
let checkboxesSeleccionados = [];
/**
 * Lee el contenido de una etiqueta NFC
 * @param {string} data 
 */
async function leerNfc() {
  try {
    ndef = new NDEFReader();
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
    });
  } catch (error) {
    log(error);
  }
}

// Obtener una referencia a los botones
const btnConfirmar = document.getElementById('confirmar');
const btnEscrituraRapida = document.getElementById('escritura-rapida');

async function recorrerArrayCheckBox(escribirRapido = false) {
  // Limpia la lista de los checkbox
  checkboxesSeleccionados = [];
  // Recorrer los checkbox
  document.querySelectorAll('#checkboxes input[type="checkbox"]').forEach(checkbox => {
    // Si el checkbox está marcado, agregarlo a la lista de checkboxes seleccionados
    if (checkbox.checked) {
      checkboxesSeleccionados.push(checkbox.id);
    }
  });

  // Establece la variable de bloqueo en verdadero
  escribiendoNfc = true;

  // Bucle hasta que se escriba una etiqueta NFC
  for (let i = 0; i < checkboxesSeleccionados.length; i++) {
    const checkboxId = checkboxesSeleccionados[i];
    console.log("checkbox: " + checkboxId);
    // Llama a la función correspondiente para cada checkbox seleccionado
    if (escribirRapido) {
      await escrituraRapidaNfc(checkboxId);
    } else {
      await escribirNfc(checkboxId);
    }
    // Espera un segundo antes de verificar si se escribió una etiqueta NFC
    await new Promise(resolve => setTimeout(resolve, 1000));

  }

  // Establecer la variable de bloqueo en falso
  escribiendoNfc = false;
  // Establecer la variable de etiquetaNfcEscrita en falso
  etiquetaNfcEscrita = false;
}

// Agregar eventos a los botones de confirmación
btnConfirmar.addEventListener('click', async () => {
  await recorrerArrayCheckBox();
});

// Agregar evento al botón de escritura rápida
btnEscrituraRapida.addEventListener('click', async () => {
  await recorrerArrayCheckBox(true);
});

/**
 * Escribe una URL en una etiqueta NFC
 * @param {*} checkboxId id del checbox actual
 */
async function escribirNfc(checkboxId) {
  ndef = new NDEFReader();
  if ("NDEFReader" in window) {
    try {
      const inputData = prompt(`Introduce la URL a escribir en la etiqueta NFC para el checkbox ${checkboxId} (Ej: google.es)`);
      // Espera a que se encuentre una etiqueta NFC y escribe el contenido escrito por el usuario en el prompt
      await ndef.write({
        records: [{ recordType: "url", data: "https://" + inputData },
                  { recordType: "text", data: checkboxId }
      ]
      }).then(() => {
        consoleLog(`Etiqueta NFC para el checkbox ${checkboxId} escrita correctamente: ${inputData}`);
        etiquetaNfcEscrita = true;
      });
    } catch (error) {
      consoleLog(`Error al escribir en la etiqueta NFC para el checkbox ${checkboxId}: ${error}`);
    } finally {
      // Establecer la variable de bloqueo en falso
      escribiendoNfc = false;
    }
    ndef.scan();
  } else {
    consoleLog("Navegador no soportado");
    // Establecer la variable de bloqueo en falso
    escribiendoNfc = false;
  }
}
/**
 * Escribe una lista entera de NFC de forma seguida
 * @param {*} checkboxId id del checkbox actual
 */
async function escrituraRapidaNfc(checkboxId) {
  ndef = new NDEFReader();
  if ("NDEFReader" in window) {
    try {
      mostrarModal();
      // Espera a que se encuentre una etiqueta NFC y escribe el contenido escrito por el usuario en el prompt
      await ndef.write({
        records: [{ recordType: "url", data: "https://google.es" },
        { recordType: "text", data: checkboxId }
        ],
      }).then(() => {
        console.log(`Etiqueta NFC para el checkbox ${checkboxId} escrita correctamente`);
        etiquetaNfcEscrita = true;
      });
    } catch (error) {
      consoleLog(`Error al escribir en la etiqueta NFC para el checkbox ${checkboxId}: ${error}`);
    } finally {
      // Establecer la variable de bloqueo en falso
      escribiendoNfc = false;
      cerrarModal();
    }
    ndef.scan();
  } else {
    consoleLog("Navegador no soportado");
    // Establecer la variable de bloqueo en falso
    escribiendoNfc = false;
  }
}


function consoleLog(data) {
  var logElement = document.getElementById('log');
  logElement.innerHTML += data + '\n';
}

