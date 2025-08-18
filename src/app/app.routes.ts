import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => {
      return import('./features/home/components/home/home').then((c) => c.Home);
    },
  },
];
