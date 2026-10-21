/* =========================================================
   DATOS EDITABLES DEL SITIO
   Aquí se cambian vacantes, contactos, fechas y la agenda.
   Respeta comillas, comas y corchetes al editar.
   ========================================================= */
const AGENDA_URL = "docs/Agenda-Estadias-ENE-ABR-2027.pdf";   // Cambia el nombre si subes otra agenda a la carpeta docs/
const FECHA_LISTA = "6 de julio de 2026";   // Fecha de actualización del listado de empresas
const DIVS = {
  eca:{n:"Económico-Administrativa", c:"var(--div-eca)"},
  ing:{n:"Ingeniería y Tecnología",  c:"var(--div-ing)"},
  tur:{n:"Turismo",                  c:"var(--div-tur)"},
  gas:{n:"Gastronomía",              c:"var(--div-gas)"}
};
/* Vacantes: reemplazar los ejemplos por vacantes reales. Deja el arreglo vacío [] si no hay vacantes. */
const VACANTES = [
  {puesto:"[Nombre del puesto]", empresa:"[Empresa]", div:"eca", modalidad:"[Presencial / Híbrido]", ubicacion:"[Ubicación]", dirigida:"[Estudiantes / Egresados]", ejemplo:true},
  {puesto:"[Nombre del puesto]", empresa:"[Empresa]", div:"tur", modalidad:"[Presencial / Híbrido]", ubicacion:"[Ubicación]", dirigida:"[Estudiantes / Egresados]", ejemplo:true},
  {puesto:"[Nombre del puesto]", empresa:"[Empresa]", div:"ing", modalidad:"[Presencial / Híbrido]", ubicacion:"[Ubicación]", dirigida:"[Estudiantes / Egresados]", ejemplo:true}
];
const TEL = "+529988811900";
const PEOPLE_GE = [
  {role:"Bolsa de trabajo", name:"Javier Castillo", mail:"bolsadetrabajo@utcancun.edu.mx", ext:"1151", feature:true},
  {role:"Convenios", name:"Rubí Quintero", mail:"rquintero@utcancun.edu.mx", ext:"1131", feature:true},
  {role:"Gestión Empresarial", name:"Lic. Carlos Antonio Peraza Magaña", mail:"cperaza@utcancun.edu.mx", ext:"1319 y 1141"},
  {role:"Estadías", name:"Lic. Flor Abigail Pacheco Dzul", mail:"estadia@utcancun.edu.mx", ext:"1319"},
  {role:"Estadías", name:"C. Remedios Sánchez May", mail:"rsanchez@utcancun.edu.mx", ext:"1141"}
];
const PEOPLE_DIV = [
  {role:"Económico-Administrativa", name:"Lic. Karla Mónica Flores García", mail:"kflores@utcancun.edu.mx", c:"var(--div-eca)"},
  {role:"Ingeniería y Tecnología", name:"Dra. Rocío Arceo Díaz", mail:"rarceo@utcancun.edu.mx", c:"var(--div-ing)"},
  {role:"Turismo", name:"Mtra. Mariana Recio López", mail:"mrecio@utcancun.edu.mx", c:"var(--div-tur)"},
  {role:"Gastronomía", name:"Mtro. Manuel Rivero Rivero", mail:"mrivero@utcancun.edu.mx", c:"var(--div-gas)"}
];
/* Calendario del periodo (fuente: Agenda de Actividades Enero–Abril 2027) */
const STEPS = [
  {n:"1", t:"Pláticas de inducción", s:"2026-10-26", e:"2026-10-30", w:"26 – 30 oct 2026", d:"Acude en la fecha y horario que te asignen; el calendario se envía a tu división. Si eres de reingreso, preséntate en Gestión Empresarial."},
  {n:"2", t:"Elige tu empresa", s:"2026-10-26", e:"2026-11-13", w:"26 oct – 13 nov 2026", d:"Elige una empresa vinculada. Si la tuya no está en la lista, este es el periodo para solicitar su vinculación.", link:["#empresas","Ver empresas vinculadas"]},
  {n:"3", t:"Descarga tu carta de presentación", s:"2026-12-11", e:"2027-01-08", w:"11 dic 2026 – 8 ene 2027", d:"Llévala a la empresa para que Recursos Humanos o el área asignada la firme, selle y escriba el nombre del responsable. Guárdala para el paso 5."},
  {m:true, t:"Inicia tu estadía", s:"2027-01-07", e:"2027-01-07", w:"7 ene 2027"},
  {n:"4", t:"Haz tu registro de estadía", s:"2027-01-07", e:"2027-01-22", w:"7 – 22 ene", d:"Captura tus datos, los de la empresa, tu asesor empresarial y la modalidad."},
  {n:"5", t:"Entrega tu carta de presentación", s:"2027-01-07", e:"2027-01-22", w:"7 – 22 ene", d:"En Gestión Empresarial, Edificio D, de 8:00 a 17:00 h. Original y copia, firmada, sellada y con el nombre del responsable."},
  {m:true, t:"Límite para cambio de empresa y documentos de estadía foránea", s:"2027-01-18", e:"2027-01-18", w:"18 ene 2027"},
  {n:"6", t:"Responde las encuestas de egresados", s:"2027-03-16", e:"2027-03-19", w:"16 – 19 mar", d:"Registro y actualización de datos de egresados, y encuesta de satisfacción. Ambas obligatorias."},
  {n:"7", t:"Entrega documentos en tu división", w:"Fecha que indique tu división", d:"Entrega los documentos que solicite tu división académica en la fecha y horario que te indiquen."},
  {n:"8", t:"Evaluación académica", w:"Fecha que indique tu división", d:"Pide el formato a tu asesor académico, dáselo a tu asesor empresarial para que lo califique y firme, y regrésalo."},
  {n:"9", t:"Pide tu carta de liberación", s:"2027-03-31", e:"2027-03-31", w:"A más tardar 31 mar", d:"Dirigida al Lic. Carlos Antonio Peraza Magaña. Debe incluir tu nombre completo, carrera y matrícula, periodo, área asignada y total de horas. Con fecha de la última semana de marzo en adelante."},
  {m:true, t:"Termina tu estadía", s:"2027-04-16", e:"2027-04-16", w:"16 abr 2027"},
  {n:"10", t:"Entrega final en Gestión Empresarial", s:"2027-04-01", e:"2027-04-30", w:"Abril, según calendario", d:"Carta de liberación (original y copia) y 2 fotos tamaño infantil. Consulta tu día y hora en el Facebook de Estadía Profesional."}
];
const CHECK = ["Asistí a la plática de inducción","Elegí empresa vinculada","Descargué la carta de presentación","Registro de estadía capturado","Carta de presentación entregada (original y copia)","Encuestas de egresados respondidas","Documentos entregados en mi división","Evaluación académica realizada","Carta de liberación revisada","2 fotos tamaño infantil listas","Entrega final en Gestión Empresarial"];
