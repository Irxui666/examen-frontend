import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
export const MASCOTAS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permisoGuard],
    data: { permiso: 'MASCOTA_LEER' },
    loadComponent: () => import('./mascota-list').then((m) => m.MascotaList),
  },
  {
    path: 'nuevo',
    canActivate: [permisoGuard],
    data: { permiso: 'MASCOTA_ESCRIBIR' },
    loadComponent: () => import('./mascota-form').then((m) => m.MascotaForm),
  },
  {
    path: ':id/editar',
    canActivate: [permisoGuard],
    data: { permiso: 'MASCOTA_ESCRIBIR' },
    loadComponent: () => import('./mascota-form').then((m) => m.MascotaForm),
  },
];
