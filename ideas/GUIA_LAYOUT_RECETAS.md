# GUÍA COMPLETA: Layout de recetas (banner destacado + grilla de tarjetas + intercambio)

Proyecto: **Margarita Cocina** (sitio estático HTML + CSS + JS, sin frameworks ni backend).
Documento pensado para ser leído por una **persona o por una IA** y reproducir el resultado de forma idéntica en cualquier página de recetas del sitio (`pastas.html`, `postres.html`, `ensaladas.html`, `tragos.html`, `especialidad_casa.html`, etc.).

---

## 0. Resumen en 30 segundos

1. Crear 2 archivos nuevos (código completo en los **Anexos A y B**): `css/layout_recetas.css` y `JavaScript/recetas_layout.js`.
2. En cada HTML de recetas: enlazar el CSS, agregar un banner, agregar un contenedor `#receta-activa`, envolver las recetas en `.lista-recetas` y cambiar el script inline por `recetas_layout.js`.
3. Esto se puede hacer **automáticamente** con el script del **Anexo C** (`aplicar_layout.py`) o **a mano** siguiendo la sección 7.
4. **No se cambia ningún color, fondo, header, footer ni el contenido de las recetas. No se modifica ningún CSS existente.**

---

## 1. Reglas para la IA que ejecute esta guía (LEER PRIMERO)

**Obligatorio:**
- Cambiar **únicamente la distribución** (posición, tamaños, grillas, espaciados) de las recetas.
- Usar solo colores que ya existen en el sitio (dorado `rgb(212, 175, 55)`, tarjeta `rgb(25, 25, 25)`). El fondo del `body` (imagen fija con degradado rosado/dorado) **no se toca**.
- Mantener la estructura de cada receta tal cual: `details.receta > summary > (img + h2)` seguido de `section.contenido_receta`. **No editar nada dentro de `.contenido_receta`.**
- Crear archivos nuevos en lugar de editar los CSS existentes (`estilos.css`, `home.css`, `contenido_receta.css`, `footer.css`, `aviso.css`).
- Cargar `layout_recetas.css` **después** de `contenido_receta.css` (el orden es lo que permite sobrescribir `.receta`).
- Conservar los `id` que ya existan en los `<details>` (otras páginas enlazan a ellos con `#id`, por ejemplo `carnes.html#bondiola-al-horno`).
- Hacer una copia de respaldo del HTML antes de modificarlo.

**Prohibido:**
- Inventar datos (tiempos de cocción, dificultad, calificaciones) que no estén en el HTML original.
- Usar `localStorage`, librerías externas, frameworks o CDNs. Todo es HTML/CSS/JS puro.
- Cambiar rutas de imágenes o textos de las recetas.
- Eliminar `preloader`, `particles`, header, footer, botón "volver arriba" ni los otros scripts (`boton.js`, `menu.js`, `animations.js`).

**Idioma:** el sitio está en español (`lang="es"`). Los textos nuevos (etiqueta del banner, comentarios) van en español.

---

## 2. Contexto del proyecto

### 2.1 Estructura de carpetas (rutas relativas usadas)

Las páginas de recetas viven en `html/Recetas/` y usan rutas `../../`:

```
(raíz del sitio)
├── index.html
├── nosotros.html
├── contacto.html
├── css/
│   ├── estilos.css            ← base: body, header, nav, hamburguesa, preloader
│   ├── home.css               ← estilos del index (tarjetas, carrusel, animaciones)
│   ├── contenido_receta.css   ← .receta, .contenido_receta, historia, ingredientes, pasos
│   ├── footer.css
│   ├── aviso.css              ← aviso de gluten
│   └── layout_recetas.css     ← NUEVO
├── JavaScript/
│   ├── boton.js               ← botón volver arriba
│   ├── menu.js                ← menú hamburguesa
│   ├── animations.js          ← preloader, partículas, scroll-reveal
│   └── recetas_layout.js      ← NUEVO
├── imagenes/Recetas/<Categoria>/*.webp
└── html/
    ├── Recetas/               ← carnes.html, pastas.html, ensaladas.html, postres.html, tragos.html, especialidad_casa.html
    └── Dietas espaciales/     ← vegetarianas.html, veganas.html, sintacc.html, ...
```

> Si una página está en otra profundidad de carpetas, ajustar los `../../` en los `<link>` y `<script>`. El script automático (Anexo C) deduce las rutas leyendo las que ya existen en el HTML.

### 2.2 Cómo se ve el HTML de recetas ANTES (estructura original)

```html
<head>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/home.css">
    <link rel="stylesheet" href="../../css/contenido_receta.css">
    <link rel="stylesheet" href="../../css/footer.css">
</head>
<body>
    <div class="preloader" id="preloader">...</div>
    <div class="particles" id="particles"></div>
    <header id="inicio" class="encabezado">...</header>

    <main>
        <details class="receta" id="milanesa">          <!-- id opcional pero recomendado -->
            <summary>
                <img src="../../imagenes/Recetas/Carnes/mila.webp" alt="Milanesa napolitana">
                <h2>MILANESA NAPOLITANA</h2>
            </summary>
            <section class="contenido_receta">
                <div class="historia">...</div>
                <div class="ingredientes">...</div>
                <div class="pasos">...</div>
            </section>
        </details>
        <!-- ...más <details class="receta">... -->
    </main>

    <footer class="footer">...</footer>
    <button id="btnSubir">↑</button>
    <script src="../../JavaScript/boton.js"></script>
    <script src="../../JavaScript/menu.js"></script>
    <script src="../../JavaScript/animations.js"></script>
    <script>
        // script inline que abre la receta según window.location.hash
    </script>
</body>
```

Antes, cada receta era una tarjeta de ancho casi completo (90%), una debajo de otra, con la imagen grande arriba y el título debajo.

### 2.3 Reglas existentes que el CSS nuevo sobrescribe

En `contenido_receta.css` existen estas reglas, que el layout nuevo reemplaza (no se editan, se sobrescriben por especificidad y orden):

| Regla original | Efecto original | Cómo se sobrescribe |
|---|---|---|
| `.receta { width: 90%; margin: 40px auto; }` | Tarjeta grande centrada | `main .receta { width: auto; margin: 0; }` |
| `.receta summary { text-align:center; padding:20px }` | Cabecera vertical | `main .receta summary { display:flex; padding:0; text-align:left }` |
| `.receta summary img { width:100%; max-height:250px; border-radius:12px; border:2px solid }` | Imagen ancha | `main .receta summary img { width:42%; height:140px; border:none; border-radius:0 }` |
| `.receta summary h2 { font-size:32px }` | Título grande | `main .receta summary h2 { font-size:19px }` |
| `.contenido_receta { width:85% }` | Contenido centrado | `main .receta .contenido_receta { width:auto; margin:0 20px 20px }` |

Reglas de `estilos.css` que **no** se tocan pero conviene conocer: `h1,h2,h3` ya son dorados con `text-shadow`; el `nav` mide `width: 90%`; en móvil (`max-width: 768px`) el menú pasa a hamburguesa lateral.

---

## 3. Resultado esperado

### 3.1 Estado inicial de la página (escritorio)

```
┌───────────────────────── HEADER / NAV (sin cambios) ─────────────────────────┐
│                                                                              │
│ ┌──────────────────────── BANNER "Receta estrella" ─────────────────────────┐ │
│ │ [  IMAGEN (60%) que se funde →  ] │ RECETA ESTRELLA DE LA SEMANA           │ │
│ │ [                               ] │ NOMBRE DE LA RECETA (Georgia, 34px)    │ │
│ │ [                               ] │ frase corta (opcional)                 │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐     ← grilla de 3 columnas         │
│ │[img]Título│ │[img]Título│ │[img]Título│       tarjeta horizontal:          │
│ │        ▾  │ │        ▾  │ │        ▾  │       imagen 42% | título          │
│ └───────────┘ └───────────┘ └───────────┘                                    │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                                    │
│ │   ...     │ │   ...     │ │   ...     │                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Ancho del contenido: **90% de la pantalla** (igual que la barra de navegación), máximo 1700 px, centrado.
- Tarjetas: fondo `rgb(25,25,25)`, borde dorado 2px, radio 12px, flecha `▾` dorada abajo a la derecha, efecto hover (sube 4px + brillo dorado).
- Banner: misma paleta; la imagen tiene un `mask-image` (degradado) que la funde con el fondo oscuro del panel.

### 3.2 Al hacer clic en una tarjeta (el "intercambio")

1. El banner se **oculta**.
2. La receta clickeada **sube** al lugar del banner (contenedor `#receta-activa`), con formato grande: imagen 30% × 200px, título 30px.
3. **Recién ahí se abre** (se despliega su contenido: historia, ingredientes, paso a paso), con una animación de aparición.
4. En la grilla queda un "marcador" invisible que recuerda la posición original de la receta.

### 3.3 Al hacer clic en la cabecera de la receta de arriba

- Se **cierra pero queda arriba** (no vuelve a la grilla). **El banner NO vuelve a aparecer.**
- Otro clic la vuelve a abrir (alterna abrir/cerrar).

### 3.4 Al hacer clic en OTRA tarjeta mientras hay una arriba

- La receta anterior se cierra y **vuelve a su posición original** en la grilla.
- La nueva sube al lugar de arriba y se abre.

### 3.5 Otros disparadores

- **Clic en el banner:** abre la receta destacada (misma lógica de intercambio).
- **Enlace externo con `#id`** (por ejemplo `carnes.html#bondiola-al-horno` desde el index): al cargar, esa receta sube y se abre.
- **Recargar la página:** vuelve al estado inicial (banner visible). No se guarda estado.

### 3.6 Responsive

| Ancho | Grilla | Banner |
|---|---|---|
| > 1000 px | 3 columnas | imagen izquierda / texto derecha |
| ≤ 1000 px | 2 columnas | igual |
| ≤ 768 px | 2 columnas | imagen arriba, texto abajo (apilado) |
| ≤ 640 px | 1 columna; contenido al 94% de ancho | apilado |

---

## 4. Requisitos de la página a transformar

La página debe cumplir:

- [ ] Tiene un `<main>` que contiene directamente los `<details class="receta">`.
- [ ] Cada receta usa `details.receta > summary > img + h2` y luego `section.contenido_receta`.
- [ ] Carga `contenido_receta.css` en el `<head>`.
- [ ] Al menos una receta existe (será la del banner).

Si una página tiene estructura distinta (por ejemplo, recetas que no usan `<details>`, o tarjetas con otro marcado), **no usar el script automático**: adaptar manualmente conservando la lógica descrita en la sección 8.

---

## 5. Elegir la receta del banner

- Puede ser cualquiera de la página; por defecto, **la primera**.
- La misma receta aparece también en la grilla (es normal: el banner es un acceso directo).
- El `href` del banner debe ser `#` + el `id` del `<details>` de esa receta. Si la receta no tiene `id`, **agregárselo** (formato: minúsculas, sin tildes, guiones: `id="milanesa-napolitana"`).
- Frase corta opcional bajo el título (una línea). No inventar datos técnicos; usar una frase descriptiva basada en la "Historia" de la receta.

---

## 6. Método A — Automático (recomendado)

Requiere Python 3. El código está en el **Anexo C**.

```bash
# 1) Copiar layout_recetas.css  → carpeta css/
# 2) Copiar recetas_layout.js    → carpeta JavaScript/
# 3) Ejecutar sobre cada página:
python aplicar_layout.py pastas.html
python aplicar_layout.py postres.html --banner-id tiramisu --frase "El postre italiano más famoso"
```

Opciones:
- `--banner-id ID` receta a destacar (por defecto la primera).
- `--frase "texto"` frase bajo el título del banner (opcional).

El script: crea `archivo.html.bak`, enlaza el CSS, agrega banner + `#receta-activa` + `.lista-recetas`, reemplaza el script inline del hash por `recetas_layout.js` y agrega `id` a la receta del banner si no lo tenía. Es **idempotente** (si ya se aplicó, no hace nada). Fue verificado contra el `carnes.html` original y produce un resultado idéntico al del Método B.

---

## 7. Método B — Manual (4 pasos)

### Paso 1 — Enlazar el CSS

En el `<head>`, **inmediatamente después** de `contenido_receta.css`:

```html
<link rel="stylesheet" href="../../css/contenido_receta.css">
<link rel="stylesheet" href="../../css/layout_recetas.css">
<link rel="stylesheet" href="../../css/footer.css">
```

### Paso 2 — Banner y contenedor de la receta activa

Inmediatamente después de `<main>`:

```html
<main>

    <!-- ===== BANNER DESTACADO ===== -->
    <section class="hero-receta">
        <a class="hero-receta__link" href="#ID_DE_LA_RECETA">
            <img src="RUTA/DE/LA/IMAGEN.webp" alt="Nombre de la receta">
            <div class="hero-receta__info">
                <span class="hero-receta__etiqueta">Receta estrella de la semana</span>
                <h2>NOMBRE DE LA RECETA</h2>
                <p>Frase corta descriptiva</p>
            </div>
        </a>
    </section>

    <!-- Aquí sube la receta clickeada (reemplaza al banner mientras está abierta) -->
    <div id="receta-activa" class="receta-activa"></div>
```

> ⚠️ El `<div id="receta-activa">` debe estar **completamente vacío** (sin espacios ni saltos de línea entre `>` y `</div>`), porque el CSS usa `:empty` para ocultarlo cuando no hay nada.
> La imagen y el nombre del banner se copian de la receta elegida (misma `src`, mismo `alt`, mismo título en mayúsculas).

### Paso 3 — Envolver las recetas en la grilla

```html
    <!-- ===== GRILLA DE RECETAS ===== -->
    <div class="lista-recetas">

        <details class="receta" id="...">
            ... (todas las recetas SIN CAMBIOS) ...
        </details>

    </div><!-- /lista-recetas -->
</main>
```

El `<div class="lista-recetas">` se abre justo antes de la primera `<details>` y se cierra justo antes de `</main>`.

### Paso 4 — Script

1. **Eliminar** el `<script>` inline que lee `window.location.hash` (el que abría la receta por URL). Su función ahora la cumple `recetas_layout.js`.
2. Agregar, junto a los otros scripts al final del `<body>`:

```html
<script src="../../JavaScript/recetas_layout.js"></script>
```

---

## 8. HTML final de referencia (esqueleto completo)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Carnes - MARGARITA COCINA</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/home.css">
    <link rel="stylesheet" href="../../css/contenido_receta.css">
    <link rel="stylesheet" href="../../css/layout_recetas.css">
    <link rel="stylesheet" href="../../css/footer.css">
</head>
<body>
    <!-- preloader, particles, header: SIN CAMBIOS -->

    <main>
        <section class="hero-receta">
            <a class="hero-receta__link" href="#milanesa">
                <img src="../../imagenes/Recetas/Carnes/mila.webp" alt="Milanesa napolitana">
                <div class="hero-receta__info">
                    <span class="hero-receta__etiqueta">Receta estrella de la semana</span>
                    <h2>MILANESA NAPOLITANA</h2>
                    <p>Un clásico de bodegones y hogares argentinos</p>
                </div>
            </a>
        </section>

        <div id="receta-activa" class="receta-activa"></div>

        <div class="lista-recetas">
            <details class="receta" id="milanesa">
                <summary>
                    <img src="../../imagenes/Recetas/Carnes/mila.webp" alt="Milanesa napolitana">
                    <h2>MILANESA NAPOLITANA</h2>
                </summary>
                <section class="contenido_receta"> ... </section>
            </details>

            <details class="receta">
                <summary>
                    <img src="..." alt="...">
                    <h2>MILANESA CLÁSICA</h2>
                </summary>
                <section class="contenido_receta"> ... </section>
            </details>
            <!-- ...resto de recetas... -->
        </div><!-- /lista-recetas -->
    </main>

    <!-- footer, botón subir: SIN CAMBIOS -->
    <script src="../../JavaScript/boton.js"></script>
    <script src="../../JavaScript/menu.js"></script>
    <script src="../../JavaScript/animations.js"></script>
    <script src="../../JavaScript/recetas_layout.js"></script>
</body>
</html>
```

---

## 9. Cómo funciona por dentro (para entender o modificar)

### 9.1 CSS (`layout_recetas.css`)

- `main { width: 90%; max-width: 1700px; margin: 0 auto; }` → ancho igual al del `nav`.
- `.hero-receta` / `.hero-receta__link` → banner en `display:flex`; la imagen ocupa 60% y usa `mask-image: linear-gradient(...)` para fundirse con el panel.
- `.lista-recetas` → `display:grid; grid-template-columns: repeat(3, 1fr); gap:18px; align-items:start`.
- `main .receta` (en vez de `.lista-recetas > .receta`) → el mismo estilo de tarjeta vale **tanto dentro de la grilla como en `#receta-activa`**.
- `main .receta summary` → `display:flex` con imagen 42% a la izquierda y `h2` a la derecha; `summary::after { content:'▾' }` es la flecha indicadora (rota 180° cuando `[open]`).
- `.receta-activa > .receta` y `main .receta[open]` → formato grande (imagen 30% × 200px, título 30px). Se aplica a la receta de arriba aunque esté **cerrada**.
- `.receta-activa:empty { display:none }` → sin receta arriba no ocupa espacio.
- Animación `aparecerReceta` (fade + subida de 15px, 0.4s) al llegar arriba.
- `@media` a 1000 / 768 / 640 px para responsive.

### 9.2 JavaScript (`recetas_layout.js`)

Variables de estado: `activa` (el `<details>` que está arriba) y `marcador` (nodo comentario que marca su lugar original en la grilla).

- `activar(det)`: devuelve la receta anterior a su lugar (si había), inserta un comentario-marcador donde estaba `det`, mueve `det` a `#receta-activa`, oculta el banner (`hero.hidden = true`), pone `det.open = true` y hace scroll suave hasta arriba.
- `devolver()`: cierra la receta activa y la reinserta en el lugar del marcador. **No** vuelve a mostrar el banner.
- Un único listener de `click` sobre `document` intercepta clics en `details.receta > summary`, llama a `preventDefault()` (evita que el navegador abra la receta en la grilla) y decide: si es la activa → alterna `open`; si no → `activar()`.
- El clic en el banner (`a[href^="#"]`) también llama a `activar()` con el `id` de su `href`.
- `abrirDesdeHash()` (en `DOMContentLoaded` y `hashchange`) mantiene la compatibilidad con enlaces `página.html#id`.

Decisiones deliberadas:
- Se usa el atributo nativo `hidden` en el banner, por eso `.hero-receta` **no debe tener** una regla `display` propia.
- El JS no depende de ningún id fijo salvo `receta-activa`; funciona con cualquier cantidad de recetas.
- Si JavaScript fallara, las recetas siguen siendo `<details>` nativos: se abren en su lugar ocupando toda la fila (`main .receta[open] { grid-column: 1 / -1 }`), así que la página no se rompe.

---

## 10. Personalización

| Qué cambiar | Dónde (en `layout_recetas.css`) |
|---|---|
| Cantidad de columnas | `.lista-recetas { grid-template-columns }` |
| Separación entre tarjetas | `.lista-recetas { gap }` |
| Ancho de la página | `main { width; max-width }` |
| Tamaño de la foto en tarjetas | `main .receta summary img` → `flex`, `width`, `height` |
| Tamaño del título en tarjetas | `main .receta summary h2` → `font-size` |
| Alto del banner | `.hero-receta__link { min-height }` y `.hero-receta__link img { max-height }` |
| Proporción imagen/texto del banner | `.hero-receta__link img { flex: 0 0 60%; width: 60% }` |
| Tamaño de la receta de arriba | bloque `/* TARJETA DE ARRIBA ... */` |
| Fuente de títulos | `font-family: "Georgia", serif` en `summary h2` y `.hero-receta__info h2` (quitarla para volver a la anterior) |
| Texto de la etiqueta | HTML del banner: `.hero-receta__etiqueta` |

---

## 11. Verificación (checklist de pruebas)

**Estructura**
- [ ] `layout_recetas.css` está enlazado **después** de `contenido_receta.css`.
- [ ] Existe exactamente un `.hero-receta`, un `#receta-activa` (vacío) y un `.lista-recetas`.
- [ ] El `href="#id"` del banner coincide con el `id` de un `<details>`.
- [ ] Todas las `<details class="receta">` están dentro de `.lista-recetas`; el div se cierra antes de `</main>`.
- [ ] Cantidad de `<details>` y `</details>` iguales y sin cambios respecto al original.
- [ ] No queda ningún `<script>` inline con `location.hash`.
- [ ] `recetas_layout.js` está enlazado una sola vez.

**Comportamiento (probar en el navegador)**
- [ ] Al cargar: banner visible, grilla en 3 columnas, ninguna receta abierta.
- [ ] Clic en una tarjeta → banner desaparece, la receta sube y se abre.
- [ ] Clic en su cabecera → se cierra y **sigue arriba**; el banner **no reaparece**.
- [ ] Clic otra vez → se abre de nuevo.
- [ ] Clic en otra tarjeta → la anterior vuelve a su lugar exacto en la grilla; la nueva sube.
- [ ] Clic en el banner → abre la receta destacada arriba.
- [ ] Abrir `pagina.html#id-de-receta` → carga con esa receta arriba y abierta.
- [ ] Menú desplegable, hamburguesa, botón "volver arriba" y preloader siguen funcionando.
- [ ] Colores y fondo idénticos a antes.

**Responsive:** revisar a 1200 px, 900 px, 700 px y 400 px.

---

## 12. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Las tarjetas se ven como antes (grandes, apiladas) | `layout_recetas.css` no se carga o está antes de `contenido_receta.css` | Revisar ruta y orden de los `<link>` |
| Nada se mueve al hacer clic | `recetas_layout.js` no carga, o falta `#receta-activa` o `.lista-recetas` | Revisar consola (F12) y ruta del script |
| Las recetas se abren en la grilla en lugar de subir | JS no se ejecuta | Igual que arriba |
| El banner no desaparece | Se agregó un `display` a `.hero-receta` que anula `hidden` | Quitar esa regla |
| Queda un hueco vacío arriba | `#receta-activa` tiene espacios/saltos de línea dentro | Dejarlo como `<div id="receta-activa" class="receta-activa"></div>` |
| El banner no abre nada | `href` no coincide con ningún `id` | Corregir el `id` del `<details>` o el `href` |
| Enlace `pagina.html#id` no abre la receta | El `<details>` no tiene ese `id` | Agregar el `id` |
| Se ven dos scrolls horizontales / contenido cortado en móvil | `main` con `padding` extra | Dejar `main { padding: 0 }` |
| Las imágenes no se ven | Rutas relativas incorrectas | Copiar `src` exactamente de la receta original |

---

## 13. Prompt listo para copiar y pegar a una IA

> Te paso una guía técnica (`GUIA_LAYOUT_RECETAS.md`) y el archivo HTML `NOMBRE.html` de mi sitio de recetas.
> Quiero que apliques exactamente esa distribución a `NOMBRE.html`: banner de "Receta estrella de la semana" arriba, grilla de tarjetas horizontales y el intercambio de la receta clickeada con el banner.
> Reglas: **no cambies colores, fondo, header, footer ni el contenido de las recetas; no edites mis CSS existentes**; solo crea/usa `css/layout_recetas.css` y `JavaScript/recetas_layout.js` (código completo en los Anexos A y B) y modifica el HTML siguiendo la sección 7 (o usa el script del Anexo C).
> Elegí como receta destacada: `NOMBRE_O_ID_DE_LA_RECETA` (si no indico ninguna, usá la primera). No inventes datos.
> Devolveme el HTML completo modificado y confirmame el checklist de la sección 11.

---

# ANEXOS: CÓDIGO COMPLETO

## ANEXO A — `css/layout_recetas.css`

```css
/**
 * LAYOUT_RECETAS.CSS
 * Nueva distribución de las páginas de categoría de recetas (carnes, pastas, etc.)
 *  - Banner destacado arriba (.hero-receta)
 *  - Grilla de tarjetas horizontales: imagen a la izquierda, título a la derecha (.lista-recetas)
 *  - Al abrir una receta, la tarjeta ocupa todo el ancho y muestra su contenido debajo
 *
 * IMPORTANTE: cargar DESPUÉS de contenido_receta.css.
 * Solo define distribución (tamaños, grillas, espaciados). Usa los mismos colores
 * que ya existen en el sitio; no cambia fondo ni paleta.
 */

/* ===== CONTENEDOR GENERAL ===== */
main {
    width: 90%;          /* mismo ancho que la barra de navegación */
    max-width: 1700px;
    margin: 0 auto;
    padding: 0;
}

/* ===== BANNER DESTACADO ===== */
.hero-receta {
    margin: 30px 0 28px;
}

.hero-receta__link {
    display: flex;
    align-items: stretch;
    min-height: 200px;
    background-color: rgb(25, 25, 25);
    border: 2px solid rgb(212, 175, 55);
    border-radius: 15px;
    overflow: hidden;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.hero-receta__link:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.45);
}

/* La imagen ocupa ~60% y se funde con el fondo oscuro hacia la derecha */
.hero-receta__link img {
    flex: 0 0 60%;
    width: 60%;
    height: auto;
    min-height: 200px;
    max-height: 260px;
    object-fit: cover;
    -webkit-mask-image: linear-gradient(to right, #000 70%, transparent 100%);
            mask-image: linear-gradient(to right, #000 70%, transparent 100%);
}

.hero-receta__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 14px;
    padding: 20px 30px 20px 10px;
}

.hero-receta__etiqueta {
    display: inline-block;
    padding: 6px 14px;
    background-color: rgba(212, 175, 55, 0.15);
    border-radius: 6px;
    color: rgb(212, 175, 55);
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.hero-receta__info h2 {
    margin: 0;
    font-family: "Georgia", serif;
    font-size: 34px;
    line-height: 1.15;
}

.hero-receta__info p {
    margin: 0;
    color: white;
    font-size: 16px;
}

/* ===== GRILLA DE TARJETAS ===== */
.lista-recetas {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    align-items: start;
    margin-bottom: 30px;
}

/* Tarjeta horizontal (sobrescribe el .receta de contenido_receta.css) */
main .receta {
    width: auto;
    margin: 0;
    background-color: rgb(25, 25, 25);
    border: 2px solid rgb(212, 175, 55);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

main .receta:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 18px rgba(212, 175, 55, 0.45);
}

/* Cabecera de la tarjeta: imagen | título */
main .receta summary {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0;
    text-align: left;
    min-height: 140px;
    position: relative;
}

main .receta summary img {
    flex: 0 0 42%;
    width: 42%;
    height: 140px;
    max-height: none;
    object-fit: cover;
    border: none;
    border-radius: 0;
}

main .receta summary h2 {
    flex: 1;
    margin: 0;
    padding: 10px 34px 10px 0;
    font-family: "Georgia", serif;
    font-size: 19px;
    line-height: 1.25;
}

/* Flecha indicadora de que la tarjeta se despliega */
main .receta summary::after {
    content: '▾';
    position: absolute;
    right: 12px;
    bottom: 8px;
    color: rgb(212, 175, 55);
    font-size: 18px;
    transition: transform 0.3s ease;
}

main .receta[open] summary::after {
    transform: rotate(180deg);
}

/* El efecto de brillo del summary ya no hace falta sobre la imagen */
main .receta summary:hover img {
    box-shadow: none;
}

/* ===== RECETA ACTIVA (arriba, en el lugar del banner) ===== */
.receta-activa:empty {
    display: none;
}

.receta-activa {
    margin: 30px 0 28px;
}

.receta-activa > .receta {
    animation: aparecerReceta 0.4s ease;
}

@keyframes aparecerReceta {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ===== TARJETA DE ARRIBA (abierta o cerrada) / TARJETA ABIERTA ===== */
main .receta[open] {
    grid-column: 1 / -1;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
}

.receta-activa > .receta {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
}

main .receta[open] summary,
.receta-activa > .receta summary {
    min-height: 200px;
}

main .receta[open] summary img,
.receta-activa > .receta summary img {
    flex-basis: 30%;
    width: 30%;
    height: 200px;
}

main .receta[open] summary h2,
.receta-activa > .receta summary h2 {
    font-size: 30px;
}

/* El contenido interno usa todo el ancho de la tarjeta abierta */
main .receta .contenido_receta {
    width: auto;
    margin: 0 20px 20px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1000px) {
    .lista-recetas {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .hero-receta__link {
        flex-direction: column;
    }

    .hero-receta__link img {
        flex: none;
        width: 100%;
        max-height: 220px;
        -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent 100%);
                mask-image: linear-gradient(to bottom, #000 70%, transparent 100%);
    }

    .hero-receta__info {
        padding: 10px 20px 20px;
    }

    .hero-receta__info h2 {
        font-size: 26px;
    }
}

@media (max-width: 640px) {
    main {
        width: 94%;
    }

    .lista-recetas {
        grid-template-columns: 1fr;
    }

    main .receta[open] summary img,
    .receta-activa > .receta summary img {
        flex-basis: 42%;
        width: 42%;
        height: 140px;
    }

    main .receta[open] summary h2,
    .receta-activa > .receta summary h2 {
        font-size: 22px;
    }

    main .receta .contenido_receta {
        margin: 0 10px 14px;
        padding: 18px;
    }
}
```

## ANEXO B — `JavaScript/recetas_layout.js`

```javascript
/**
 * RECETAS_LAYOUT.JS
 * Intercambia la receta clickeada con el banner "Receta estrella de la semana".
 *  - Al hacer clic en una tarjeta: sube al lugar del banner y recién ahí se abre.
 *  - Al hacer clic en su cabecera de nuevo: se cierra pero QUEDA ARRIBA
 *    (el banner no vuelve a aparecer).
 *  - Al hacer clic en otra tarjeta: la anterior vuelve a su lugar en la grilla
 *    y la nueva toma su lugar arriba.
 * Requiere en el HTML: .hero-receta, #receta-activa y .lista-recetas
 */
(function () {
    const hero = document.querySelector('.hero-receta');
    const slot = document.getElementById('receta-activa');
    const lista = document.querySelector('.lista-recetas');
    if (!slot || !lista) return;

    let activa = null;     // <details> que está arriba ahora
    let marcador = null;   // lugar original de esa receta en la grilla

    function devolver() {
        if (!activa) return;
        activa.open = false;
        marcador.parentNode.insertBefore(activa, marcador);
        marcador.remove();
        activa = null;
        marcador = null;
    }

    function activar(det) {
        if (!det || activa === det) return;
        devolver();
        marcador = document.createComment('lugar de la receta');
        det.parentNode.insertBefore(marcador, det);
        slot.appendChild(det);
        activa = det;
        if (hero) hero.hidden = true;
        det.open = true;
        slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Clic en la cabecera de cualquier receta
    document.addEventListener('click', function (e) {
        const resumen = e.target.closest('details.receta > summary');
        if (!resumen) return;
        e.preventDefault(); // evita que se abra en su lugar dentro de la grilla
        const det = resumen.parentElement;
        if (det === activa) {
            det.open = !det.open; // abre/cierra sin moverla de arriba
        } else {
            activar(det);
        }
    });

    // Clic en el banner: abre la receta destacada
    if (hero) {
        const enlace = hero.querySelector('a[href^="#"]');
        if (enlace) {
            enlace.addEventListener('click', function (e) {
                e.preventDefault();
                activar(document.getElementById(enlace.getAttribute('href').slice(1)));
            });
        }
    }

    // Enlaces externos con #hash (ej.: desde el index o el buscador)
    function abrirDesdeHash() {
        const id = window.location.hash.substring(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (el && el.tagName === 'DETAILS') activar(el);
    }
    window.addEventListener('DOMContentLoaded', abrirDesdeHash);
    window.addEventListener('hashchange', abrirDesdeHash);
})();
```

## ANEXO C — `aplicar_layout.py` (opcional, automatiza el Método B)

```python
#!/usr/bin/env python3
"""
aplicar_layout.py
Aplica la distribución "banner + grilla + intercambio" a una página de recetas.

Uso:
    python aplicar_layout.py pastas.html
    python aplicar_layout.py pastas.html --banner-id lasagna --frase "Un clásico italiano"

Qué hace (idempotente: si ya fue aplicado, no hace nada):
  1. Enlaza layout_recetas.css justo después de contenido_receta.css
  2. Agrega el banner (usa la primera receta o la indicada con --banner-id)
  3. Agrega <div id="receta-activa">
  4. Envuelve todas las recetas en <div class="lista-recetas">
  5. Reemplaza el script inline del #hash por recetas_layout.js
  6. Si la receta del banner no tiene id, se lo agrega
Crea un respaldo archivo.html.bak antes de modificar.
"""
import argparse, re, shutil, unicodedata


def slug(texto):
    t = unicodedata.normalize('NFD', texto.lower())
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-') or 'receta'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('archivo')
    ap.add_argument('--banner-id', help='id de la receta a destacar (por defecto, la primera)')
    ap.add_argument('--frase', default='', help='frase corta bajo el título del banner')
    a = ap.parse_args()

    html = open(a.archivo, encoding='utf-8').read()
    if 'lista-recetas' in html:
        print('Este archivo ya tiene la distribución aplicada. No se hizo nada.')
        return

    # --- 1. CSS --------------------------------------------------------------
    m = re.search(r'^([ \t]*)<link[^>]*href="([^"]*?)contenido_receta\.css"[^>]*>[ \t]*\n',
                  html, re.M)
    if not m:
        raise SystemExit('No se encontró el <link> a contenido_receta.css')
    linea_css = f'{m.group(1)}<link rel="stylesheet" href="{m.group(2)}layout_recetas.css">\n'
    html = html[:m.end()] + linea_css + html[m.end():]

    # --- 2. Elegir receta del banner y asegurar su id ------------------------
    abre = list(re.finditer(r'<details\b[^>]*\bclass="[^"]*\breceta\b[^"]*"[^>]*>', html))
    if not abre:
        raise SystemExit('No se encontraron <details class="receta">')
    elegido = None
    if a.banner_id:
        for d in abre:
            if re.search(r'\bid="%s"' % re.escape(a.banner_id), d.group(0)):
                elegido = d
        if not elegido:
            raise SystemExit(f'No existe una receta con id="{a.banner_id}"')
    else:
        elegido = abre[0]

    bloque = html[elegido.end(): elegido.end() + 3000]
    img_src = re.search(r'<img[^>]*\bsrc="([^"]*)"', bloque).group(1)
    alt = re.search(r'<img[^>]*\balt="([^"]*)"', bloque)
    alt = alt.group(1) if alt else ''
    titulo = re.sub(r'\s+', ' ', re.search(r'<h2[^>]*>(.*?)</h2>', bloque, re.S).group(1)).strip()

    idm = re.search(r'\bid="([^"]*)"', elegido.group(0))
    if idm:
        banner_id = idm.group(1)
    else:
        banner_id = slug(titulo)
        nuevo = elegido.group(0).replace('<details', f'<details id="{banner_id}"', 1)
        html = html[:elegido.start()] + nuevo + html[elegido.end():]

    # --- 3. Banner + slot + apertura de grilla -------------------------------
    p = f'                    <p>{a.frase}</p>\n' if a.frase else ''
    bloque_nuevo = f'''
        <!-- ===== BANNER DESTACADO ===== -->
        <section class="hero-receta">
            <a class="hero-receta__link" href="#{banner_id}">
                <img src="{img_src}" alt="{alt}">
                <div class="hero-receta__info">
                    <span class="hero-receta__etiqueta">Receta estrella de la semana</span>
                    <h2>{titulo}</h2>
{p}                </div>
            </a>
        </section>

        <!-- Aquí sube la receta clickeada (reemplaza al banner mientras está abierta) -->
        <div id="receta-activa" class="receta-activa"></div>

        <!-- ===== GRILLA DE RECETAS ===== -->
        <div class="lista-recetas">
'''
    mm = re.search(r'<main\b[^>]*>[ \t]*\n?', html)
    if not mm:
        raise SystemExit('No se encontró <main>')
    html = html[:mm.end()] + bloque_nuevo + html[mm.end():]

    cierre = html.rfind('</main>')
    if cierre == -1:
        raise SystemExit('No se encontró </main>')
    ini = html.rfind('\n', 0, cierre) + 1          # inicio de la línea de </main>
    html = html[:ini] + '        </div><!-- /lista-recetas -->\n' + html[ini:]

    # --- 4. Script ------------------------------------------------------------
    html = re.sub(r'[ \t]*<script>(?:(?!</script>).)*?location\.hash(?:(?!</script>).)*?</script>[ \t]*\n?',
                  '', html, flags=re.S)
    srcs = list(re.finditer(r'^([ \t]*)<script src="([^"]*?)[^"/]*\.js"></script>[ \t]*\n', html, re.M))
    if srcs:
        u = srcs[-1]
        linea_js = f'{u.group(1)}<script src="{u.group(2)}recetas_layout.js"></script>\n'
        html = html[:u.end()] + linea_js + html[u.end():]
    else:
        linea_js = '    <script src="../../JavaScript/recetas_layout.js"></script>\n'
        i = html.rfind('</body>')
        html = html[:i] + linea_js + html[i:]

    shutil.copy(a.archivo, a.archivo + '.bak')
    open(a.archivo, 'w', encoding='utf-8').write(html)
    print(f'Listo. Banner: "{titulo}" (#{banner_id}). Respaldo: {a.archivo}.bak')


if __name__ == '__main__':
    main()
```
