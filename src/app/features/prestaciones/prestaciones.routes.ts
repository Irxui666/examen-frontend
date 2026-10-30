import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
export const PRESTACIONES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permisoGuard],
    data: { permiso: 'PRESTACION_LEER' },
    loadComponent: () => import('./prestacion-list').then((m) => m.PrestacionList),
  },
  {
    path: 'nuevo',
    canActivate: [permisoGuard],
    data: { permiso: 'PRESTACION_ESCRIBIR' },
    loadComponent: () => import('./prestacion-form').then((m) => m.PrestacionForm),
  },
  {
    path: ':id/editar',
    canActivate: [permisoGuard],
    data: { permiso: 'PRESTACION_ESCRIBIR' },
    loadComponent: () => import('./prestacion-form').then((m) => m.PrestacionForm),
  },
];
