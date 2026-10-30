import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Prestacion, PrestacionRequest, Filtros } from '../models/vetandes.model';
@Injectable({ providedIn: 'root' })
export class PrestacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/prestaciones`;
  listar(params: Filtros = {}) {
    return this.http.get<Prestacion[]>(this.url, { params });
  }
  obtener(id: number) {
    return this.http.get<Prestacion>(`${this.url}/${id}`);
  }
  crear(d: PrestacionRequest) {
    return this.http.post<Prestacion>(this.url, d);
  }
  actualizar(id: number, d: PrestacionRequest) {
    return this.http.put<Prestacion>(`${this.url}/${id}`, d);
  }
  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  estado(id: number, activo: boolean) {
    return this.http.patch<Prestacion>(`${this.url}/${id}/estado`, { activo });
  }
}
