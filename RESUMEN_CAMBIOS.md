# Resumen de cambios — 7 y 8 de noviembre de 2026

## Sábado 7/11 — Sistema de cuentas, login y panel de administración

### Objetivo
Permitir que cada persona se registre, inicie sesión y suba su receta (con el nombre de usuario visible), y que el administrador pueda revisar y aprobar o rechazar las recetas enviadas. Además, hacer obligatoria la foto en el formulario.

### Backend (carpeta `Php/`)

Archivos **nuevos**:

- `Php/auth.php` — manejo de sesiones y usuarios. Los usuarios se guardan en `data/usuarios.json` con la contraseña hasheada (`password_hash`). En la primera ejecución crea automáticamente el usuario **admin / admin** (rol administrador). El archivo está protegido por `data/.htaccess`.
- `Php/login.php` — endpoint JSON para iniciar sesión. Límite de 5 intentos fallidos por sesión.
- `Php/registro.php` — endpoint JSON para crear cuenta (usuario de 3–30 caracteres, contraseña mínimo 6, valida que coincidan y que el usuario no exista). La cuenta queda iniciada automáticamente.
- `Php/logout.php` — cierra la sesión. Con `?volver=1` redirige al sitio en vez de responder JSON.
- `Php/sesion.php` — devuelve el usuario con sesión iniciada (o `null`).
- `Php/admin.php` — panel del administrador: lista las recetas enviadas con foto, categoría, usuario que la subió, fecha y estado. Botones **Aprobar** / **Rechazar**. Rechazar elimina la imagen. Solo accesible con la cuenta admin.

Archivo **modificado**:

- `Php/enviar_receta.php` — ahora exige sesión iniciada (responde 401 si no hay usuario logueado) y guarda el campo `autor` con el nombre de usuario que envió la receta.

### Frontend

- `contacto.html` — se agregó la sección "Tu cuenta" con formularios de login/registro, y el formulario "Envía tu receta" queda oculto hasta iniciar sesión.
- `JavaScript/formulario_receta.js` — validación explícita de que la foto sea obligatoria antes de enviar, y manejo del error 401.
- `JavaScript/cuenta.js` y `css/cuenta.css` — **nuevos**: lógica y estilos de la sección de cuenta.

### Widget global (final del día)

- El acceso se convirtió en un **widget fijo arriba a la derecha en todas las páginas**: botón "Ingresar" si no hay sesión; "Hola, {usuario}" + "Salir" con sesión; botón **"Panel"** visible **solo para el administrador**.
- Se agregaron `css/cuenta.css` y `JavaScript/cuenta.js` a las 14 páginas que no los tenían (`index.html`, `nosotros.html` y las 12 páginas de `html/Recetas/` y `html/Dietas espaciales/`). El JS calcula la ruta raíz solo, funciona a cualquier profundidad.

---

## Domingo 8/11 — Login como ventana emergente (modal)

### Objetivo
Quitar la sección "Tu cuenta" de `contacto.html` y que el login aparezca **solo al hacer clic en "Ingresar"**, como modal sobre la página actual, en todas las páginas.

### Cambios

- `JavaScript/cuenta.js` — reescrito:
  - El modal de login/registro se genera por JS una sola vez y funciona en todas las páginas sin cambiar de página.
  - El botón "Ingresar" del widget abre el modal (ya no lleva a `contacto.html#acceso`).
  - Dentro del modal: formulario de inicio de sesión, enlace "¿No tienes cuenta? Regístrate" que cambia al formulario de registro, y enlace para volver al login. Mismos campos y validaciones de antes.
  - Cierre con botón **X**, tecla **Escape** y clic fuera. Foco al abrir (primer campo) y al cerrar (vuelve al botón que lo abrió), foco atrapado con Tab, `role="dialog"` + `aria-modal`.
  - Los errores se muestran dentro del modal. Al iniciar sesión con éxito el modal se cierra y el widget se actualiza igual que antes (usuario / Salir / Panel solo admin).
  - Se expone `window.abrirModalCuenta` para que otros scripts abran el modal.
- `css/cuenta.css` — estilos nuevos del modal (mismo estilo dorado/oscuro del sitio); eliminados los estilos de la vieja sección "Tu cuenta".
- `contacto.html` — eliminada por completo la sección "Tu cuenta". El aviso de "Envía tu receta" ahora indica usar el botón «Ingresar» de arriba a la derecha y muestra un botón que abre el modal cuando no hay sesión.
- `JavaScript/formulario_receta.js` — el error 401 (sin sesión) ahora abre el modal en vez de buscar el ancla `#acceso` (que se eliminó).
- **Backend PHP sin cambios**: `login.php`, `registro.php`, `logout.php` y `sesion.php` se reutilizaron tal cual.

---

## Estado actual del sistema

- Registro e inicio de sesión con usuarios guardados en `data/usuarios.json` (contraseñas hasheadas).
- Usuario administrador inicial: **admin / admin** — se recomienda cambiarla si el sitio se publica.
- Las recetas enviadas quedan en `data/recetas_pendientes.json` con estado `pendiente` / `aprobada` / `rechazada` y el campo `autor`.
- Panel de administración en `php/admin.php` (solo admin).
- Foto de receta **obligatoria** (validada en JS y en el servidor).
- Los cambios están aplicados tanto en `XAMPP/htdocs/proyecto-Paginaweb` como en `web/proyecto-Paginaweb`.
