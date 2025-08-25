import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../../features';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as string[];
  const userRole = authService.currentUserRole(); 
  if (!expectedRoles.includes(UserRole[userRole!])) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
