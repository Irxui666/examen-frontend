import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
export const ATENCIONES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permisoGuard],
    data: { permiso: 'ATENCION_LEER' },
    loadComponent: () => import('./atencion-list').then((m) => m.AtencionList),
  },
  {
    path: 'nueva',
    canActivate: [permisoGuard],
    data: { permiso: 'ATENCION_REGISTRAR' },
    loadComponent: () => import('./atencion-form').then((m) => m.AtencionForm),
  },
  {
    path: ':id',
    canActivate: [permisoGuard],
    data: { permiso: 'ATENCION_LEER' },
    loadComponent: () => import('./atencion-detalle').then((m) => m.AtencionDetalle),
  },
];
