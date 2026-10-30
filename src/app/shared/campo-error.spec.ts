import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampoError } from './campo-error';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CampoError],
  template: `<form [formGroup]="form" (ngSubmit)="form.markAllAsTouched()">
    <input formControlName="nombre" />
    <app-campo-error [control]="form.controls.nombre" />
    <button type="submit">Guardar</button>
  </form>`,
})
class FormularioPrueba {
  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
}

describe('CampoError con formularios OnPush', () => {
  it('muestra el error al enviar sin cambiar la referencia del control', async () => {
    const fixture = TestBed.createComponent(FormularioPrueba);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.field-error')?.textContent).toContain(
      'Este campo es obligatorio.',
    );
  });

  it('retira el error cuando el usuario completa el campo', async () => {
    const fixture = TestBed.createComponent(FormularioPrueba);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Luna';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.field-error')).toBeNull();
  });
});
