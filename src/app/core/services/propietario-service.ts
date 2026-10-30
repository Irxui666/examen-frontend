import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Propietario } from '../models/vetandes.model';
@Injectable({ providedIn: 'root' })
export class PropietarioService {
  private readonly http = inject(HttpClient);
  listar() {
    return this.http.get<Propietario[]>(`${environment.apiUrl}/propietarios`);
  }
}
