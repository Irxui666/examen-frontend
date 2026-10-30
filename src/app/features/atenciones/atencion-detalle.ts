import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AtencionService } from '../../core/services/atencion-service';
import { Atencion } from '../../core/models/vetandes.model';
import { SiPermiso } from '../../shared/directives/si-permiso';
import { CampoError } from '../../shared/campo-error';
import { mensajeError, erroresDeValidacion } from '../../core/utils/http-error';
@Component({
  selector: 'app-atencion-detalle',
  imports: [DatePipe, CurrencyPipe, RouterLink, ReactiveFormsModule, SiPermiso, CampoError],
  templateUrl: './atencion-detalle.html',
})
export class AtencionDetalle implements OnInit {
  private readonly service = inject(AtencionService);
  private readonly route = inject(ActivatedRoute);
  readonly atencion = signal<Atencion | null>(null);
  readonly error = signal('');
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly campos = signal<Record<string, string>>({});
  readonly registrada = this.route.snapshot.queryParamMap.get('registrada');
  readonly form = inject(NonNullableFormBuilder).group({
    motivo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
  });
  ngOnInit() {
    this.service
      .obtener(Number(this.route.snapshot.paramMap.get('id')))
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (r) => this.atencion.set(r),
        error: (e) => this.error.set(mensajeError(e)),
      });
  }
  anular() {
    this.form.markAllAsTouched();
    const a = this.atencion();
    if (!a || this.form.invalid || this.guardando() || !confirm('¿Anular esta atención?')) return;
    this.guardando.set(true);
    this.error.set('');
    this.campos.set({});
    this.service
      .anular(a.id, this.form.getRawValue().motivo)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (r) => this.atencion.set(r),
        error: (e) => {
          this.error.set(mensajeError(e));
          this.campos.set(erroresDeValidacion(e));
        },
      });
  }
}
