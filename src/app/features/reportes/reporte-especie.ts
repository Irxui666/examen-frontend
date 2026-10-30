import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ReporteService } from '../../core/services/reporte-service';
import { ReporteEspecie, Filtros } from '../../core/models/vetandes.model';
import { mensajeError } from '../../core/utils/http-error';
@Component({
  selector: 'app-reporte-especie',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './reporte-especie.html',
})
export class ReporteEspeciePage implements OnInit {
  private readonly service = inject(ReporteService);
  readonly items = signal<ReporteEspecie[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  desde = '';
  hasta = '';
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    const params: Filtros = {};
    if (this.desde) params['desde'] = this.desde;
    if (this.hasta) params['hasta'] = this.hasta;
    this.service
      .porEspecie(params)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({ next: (r) => this.items.set(r), error: (e) => this.error.set(mensajeError(e)) });
  }
}
