import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response';
export function mensajeError(err: HttpErrorResponse): string {
  if (err.status === 0 || err.status === 502 || err.status === 504)
    return 'No se pudo conectar con VetAndes API.';
  return (err.error as ErrorResponse | null)?.mensaje ?? `Error ${err.status}: ${err.statusText}`;
}
export function erroresDeValidacion(err: HttpErrorResponse): Record<string, string> {
  return (err.error as ErrorResponse | null)?.campos ?? {};
}
