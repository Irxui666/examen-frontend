import { Component, inject, signal, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PrestacionService } from '../../core/services/prestacion-service';
import { CampoError } from '../../shared/campo-error';
import { mensajeError, erroresDeValidacion } from '../../core/utils/http-error';

@Component({
  selector: 'app-prestacion-form',
  imports: [ReactiveFormsModule, RouterLink, CampoError],
  templateUrl: './prestacion-form.html',
})
export class PrestacionForm implements OnInit {
  private readonly service = inject(PrestacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;
  readonly form = inject(NonNullableFormBuilder).group({
    codigo: ['', [Validators.required, Validators.pattern(/^PRS-[0-9]{3}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    precio: [
      0,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(99999999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    especieAplicable: ['', [Validators.required, Validators.pattern(/^(PERRO|GATO|TODAS)$/)]],
  });
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly cargaFallida = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  ngOnInit() {
    if (this.id) {
      this.cargando.set(true);
      this.service
        .obtener(this.id)
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
          next: (r) => this.form.patchValue(r),
          error: (e) => {
            this.error.set(mensajeError(e));
            this.cargaFallida.set(true);
          },
        });
    }
  }
  guardar() {
    if (this.guardando() || this.cargando() || this.cargaFallida()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.error.set('');
    this.campos.set({});
    const d = this.form.getRawValue();
    const request = this.id ? this.service.actualizar(this.id, d) : this.service.crear(d);
    request.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => this.router.navigate(['/prestaciones']),
      error: (e) => {
        this.error.set(mensajeError(e));
        this.campos.set(erroresDeValidacion(e));
      },
    });
  }
}
