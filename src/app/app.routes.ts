import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './core/guards/auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'VetAndes',
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'acceso-denegado',
        loadComponent: () =>
          import('./shared/pages/acceso-denegado/acceso-denegado').then((m) => m.AccesoDenegado),
      },
      {
        path: 'prestaciones',
        loadChildren: () =>
          import('./features/prestaciones/prestaciones.routes').then((m) => m.PRESTACIONES_ROUTES),
      },
      {
        path: 'mascotas',
        loadChildren: () =>
          import('./features/mascotas/mascotas.routes').then((m) => m.MASCOTAS_ROUTES),
      },
      {
        path: 'atenciones',
        loadChildren: () =>
          import('./features/atenciones/atenciones.routes').then((m) => m.ATENCIONES_ROUTES),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./features/reportes/reportes.routes').then((m) => m.REPORTES_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/no-encontrado/no-encontrado').then((m) => m.NoEncontrado),
  },
];
