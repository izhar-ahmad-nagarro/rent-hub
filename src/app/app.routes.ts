import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => {
      return import('./features/home/components/home/home.component').then(
        (c) => c.HomeComponent
      );
    },
  },
  {
    path: 'property',
    loadChildren: () =>
      import('./features/property/property.routes').then(
        (m) => m.PROPERTY_ROUTES
      ),
  },
  {
    path: 'landlord',
    loadChildren: () =>
      import('./features/landlord/landlord.routes').then(
        (m) => m.LANDLORD_ROUTES
      ),
  },
  { path: '**', redirectTo: '/home' },
];
