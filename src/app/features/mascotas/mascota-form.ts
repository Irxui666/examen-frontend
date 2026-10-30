import { Component, inject, signal, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MascotaService } from '../../core/services/mascota-service';
import { CampoError } from '../../shared/campo-error';
import { mensajeError, erroresDeValidacion } from '../../core/utils/http-error';
import { PropietarioService } from '../../core/services/propietario-service';
import { Propietario } from '../../core/models/vetandes.model';
@Component({
  selector: 'app-mascota-form',
  imports: [ReactiveFormsModule, RouterLink, CampoError],
  templateUrl: './mascota-form.html',
})
export class MascotaForm implements OnInit {
  private readonly service = inject(MascotaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propietariosService = inject(PropietarioService);
  readonly propietarios = signal<Propietario[]>([]);
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;
  readonly hoy =
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0') +
    '-' +
    String(new Date().getDate()).padStart(2, '0');
  readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    especie: ['', [Validators.required, Validators.pattern(/^(PERRO|GATO|OTRO)$/)]],
    raza: ['', Validators.maxLength(40)],
    fechaNacimiento: [
      '',
      [Validators.required, (c) => (c.value > this.hoy ? { futura: true } : null)],
    ],
    sexo: ['', [Validators.required, Validators.pattern(/^(M|H)$/)]],
    propietarioId: [0, [Validators.required, Validators.min(1)]],
  });
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly cargaFallida = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  ngOnInit() {
    this.propietariosService.listar().subscribe({
      next: (r) => this.propietarios.set(r),
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargaFallida.set(true);
      },
    });
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
      next: () => this.router.navigate(['/mascotas']),
      error: (e) => {
        this.error.set(mensajeError(e));
        this.campos.set(erroresDeValidacion(e));
      },
    });
  }
}
