el módulo “Alistamiento Debate” para integrarlo a mi sistema actual.
Mi app ya tiene un diseño, estilos y una arquitectura establecida, así que no inventes estilos nuevos, sino que adapta todas las interfaces a mis componentes actuales (inputs, modales, tablas, botones, layout, colores, spacing).

A continuación te describo el módulo y todas las vistas que debe incluir.

🔶 CONTEXTO DEL MÓDULO

El módulo se llama Alistamiento Debate y contiene varios submódulos.
Su función es registrar información administrativa generada por coordinadores y militantes.

🔷 SUBMÓDULOS A CREAR
### 1️⃣ Planillas

Formulario con los siguientes campos:

Seleccionar Coordinador (dropdown cargado desde Supabase)

Seleccionar Militante (dropdown dependiente del coordinador)

Radicado (número)

Cautivo (número)

Marketing (número)

Impacto (número)

Fecha Planilla (date picker)

Acciones:

Crear

Editar

Listar con tabla

Eliminar

Validaciones:

Ningún campo obligatorio vacío

Solo números válidos

Fecha válida

2️⃣ Inconsistencias

Campos:

Coordinador (dropdown)

Radical (número)

Exclusión (número)

Fuera Barranquilla (número)

Fecha Inconsistencia (date)

Fecha Resolución (date)

Cantidad Resuelto (número)

Funciones:

Crear, Editar, Listar, Borrar

3️⃣ Casa Estratégica

Campos:

Coordinador (dropdown)

Dirección (texto)

Ciudad (dropdown)

Barrio (dropdown dependiente)

Medidas (texto)

Tipo de Publicidad (dropdown)

Fecha Instalación (date)

Fecha Desinstalación (date opcional)

CRUD completo.

4️⃣ Vehículo Amigo

Campos:

Coordinador

Propietario

Número de Placa

Tipo de Vehículo

Fecha Registro

Observaciones

CRUD completo.

5️⃣ Publicidad Vehículo

Campos:

Coordinador

Tipo de Publicidad

Medidas

Ciudad

Barrio

Fecha Instalación

Fecha Desinstalación

CRUD completo.

6️⃣ Reportes (solo lectura)

Pantalla con:

Filtros avanzados: Coordinador, fecha, tipo

Tablas resumidas por cada submódulo

Exportación XLS y PDF

📌 REQUISITOS DEL RESULTADO

Cuando generes la respuesta, produce:

✔ Código de las vistas (React, Vue o el stack que yo esté usando — te lo diré cuando respondas)
✔ Componentes separados reutilizables
✔ Llamadas a Supabase
✔ Validaciones
✔ Diseño totalmente adaptado al estilo actual de mi app (NO inventar uno nuevo)
✔ Estructura de archivos sugerida
✔ Explicación del flujo