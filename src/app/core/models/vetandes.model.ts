export interface Propietario {
  id: number;
  dni: string;
  nombres: string;
  telefono: string;
}
export interface PrestacionRequest {
  codigo: string;
  nombre: string;
  precio: number;
  especieAplicable: string;
}
export interface Prestacion extends PrestacionRequest {
  id: number;
  activo: boolean;
}
export interface MascotaRequest {
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  propietarioId: number;
}
export interface Mascota extends MascotaRequest {
  id: number;
  propietarioNombre: string;
}
export interface DetalleRequest {
  prestacionId: number;
  cantidad: number;
}
export interface AtencionRequest {
  mascotaId: number;
  peso: number;
  diagnostico: string;
  detalles: DetalleRequest[];
}
export interface DetalleAtencion extends DetalleRequest {
  id: number;
  prestacionNombre: string;
  precioUnitario: number;
  subtotal: number;
}
export interface Atencion {
  id: number;
  numero: string;
  fecha: string;
  mascotaId: number;
  mascotaNombre: string;
  especie: string;
  propietarioNombre: string;
  peso: number;
  diagnostico: string;
  estado: string;
  subtotal: number;
  descuento: number;
  total: number;
  usuarioRegistro: string;
  motivoAnulacion: string | null;
  detalles: DetalleAtencion[];
}
export interface ReporteEspecie {
  especie: string;
  cantidadAtenciones: number;
  importeTotal: number;
}
export type Filtros = Record<string, string | number>;
