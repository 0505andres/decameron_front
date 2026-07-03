import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome.component').then((m) => m.WelcomeComponent)
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/reservas/reservas-page.component').then((m) => m.ReservasPageComponent)
  },
  {
    path: 'reporte',
    loadComponent: () => import('./pages/reporte/reporte-page.component').then((m) => m.ReportePageComponent)
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];

