import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AtencionService } from '../../core/services/atencion-service';
import { Atencion, Filtros } from '../../core/models/vetandes.model';
import { SiPermiso } from '../../shared/directives/si-permiso';
import { mensajeError } from '../../core/utils/http-error';
@Component({
  selector: 'app-atencion-list',
  imports: [DatePipe, CurrencyPipe, FormsModule, RouterLink, SiPermiso],
  templateUrl: './atencion-list.html',
})
export class AtencionList implements OnInit {
  private readonly service = inject(AtencionService);
  readonly items = signal<Atencion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  filtros = { mascota: '', especie: '', estado: '', desde: '', hasta: '' };
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    const params: Filtros = {};
    Object.entries(this.filtros).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    this.service
      .listar(params)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({ next: (r) => this.items.set(r), error: (e) => this.error.set(mensajeError(e)) });
  }
}
