import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Miamora | French-made Eau de Parfum, delivered in South Africa',
  },
  // Rendered to 404.html by scripts/postbuild.mjs; GitHub Pages serves it for unknown URLs.
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found | Miamora',
  },
  { path: '**', redirectTo: '404' },
];
