import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Atencion, AtencionRequest, Filtros } from '../models/vetandes.model';
@Injectable({ providedIn: 'root' })
export class AtencionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/atenciones`;
  listar(params: Filtros = {}) {
    return this.http.get<Atencion[]>(this.url, { params });
  }
  obtener(id: number) {
    return this.http.get<Atencion>(`${this.url}/${id}`);
  }
  registrar(d: AtencionRequest) {
    return this.http.post<Atencion>(this.url, d);
  }
  anular(id: number, motivo: string) {
    return this.http.patch<Atencion>(`${this.url}/${id}/anular`, { motivo });
  }
}
