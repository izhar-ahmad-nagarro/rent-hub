import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => {
      return import('./features/home/components/home/home.component').then((c) => c.HomeComponent);
    }
  },
  {
    path: 'property/add',
    loadComponent: () => {
      return import(
        './features/home/components/add-property/add-property.component'
      ).then((c) => c.AddPropertyComponent);
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
