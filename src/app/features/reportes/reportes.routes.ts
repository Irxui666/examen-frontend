import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
export const REPORTES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'atenciones-por-especie' },
  {
    path: 'atenciones-por-especie',
    canActivate: [permisoGuard],
    data: { permiso: 'REPORTE_VER' },
    loadComponent: () => import('./reporte-especie').then((m) => m.ReporteEspeciePage),
  },
];
