/**
 * CUENTA.JS
 * Acceso de usuarios en todo el sitio:
 *  - Widget fijo arriba a la derecha: "Ingresar" abre un modal con
 *    login / registro (sin cambiar de página); con sesión muestra
 *    "Hola, X" + Salir + Panel (solo admin).
 *  - En contacto.html además muestra/oculta el formulario de receta
 *    según haya sesión iniciada.
 * Los endpoints PHP (login, registro, logout, sesion) no cambian.
 * La raíz del sitio se deduce de la URL de este script, así funciona
 * desde cualquier carpeta (raíz, html/Recetas, html/Dietas espaciales...).
 */
(function () {
    const script = document.currentScript;
    const raiz = script
        ? script.src.replace(/\/JavaScript\/cuenta\.js.*$/, '/')
        : './';
    const API = raiz + 'php/';

    /* ===== MODAL DE ACCESO (se crea una sola vez, sirve en todas las páginas) ===== */
    const modal = document.createElement('div');
    modal.className = 'cuenta-modal';
    modal.id = 'cuentaModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cuentaModalTitulo');
    modal.hidden = true;
    modal.innerHTML =
        '<div class="cuenta-modal-fondo" data-cerrar></div>' +
        '<div class="cuenta-modal-caja">' +
            '<button type="button" class="cuenta-modal-x" data-cerrar aria-label="Cerrar">&times;</button>' +
            '<h2 class="cuenta-modal-titulo" id="cuentaModalTitulo">Tu cuenta</h2>' +
            '<div class="form-mensaje" id="cuentaMensaje" role="status" aria-live="polite" hidden></div>' +
            '<form id="formLogin" class="cuenta-modal-form">' +
                '<p class="cuenta-modal-ayuda">Inicia sesión para enviar tu receta, o crea una cuenta nueva.</p>' +
                '<div class="cuenta-modal-campo">' +
                    '<label for="loginUsuario">Usuario</label>' +
                    '<input type="text" id="loginUsuario" name="usuario" required minlength="3" maxlength="30" autocomplete="username">' +
                '</div>' +
                '<div class="cuenta-modal-campo">' +
                    '<label for="loginContrasena">Contraseña</label>' +
                    '<input type="password" id="loginContrasena" name="contrasena" required autocomplete="current-password">' +
                '</div>' +
                '<button type="submit" class="form-boton cuenta-modal-boton">Iniciar sesión</button>' +
                '<p class="cuenta-modal-ayuda">¿No tienes cuenta? <button type="button" id="mostrarRegistro" class="cuenta-link">Regístrate</button></p>' +
            '</form>' +
            '<form id="formRegistro" class="cuenta-modal-form" hidden>' +
                '<div class="cuenta-modal-campo">' +
                    '<label for="registroUsuario">Usuario</label>' +
                    '<input type="text" id="registroUsuario" name="usuario" required minlength="3" maxlength="30" autocomplete="username">' +
                '</div>' +
                '<div class="cuenta-modal-campo">' +
                    '<label for="registroContrasena">Contraseña</label>' +
                    '<input type="password" id="registroContrasena" name="contrasena" required minlength="6" autocomplete="new-password">' +
                '</div>' +
                '<div class="cuenta-modal-campo">' +
                    '<label for="registroConfirmar">Confirmar contraseña</label>' +
                    '<input type="password" id="registroConfirmar" name="confirmar" required minlength="6" autocomplete="new-password">' +
                '</div>' +
                '<button type="submit" class="form-boton cuenta-modal-boton">Crear cuenta</button>' +
                '<p class="cuenta-modal-ayuda">¿Ya tienes cuenta? <button type="button" id="mostrarLogin" class="cuenta-link">Inicia sesión</button></p>' +
            '</form>' +
        '</div>';
    document.body.appendChild(modal);

    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');
    const mostrarRegistro = document.getElementById('mostrarRegistro');
    const mostrarLogin = document.getElementById('mostrarLogin');
    const cuentaMensaje = document.getElementById('cuentaMensaje');
    const tituloModal = document.getElementById('cuentaModalTitulo');

    let ultimoFoco = null;

    function mostrarMensajeModal(texto, esExito) {
        cuentaMensaje.textContent = texto;
        cuentaMensaje.className = 'form-mensaje ' + (esExito ? 'ok' : 'error');
        cuentaMensaje.hidden = false;
    }

    function ocultarMensajeModal() {
        cuentaMensaje.hidden = true;
        cuentaMensaje.textContent = '';
    }

    function formularioVisible() {
        return formRegistro.hidden ? formLogin : formRegistro;
    }

    function abrirModal() {
        ultimoFoco = document.activeElement;
        modal.hidden = false;
        document.body.classList.add('cuenta-modal-abierto');
        ocultarMensajeModal();
        // Muestra siempre el login al abrir (no recordar el registro).
        formLogin.hidden = false;
        formRegistro.hidden = true;
        const campo = formularioVisible().querySelector('input');
        if (campo) campo.focus();
    }

    function cerrarModal() {
        modal.hidden = true;
        document.body.classList.remove('cuenta-modal-abierto');
        formLogin.reset();
        formRegistro.reset();
        ocultarMensajeModal();
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    // Cierre: botón X, clic en el fondo y tecla Escape.
    modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-cerrar]')) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (modal.hidden) return;
        if (e.key === 'Escape') {
            cerrarModal();
            return;
        }
        // Mantiene el foco dentro del modal (Tab / Shift+Tab).
        if (e.key === 'Tab') {
            const enfocables = modal.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!enfocables.length) return;
            const primero = enfocables[0];
            const ultimo = enfocables[enfocables.length - 1];
            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primero.focus();
            }
        }
    });

    // Todo elemento con data-abrir-login abre el modal (widget, aviso de receta, etc.).
    document.addEventListener('click', function (e) {
        if (e.target.closest('[data-abrir-login]')) {
            e.preventDefault();
            abrirModal();
        }
    });

    // Expone la apertura para otros scripts (p. ej. el error 401 del formulario de receta).
    window.abrirModalCuenta = abrirModal;

    /* ===== SESIÓN ===== */
    // Fuente de verdad del estado: window.cuentaSesion + evento 'cuenta:sesion'.
    // Otros scripts (p. ej. formulario_receta.js) leen el estado al cargar
    // y escuchan el evento, sin depender del orden en que carguen.
    window.cuentaSesion = null;

    async function enviar(endpoint, datos) {
        const respuesta = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(datos)
        });
        return respuesta.json().catch(() => null);
    }

    formLogin.addEventListener('submit', async function (e) {
        e.preventDefault();
        ocultarMensajeModal();
        const boton = formLogin.querySelector('button[type="submit"]');
        boton.disabled = true;
        try {
            const datos = await enviar(API + 'login.php', {
                usuario: formLogin.usuario.value.trim(),
                contrasena: formLogin.contrasena.value
            });
            if (datos && datos.ok) {
                cerrarModal();
                cargarSesion();
            } else {
                mostrarMensajeModal((datos && datos.mensaje) || 'No se pudo iniciar sesión.', false);
            }
        } catch (_) {
            mostrarMensajeModal('No se pudo conectar con el servidor.', false);
        } finally {
            boton.disabled = false;
        }
    });

    formRegistro.addEventListener('submit', async function (e) {
        e.preventDefault();
        ocultarMensajeModal();
        const boton = formRegistro.querySelector('button[type="submit"]');
        boton.disabled = true;
        try {
            const datos = await enviar(API + 'registro.php', {
                usuario: formRegistro.usuario.value.trim(),
                contrasena: formRegistro.contrasena.value,
                confirmar: formRegistro.confirmar.value
            });
            if (datos && datos.ok) {
                cerrarModal();
                cargarSesion();
            } else {
                mostrarMensajeModal((datos && datos.mensaje) || 'No se pudo crear la cuenta.', false);
            }
        } catch (_) {
            mostrarMensajeModal('No se pudo conectar con el servidor.', false);
        } finally {
            boton.disabled = false;
        }
    });

    mostrarRegistro.addEventListener('click', function () {
        ocultarMensajeModal();
        tituloModal.textContent = 'Crear cuenta';
        formLogin.hidden = true;
        formRegistro.hidden = false;
        formRegistro.usuario.focus();
    });

    mostrarLogin.addEventListener('click', function () {
        ocultarMensajeModal();
        tituloModal.textContent = 'Tu cuenta';
        formRegistro.hidden = true;
        formLogin.hidden = false;
        formLogin.usuario.focus();
    });

    /* ===== WIDGET SUPERIOR DERECHO ===== */
    const widget = document.createElement('div');
    widget.id = 'cuentaWidget';
    document.body.appendChild(widget);

    function escapar(texto) {
        const d = document.createElement('div');
        d.textContent = texto;
        return d.innerHTML;
    }

    function pintarWidget(usuario) {
        if (usuario) {
            let html = '<span class="cw-user">Hola, ' + escapar(usuario.nombre) + '</span>';
            if (usuario.rol === 'admin') {
                html += '<a class="cw-btn" href="' + API + 'admin.php">Panel</a>';
            }
            html += '<button type="button" class="cw-btn cw-salir" data-logout>Salir</button>';
            widget.innerHTML = html;
        } else {
            widget.innerHTML = '<button type="button" class="cw-btn" data-abrir-login>Ingresar</button>';
        }
    }

    widget.addEventListener('click', async function (e) {
        const btn = e.target.closest('[data-logout]');
        if (!btn) return;
        try {
            await fetch(API + 'logout.php', { method: 'POST' });
        } catch (_) { /* se actualiza el estado igual */ }
        cargarSesion();
    });

    async function cargarSesion() {
        let usuario = null;
        try {
            const datos = await (await fetch(API + 'sesion.php', { cache: 'no-store' })).json();
            usuario = datos.usuario || null;
        } catch (_) { /* sin conexión al servidor: se muestra como no logueado */ }
        window.cuentaSesion = usuario;
        document.dispatchEvent(new CustomEvent('cuenta:sesion', { detail: usuario }));
        pintarWidget(usuario);
    }

    cargarSesion();
})();
