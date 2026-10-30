# VetAndes Web

Examen Parcial II, versión B. Angular 22, componentes standalone, formularios reactivos y carga diferida. Adaptación de tarea 11.

## Ejecución

Con Node.js compatible con Angular 22, desde esta carpeta:

```powershell
npm ci
npm start
```

`npm start` ejecuta `ng serve`. Abrir `http://localhost:4200` con el backend en `http://localhost:8080`. Ambos archivos de `src/environments/` definen `apiUrl: 'http://localhost:8080/api/v1'`.

## Usuarios de prueba

| Usuario | Contraseña | Rol | Estado |
|---|---|---|---|
| admin | Vet2026* | ADMIN | Activo |
| recepcion | Vet2026* | RECEPCIONISTA | Activo |
| veterinario | Vet2026* | VETERINARIO | Activo |
| inactivo | Vet2026* | RECEPCIONISTA | Inactivo |

## Funcionalidades

- Prestaciones: buscador, altas y edición con el mismo formulario, eliminación y cambio de estado con confirmación.
- Mascotas: nombre, especie, raza, edad y propietario; filtro por propietario y lista desplegable desde la API.
- Atención con buscador por nombre de mascota o propietario, peso, diagnóstico, de una a ocho líneas sin repetir y cantidades de uno a tres. Prestaciones activas filtradas por especie y cálculo reactivo de subtotal, descuento y total. El POST envía únicamente los campos del contrato; el backend calcula los importes definitivos.
- Consulta con filtros, detalle, anulación con motivo y reporte agregado por especie.
- Login fuera del layout, sesión con signals y sessionStorage con vencimiento y cierre automático.
- Un interceptor agrega Bearer solo a la API y otro maneja 401 con cierre de sesión y returnUrl. Un 403 conserva la sesión.
- authGuard, invitadoGuard, permisoGuard, menú y botones por permisos, acceso denegado y 404.
- Errores de campos debajo de los controles y mensaje de 404/409 en la página. Un rechazo de atención conserva las líneas.

Todos los catálogos provienen del backend.

## Contrato consumido

Todas las rutas tienen el prefijo `/api/v1`. Excepto el login, necesitan `Authorization: Bearer <token>`.

| Método | Ruta | Permiso |
|---|---|---|
| POST | /auth/login | Público |
| GET | /auth/me | Autenticado |
| GET | /propietarios | MASCOTA_LEER |
| GET | /prestaciones?especie=PERRO | PRESTACION_LEER |
| GET | /prestaciones/{id} | PRESTACION_LEER |
| POST | /prestaciones | PRESTACION_ESCRIBIR |
| PUT, DELETE | /prestaciones/{id} | PRESTACION_ESCRIBIR |
| PATCH | /prestaciones/{id}/estado | PRESTACION_ESCRIBIR |
| GET | /mascotas?propietarioId=1 | MASCOTA_LEER |
| GET | /mascotas/{id} | MASCOTA_LEER |
| POST | /mascotas | MASCOTA_ESCRIBIR |
| PUT, DELETE | /mascotas/{id} | MASCOTA_ESCRIBIR |
| POST | /atenciones | ATENCION_REGISTRAR |
| GET | /atenciones?mascota=Lun&especie=PERRO&estado=REGISTRADA&desde=2026-10-01&hasta=2026-10-30 | ATENCION_LEER |
| GET | /atenciones/{id} | ATENCION_LEER |
| PATCH | /atenciones/{id}/anular | ATENCION_ANULAR |
| GET | /reportes/atenciones-por-especie?desde=2026-10-01&hasta=2026-10-30 | REPORTE_VER |

Los filtros son opcionales y combinables. Las fechas incluyen ambos días. La consulta de atenciones busca nombre parcial sin distinguir mayúsculas, ordena por fecha descendente y devuelve `[]` sin resultados. El reporte devuelve `especie`, `cantidadAtenciones` e `importeTotal`, excluye anuladas y ordena por importe descendente.

Cuerpos de petición:

```json
{
  "login": {"username":"recepcion","password":"Vet2026*"},
  "prestacion": {"codigo":"PRS-010","nombre":"Control general","precio":45,"especieAplicable":"TODAS"},
  "estado": {"activo":false},
  "mascota": {"nombre":"Kira","especie":"PERRO","raza":"Mestizo","fechaNacimiento":"2023-01-01","sexo":"H","propietarioId":1},
  "atencion": {"mascotaId":1,"peso":12.5,"diagnostico":"Control general","detalles":[{"prestacionId":1,"cantidad":1},{"prestacionId":2,"cantidad":1},{"prestacionId":4,"cantidad":1}]},
  "anulacion": {"motivo":"Registro duplicado por error"}
}
```

Los nombres exteriores del ejemplo agrupan operaciones; se envía únicamente el objeto de la operación correspondiente.

El login devuelve `token`, `tipo`, `expiraEnSegundos`, `username`, `nombreCompleto`, `roles` y `permisos`. `/auth/me` devuelve datos, roles y permisos sin contraseña. Mascota añade `id` y `propietarioNombre`, sin anidar entidades. Una atención devuelve cabecera, detalles y totales calculados en el servicio.

201 al registrar, 200 al consultar o actualizar y 204 al eliminar. Errores: 400 validación/formato; 401 token ausente, alterado o vencido, credenciales incorrectas o cuenta inactiva; 403 autenticado sin permiso; 404 recurso inexistente; 409 conflicto de negocio; 500 inesperado.

```json
{"timestamp":"2026-10-30T11:00:00","status":400,"error":"Bad Request","mensaje":"Datos inválidos","ruta":"/api/v1/mascotas","campos":{"fechaNacimiento":"La fecha de nacimiento no puede ser futura"}}
```

`campos` aparece únicamente en errores de validación.

## Comprobación y entrega

```powershell
npm run build
npm test -- --watch=false
```

Compilación y 33 pruebas del frontend verificadas. En Chrome se comprobaron ambos CRUD, el 409 por mascota duplicada, atención con descuento, filtros, anulación, menú y rutas por permisos y expiración tras recargar.

Las capturas se obtuvieron con el backend real en el perfil H2 de pruebas. La revisión final verificó 40 peticiones contra Oracle y los tres perfiles en Chrome, incluidas las validaciones, los permisos y la expiración de sesión.

Ramas locales `main`, `develop` y `examen-b-condori`, etiqueta `v1.0-examen-u2`. Falta configurar y publicar el remoto propio `vetandes-frontend`. La carpeta conserva el nombre de tarea 11, según la ubicación indicada.
