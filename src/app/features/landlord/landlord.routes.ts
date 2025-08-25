import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const LANDLORD_ROUTES: Routes = [
  {
    path: 'listings',
    loadComponent: () => {
      return import('./components/my-listings/my-listings.component').then(
        (c) => c.MyListingsComponent
      );
    },
    data: {
      roles: ['LandLord'],
    },
    canActivate: [roleGuard],
  },
];
