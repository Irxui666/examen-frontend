import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';
import { MascotaService } from '../../core/services/mascota-service';
import { PrestacionService } from '../../core/services/prestacion-service';
import { AtencionService } from '../../core/services/atencion-service';
import { Mascota, Prestacion } from '../../core/models/vetandes.model';
import { CampoError } from '../../shared/campo-error';
import { mensajeError, erroresDeValidacion } from '../../core/utils/http-error';
@Component({
  selector: 'app-atencion-form',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, CampoError],
  templateUrl: './atencion-form.html',
})
export class AtencionForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly mascotasService = inject(MascotaService);
  private readonly prestacionesService = inject(PrestacionService);
  private readonly service = inject(AtencionService);
  private readonly router = inject(Router);
  readonly mascotas = signal<Mascota[]>([]);
  readonly prestaciones = signal<Prestacion[]>([]);
  readonly cargando = signal(true);
  readonly cargaFallida = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly buscar = this.fb.control('');
  private readonly busqueda = toSignal(this.buscar.valueChanges, { initialValue: '' });
  readonly form = this.fb.group({
    mascotaId: [0, [Validators.required, Validators.min(1)]],
    peso: [
      0,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    diagnostico: ['', Validators.maxLength(300)],
    detalles: this.fb.array([this.linea()], [Validators.minLength(1), Validators.maxLength(8)]),
  });
  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  get detalles() {
    return this.form.controls.detalles;
  }
  private linea() {
    return this.fb.group({
      prestacionId: [0, [Validators.required, Validators.min(1)]],
      cantidad: [
        1,
        [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern(/^\d+$/)],
      ],
    });
  }
  readonly encontradas = computed(() =>
    this.mascotas().filter((m) =>
      (m.nombre + ' ' + m.propietarioNombre)
        .toLocaleLowerCase()
        .includes(this.busqueda().toLocaleLowerCase()),
    ),
  );
  readonly mascota = computed(() => this.mascotas().find((m) => m.id === this.valores().mascotaId));
  readonly disponibles = computed(() =>
    this.prestaciones().filter(
      (p) =>
        p.activo &&
        this.mascota() &&
        (p.especieAplicable === 'TODAS' || p.especieAplicable === this.mascota()?.especie),
    ),
  );
  readonly lineas = computed(() =>
    (this.valores().detalles ?? []).map((d) => {
      const p = this.prestaciones().find((p) => p.id === d.prestacionId);
      return {
        precio: p?.precio ?? 0,
        subtotal: Math.round((p?.precio ?? 0) * Number(d.cantidad ?? 0) * 100) / 100,
      };
    }),
  );
  readonly subtotal = computed(
    () => Math.round(this.lineas().reduce((s, d) => s + d.subtotal, 0) * 100) / 100,
  );
  readonly descuento = computed(() =>
    new Set((this.valores().detalles ?? []).map((d) => d.prestacionId).filter((id) => !!id)).size >=
    3
      ? Math.round(this.subtotal() * 10) / 100
      : 0,
  );
  readonly total = computed(() => Math.round((this.subtotal() - this.descuento()) * 100) / 100);
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.cargaFallida.set(false);
    this.error.set('');
    forkJoin({
      mascotas: this.mascotasService.listar(),
      prestaciones: this.prestacionesService.listar(),
    })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (r) => {
          this.mascotas.set(r.mascotas);
          this.prestaciones.set(r.prestaciones);
        },
        error: (e) => {
          this.cargaFallida.set(true);
          this.error.set(mensajeError(e));
        },
      });
  }
  elegir(m: Mascota) {
    if (this.guardando()) return;
    this.form.controls.mascotaId.setValue(m.id);
    this.detalles.clear();
    this.detalles.push(this.linea());
    this.buscar.setValue('');
  }
  usada(id: number, index: number) {
    return this.detalles.controls.some(
      (c, i) => i !== index && c.controls.prestacionId.value === id,
    );
  }
  agregar() {
    if (this.detalles.length < 8 && !this.guardando()) this.detalles.push(this.linea());
  }
  quitar(i: number) {
    if (this.detalles.length > 1 && !this.guardando()) this.detalles.removeAt(i);
  }
  guardar() {
    if (this.guardando() || this.cargando() || this.cargaFallida()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.mascota()) return;
    const d = this.form.getRawValue();
    if (new Set(d.detalles.map((l) => l.prestacionId)).size !== d.detalles.length) {
      this.error.set('No repita prestaciones.');
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.campos.set({});
    this.service
      .registrar(d)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (a) =>
          this.router.navigate(['/atenciones', a.id], { queryParams: { registrada: a.numero } }),
        error: (e) => {
          this.error.set(mensajeError(e));
          this.campos.set(erroresDeValidacion(e));
        },
      });
  }
}
