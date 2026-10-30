import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-campo-error',
  template: `@if (mensaje()) {
      <small class="field-error" role="alert">{{ mensaje() }}</small>
    } @else if (control()?.touched && control()?.invalid) {
      <small class="field-error">{{ local() }}</small>
    }`,
})
export class CampoError {
  readonly control = input<AbstractControl | null>(null);
  readonly mensaje = input<string>();
  local() {
    const e = this.control()?.errors ?? {};
    if (e['required']) return 'Este campo es obligatorio.';
    if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres.`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    if (e['min']) return `Valor mínimo: ${e['min'].min}.`;
    if (e['max']) return `Valor máximo: ${e['max'].max}.`;
    if (e['futura']) return 'La fecha de nacimiento no puede ser futura.';
    return 'Revise el formato del campo.';
  }
}
