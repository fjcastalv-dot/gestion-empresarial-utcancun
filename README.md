# Gestión Empresarial · UT Cancún

Sitio web del Departamento de Gestión Empresarial de la Universidad Tecnológica de Cancún. En él, los estudiantes consultan:

- **Inicio:** acceso a las empresas vinculadas, la ruta de estadía en 10 pasos y la próxima fecha del calendario.
- **Estadías:** qué es la estadía, las modalidades, el calendario, el checklist de seguimiento, los formatos y la agenda para descargar.
- **Bolsa de trabajo:** las vacantes, con un botón de postulación que abre un correo ya redactado.
- **Empresas vinculadas:** catálogo de 883 empresas vinculadas, con buscador y filtros por giro, ubicación y división, y el proceso para vincular una empresa nueva.
- **Contáctanos:** los códigos QR de los canales de difusión y los contactos del departamento y de las divisiones.

Es un sitio estático: solo usa HTML, CSS y JavaScript, sin servidor ni base de datos. Por eso se puede publicar gratis con **GitHub Pages**.

---

## Estructura del proyecto

```
gestion-empresarial-utcancun/
├── index.html            ← Página principal (estructura y textos)
├── css/
│   └── styles.css        ← Colores, tipografía y animaciones
├── js/
│   ├── datos.js          ← ✏️ DATOS EDITABLES: vacantes, contactos, fechas y agenda
│   ├── empresas.js       ← ✏️ Listado de empresas vinculadas
│   └── app.js            ← Lógica del sitio (normalmente no se edita)
├── img/                  ← Logotipo y códigos QR
└── docs/
    └── Agenda-Estadias-ENE-ABR-2027.pdf   ← Agenda para descargar
```

> ⚠️ **Importante:** `index.html` debe quedar en la **raíz** del repositorio, no dentro de otra carpeta. Si no, GitHub Pages no encuentra la página.

---

## Opción A · Subir desde el navegador (sin instalar nada) ✅ Recomendada

### 1. Crear el repositorio
1. Entra a [github.com](https://github.com) e inicia sesión.
2. Arriba a la derecha, haz clic en **+** y luego en **New repository**.
3. En **Repository name** escribe: `gestion-empresarial-utcancun`
4. Selecciona **Public**.
5. **No** marques "Add a README file", porque este proyecto ya trae uno.
6. Haz clic en **Create repository**.

### 2. Subir los archivos
1. Descomprime el archivo `.zip` en tu computadora.
2. En la página del repositorio recién creado, haz clic en el enlace **uploading an existing file**.
3. Abre la carpeta descomprimida `gestion-empresarial-utcancun`, selecciona **todo su contenido** (`index.html`, `README.md` y las carpetas `css`, `js`, `img` y `docs`) y arrástralo a la ventana de GitHub.
   - Arrastra el **contenido** de la carpeta, no la carpeta completa.
   - Usa Chrome o Edge, porque conservan la estructura de carpetas al arrastrar.
4. Abajo, en **Commit changes**, escribe un mensaje como `Primera versión del sitio`.
5. Haz clic en **Commit changes** y espera a que termine de subir.

### 3. Publicar con GitHub Pages
1. En el repositorio, entra a **Settings** (pestaña con engrane).
2. En el menú izquierdo, haz clic en **Pages**.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. En **Branch**, elige `main` y la carpeta `/ (root)`. Haz clic en **Save**.
5. Espera de 1 a 3 minutos y recarga la página. Arriba aparecerá el enlace del sitio:

```
https://TU-USUARIO.github.io/gestion-empresarial-utcancun/
```

Por ejemplo, si tu usuario es `fjcastalv-dot`, el sitio quedará en `https://fjcastalv-dot.github.io/gestion-empresarial-utcancun/`.

---

## Opción B · Subir con Git (línea de comandos)

Requiere tener [Git](https://git-scm.com/downloads) instalado y el repositorio vacío ya creado en GitHub (paso A.1).

```bash
cd ruta/a/gestion-empresarial-utcancun
git init
git add .
git commit -m "Primera versión del sitio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/gestion-empresarial-utcancun.git
git push -u origin main
```

Después activa GitHub Pages igual que en el paso A.3.

Para subir cambios posteriores:

```bash
git add .
git commit -m "Describe aquí el cambio"
git push
```

---

## Cómo actualizar el contenido

Para editar un archivo desde GitHub: ábrelo, haz clic en el ícono del lápiz (✏️ **Edit this file**), haz el cambio y guarda con **Commit changes**. El sitio se actualiza solo en 1 a 3 minutos.

> 🔄 **Para que los cambios se vean de inmediato:** los navegadores guardan una copia de los archivos hasta por 10 minutos. Cada vez que edites un archivo de `css/` o `js/`, abre `index.html` y cambia el número de versión que aparece después de `?v=` (por ejemplo, `?v=20261105` → `?v=20261120`, con la fecha del día). Así cada visitante descarga la versión nueva.

### Publicar vacantes · `js/datos.js`
Busca `const VACANTES` y reemplaza los ejemplos. Cada vacante lleva este formato:

```js
{puesto:"Auxiliar contable", empresa:"Nombre de la empresa", div:"eca", modalidad:"Presencial", ubicacion:"Cancún", dirigida:"Egresados"},
```

- `div` es la división de la vacante: `eca` (Económico-Administrativa), `ing` (Ingeniería y Tecnología), `tur` (Turismo) o `gas` (Gastronomía).
- **Borra** la parte `ejemplo:true` de las vacantes reales, porque esa marca muestra la etiqueta "Ejemplo".
- Si no hay vacantes, deja el arreglo vacío: `const VACANTES = [];`. La página mostrará un aviso.
- El botón **Postularme** abre un correo a bolsadetrabajo@utcancun.edu.mx con el asunto "Postulación para vacante [puesto]" y el texto de autorización para compartir el CV.

### Beneficios para la comunidad UT · `js/datos.js`
Los carteles se muestran en la sección **Egresados**. Para agregar uno, sube la imagen a `img/beneficios/` y añade una línea en `const BENEFICIOS`:

```js
{empresa:"Nombre de la empresa", tipo:"Hospedaje", detalle:"Texto corto del beneficio", flyer:"img/beneficios/archivo.jpg"},
```

Cuando un beneficio venza, borra su línea completa.

### Cambiar la agenda de actividades
1. Sube el nuevo PDF a la carpeta `docs/`, con **Add file → Upload files** dentro de esa carpeta.
2. En `js/datos.js`, cambia el nombre del archivo en `const AGENDA_URL`.
3. Actualiza las fechas del calendario en `const STEPS`, con el formato `"AAAA-MM-DD"`.

### Contactos · `js/datos.js`
Edita `PEOPLE_GE` (Gestión Empresarial) y `PEOPLE_DIV` (divisiones). El teléfono general está en `const TEL`.

### Empresas vinculadas · `js/empresas.js`
Cada línea es una empresa:

```js
{"n":"NOMBRE COMERCIAL","g":"ACTIVIDAD COMERCIAL","s":"Giro para el filtro","d":["eca"],"u":"Cancún"},
```

- `s` es el giro y debe coincidir con una categoría existente, como "Hotelería" o "Tecnología y telecomunicaciones". Una categoría nueva aparecerá sola en el filtro.
- `d` lista una o varias divisiones afines: `"eca"`, `"ing"`, `"tur"`, `"gas"`.
- `u` es la ubicación. Usa `"Por confirmar"` si no se conoce.
- Cuando cambie la lista, actualiza también `const FECHA_LISTA` en `js/datos.js`.

### Colores · `css/styles.css`
Los colores están al inicio del archivo, en el bloque `:root`. Los de las divisiones son `--div-eca`, `--div-ing`, `--div-tur` y `--div-gas`.

---

## Antes de publicar, verifica

- [ ] Fechas del calendario (`STEPS`) contra la agenda oficial del periodo.
- [ ] Nombres, cargos, correos y extensiones de los contactos.
- [ ] Vacantes reales, sin la marca `ejemplo:true`.
- [ ] Colores oficiales de las cuatro divisiones.
- [ ] Que los enlaces de los formatos y de los QR abran correctamente.
- [ ] Que la agenda en `docs/` sea la versión oficial vigente.

## Privacidad

El repositorio es **público**: cualquier persona puede ver todos sus archivos. Solo contiene información institucional que ya es pública, como contactos del departamento, enlaces y el listado de empresas. **Nunca subas datos personales de estudiantes** (nombres, matrículas, CURP o calificaciones). El checklist de estadía guarda el avance solo en el navegador de cada estudiante y no envía información a ningún servidor.

---

Departamento de Gestión Empresarial · Secretaría de Vinculación · Universidad Tecnológica de Cancún · Edificio D
