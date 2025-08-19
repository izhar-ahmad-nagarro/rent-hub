import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => {
      return import('./features/home/components/home/home').then((c) => c.Home);
    }
  },
  {
    path: 'add-property',
    loadComponent: () => {
      return import(
        './features/home/components/add-property/add-property'
      ).then((c) => c.AddProperty);
    },
  },
  { path: '**', redirectTo: '/home' }
];
