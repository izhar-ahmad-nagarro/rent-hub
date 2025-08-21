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
    path: 'property/add',
    loadComponent: () => {
      return import(
        './features/home/components/add-property/add-property'
      ).then((c) => c.AddProperty);
    },
  },
  {
    path: 'property/details/:id',
    loadComponent: () => {
      return import(
        './features/home/components/property-details/property-details.component'
      ).then((c) => c.PropertyDetailsComponent);
    },
  },
  { path: '**', redirectTo: '/home' }
];
