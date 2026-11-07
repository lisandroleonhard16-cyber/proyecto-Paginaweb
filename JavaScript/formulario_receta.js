/**
 * FORMULARIO_RECETA.JS
 * Formulario "Envía tu receta" (contacto.html):
 *  - vista previa de la imagen elegida
 *  - validación de tipo y peso antes de enviar
 *  - envío con fetch (sin recargar la página) a php/enviar_receta.php
 *  - mensajes de éxito / error
 */
(function () {
    const form = document.getElementById('formReceta');
    if (!form) return;

    const MAX_BYTES = 5 * 1024 * 1024;
    const FORMATOS = ['image/jpeg', 'image/png', 'image/webp'];

    const inputImagen = document.getElementById('imagen');
    const vistaPrevia = document.getElementById('vistaPrevia');
    const nombreArchivo = document.getElementById('nombreArchivo');
    const mensaje = document.getElementById('formMensaje');
    const boton = document.getElementById('formBoton');
    const descripcion = document.getElementById('descripcion');
    const contador = document.getElementById('contadorDescripcion');

    let urlPrevia = null;

    function mostrarMensaje(texto, esExito) {
        mensaje.textContent = texto;
        mensaje.className = 'form-mensaje ' + (esExito ? 'ok' : 'error');
        mensaje.hidden = false;
        mensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function ocultarMensaje() {
        mensaje.hidden = true;
        mensaje.textContent = '';
    }

    function limpiarVistaPrevia() {
        if (urlPrevia) {
            URL.revokeObjectURL(urlPrevia);
            urlPrevia = null;
        }
        vistaPrevia.hidden = true;
        vistaPrevia.removeAttribute('src');
        nombreArchivo.textContent = 'Ningún archivo seleccionado';
    }

    // Vista previa y validación de la imagen
    inputImagen.addEventListener('change', function () {
        ocultarMensaje();
        limpiarVistaPrevia();

        const archivo = inputImagen.files[0];
        if (!archivo) return;

        if (!FORMATOS.includes(archivo.type)) {
            inputImagen.value = '';
            mostrarMensaje('Formato no permitido. Usa una imagen JPG, PNG o WEBP.', false);
            return;
        }
        if (archivo.size > MAX_BYTES) {
            inputImagen.value = '';
            mostrarMensaje('La imagen es demasiado pesada (máximo 5 MB).', false);
            return;
        }

        urlPrevia = URL.createObjectURL(archivo);
        vistaPrevia.src = urlPrevia;
        vistaPrevia.hidden = false;
        nombreArchivo.textContent = archivo.name;
    });

    // Contador de caracteres de la descripción
    function actualizarContador() {
        contador.textContent = descripcion.value.length + ' / ' + descripcion.maxLength;
    }
    descripcion.addEventListener('input', actualizarContador);
    actualizarContador();

    // Envío
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        ocultarMensaje();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        boton.disabled = true;
        const textoOriginal = boton.textContent;
        boton.textContent = 'Enviando…';

        try {
            const respuesta = await fetch(form.getAttribute('action'), {
                method: 'POST',
                body: new FormData(form)
            });

            const texto = await respuesta.text();
            let datos = null;
            try {
                datos = JSON.parse(texto);
            } catch (_) { /* la respuesta no era JSON */ }

            if (!datos) {
                mostrarMensaje(
                    'El servidor no pudo procesar el envío. Verifica que la página se esté abriendo desde un servidor con PHP (por ejemplo XAMPP).',
                    false
                );
            } else if (datos.ok) {
                mostrarMensaje(datos.mensaje, true);
                form.reset();
                limpiarVistaPrevia();
                actualizarContador();
            } else {
                mostrarMensaje(datos.mensaje || 'No se pudo enviar la receta.', false);
            }
        } catch (error) {
            mostrarMensaje('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.', false);
        } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    });
})();
