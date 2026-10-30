import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReporteEspecie, Filtros } from '../models/vetandes.model';
@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);
  porEspecie(params: Filtros = {}) {
    return this.http.get<ReporteEspecie[]>(
      `${environment.apiUrl}/reportes/atenciones-por-especie`,
      { params },
    );
  }
}
