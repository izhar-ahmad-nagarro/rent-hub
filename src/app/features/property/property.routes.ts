import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const PROPERTY_ROUTES: Routes = [
  {
    path: ':id/details',
    loadComponent: () => {
      return import(
        './components/property-details/property-details.component'
      ).then((c) => c.PropertyDetailsComponent);
    },
  },
  {
    path: ':id/edit',
    loadComponent: () => {
      return import('./components/add-property/add-property.component').then(
        (c) => c.AddPropertyComponent
      );
    },
    data: {
      roles: ['LandLord'],
    },
    canActivate: [roleGuard],
  },
  {
    path: 'add',
    loadComponent: () => {
      return import('./components/add-property/add-property.component').then(
        (c) => c.AddPropertyComponent
      );
    },
    data: {
      roles: ['LandLord'],
    },
    canActivate: [roleGuard],
  },
];
