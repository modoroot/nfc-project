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
    });
  } catch (error) {
    consoleLog(`Error al leer en la etiqueta NFC: ${error}`);
  } finally {
    //cierra el flujo de entrada de datos del NDEFReader
    ndef.stopScanning();
  }
}
//inicialización de forma global para poder cerrar y abrir el NDEFReader
let ndef = new NDEFReader();
let controller;

/**
 * Escribe una URL en una etiqueta NFC
 * 
 */
async function escribirNfc() {
  const inputData = document.getElementById("url-input").value;

  //si el NDEFReader está cerrado, se abre
  if (ndef.state == "closed") {
    ndef = new NDEFReader();
  }

  if ("NDEFReader" in window) {
    try {
      // Espera a que se encuentre una etiqueta NFC y escribe el contenido introducido en el input
      controller = new AbortController();
      await Promise.race([
        ndef.write({
          records: [{ recordType: "url", data: "https://" + inputData }]
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000)),
        new Promise((_, reject) => controller.signal.addEventListener("abort", () => reject(new Error('Aborted')))),
      ]);
      console.log(`Etiqueta NFC escrita correctamente: ${inputData}`);
      // Cancelar la detección automática de etiquetas NFC
      controller.abort();
      cerrarModal();
    } catch (error) {
      console.log(`Error al escribir en la etiqueta NFC: ${error}`);
    } finally {
      //cierra el flujo de entrada de datos del NDEFReader
      ndef.stopScanning();
    }
  } else {
    console.log("Navegador no soportado");
  }
}



function consoleLog(data) {
  var logElement = document.getElementById('log');
  logElement.innerHTML += data + '\n';
}
