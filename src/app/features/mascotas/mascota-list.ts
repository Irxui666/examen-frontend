import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MascotaService } from '../../core/services/mascota-service';
import { PropietarioService } from '../../core/services/propietario-service';
import { Mascota, Propietario } from '../../core/models/vetandes.model';
import { SiPermiso } from '../../shared/directives/si-permiso';
import { mensajeError } from '../../core/utils/http-error';
@Component({
  selector: 'app-mascota-list',
  imports: [RouterLink, FormsModule, SiPermiso],
  templateUrl: './mascota-list.html',
})
export class MascotaList implements OnInit {
  private readonly service = inject(MascotaService);
  private readonly propietariosService = inject(PropietarioService);
  readonly items = signal<Mascota[]>([]);
  readonly propietarios = signal<Propietario[]>([]);
  readonly cargando = signal(false);
  readonly ocupado = signal(false);
  readonly error = signal('');
  propietarioId = '';
  ngOnInit() {
    this.cargar();
    this.propietariosService
      .listar()
      .subscribe({
        next: (r) => this.propietarios.set(r),
        error: (e) => this.error.set(mensajeError(e)),
      });
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.service
      .listar(this.propietarioId ? { propietarioId: this.propietarioId } : {})
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({ next: (r) => this.items.set(r), error: (e) => this.error.set(mensajeError(e)) });
  }
  edad(fecha: string) {
    const hoy = new Date();
    const n = new Date(fecha + 'T00:00:00');
    let edad = hoy.getFullYear() - n.getFullYear();
    if (
      hoy.getMonth() < n.getMonth() ||
      (hoy.getMonth() === n.getMonth() && hoy.getDate() < n.getDate())
    )
      edad--;
    return edad;
  }
  eliminar(m: Mascota) {
    if (this.ocupado() || !confirm('¿Eliminar esta mascota?')) return;
    this.ocupado.set(true);
    this.service
      .eliminar(m.id)
      .pipe(finalize(() => this.ocupado.set(false)))
      .subscribe({ next: () => this.cargar(), error: (e) => this.error.set(mensajeError(e)) });
  }
}
