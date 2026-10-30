import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Mascota, MascotaRequest, Filtros } from '../models/vetandes.model';
@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mascotas`;
  listar(params: Filtros = {}) {
    return this.http.get<Mascota[]>(this.url, { params });
  }
  obtener(id: number) {
    return this.http.get<Mascota>(`${this.url}/${id}`);
  }
  crear(d: MascotaRequest) {
    return this.http.post<Mascota>(this.url, d);
  }
  actualizar(id: number, d: MascotaRequest) {
    return this.http.put<Mascota>(`${this.url}/${id}`, d);
  }
  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
