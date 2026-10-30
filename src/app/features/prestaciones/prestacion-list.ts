import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PrestacionService } from '../../core/services/prestacion-service';
import { Prestacion } from '../../core/models/vetandes.model';
import { SiPermiso } from '../../shared/directives/si-permiso';
import { mensajeError } from '../../core/utils/http-error';
@Component({
  selector: 'app-prestacion-list',
  imports: [CurrencyPipe, RouterLink, FormsModule, SiPermiso],
  templateUrl: './prestacion-list.html',
})
export class PrestacionList implements OnInit {
  private readonly service = inject(PrestacionService);
  readonly items = signal<Prestacion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly buscando = signal('');
  readonly ocupado = signal(false);
  readonly visibles = computed(() =>
    this.items().filter((p) =>
      (p.nombre + ' ' + p.codigo).toLowerCase().includes(this.buscando().toLowerCase()),
    ),
  );
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.service
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({ next: (r) => this.items.set(r), error: (e) => this.error.set(mensajeError(e)) });
  }
  estado(p: Prestacion) {
    if (
      this.ocupado() ||
      !confirm(p.activo ? '¿Dar de baja esta prestación?' : '¿Activar esta prestación?')
    )
      return;
    this.ocupado.set(true);
    this.service
      .estado(p.id, !p.activo)
      .pipe(finalize(() => this.ocupado.set(false)))
      .subscribe({ next: () => this.cargar(), error: (e) => this.error.set(mensajeError(e)) });
  }
  eliminar(p: Prestacion) {
    if (this.ocupado() || !confirm('¿Eliminar definitivamente esta prestación?')) return;
    this.ocupado.set(true);
    this.service
      .eliminar(p.id)
      .pipe(finalize(() => this.ocupado.set(false)))
      .subscribe({ next: () => this.cargar(), error: (e) => this.error.set(mensajeError(e)) });
  }
}
