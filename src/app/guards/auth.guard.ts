import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = async (route, state) => {

  const router = inject(Router);
  const auth = inject(Auth);
  const authService = inject(AuthService);

  const user = auth.currentUser;

  if (!user) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  const uid = user.uid;
  const rol = await authService.getUserRole(uid);

  if (!rol) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  localStorage.setItem('rol', rol);
  localStorage.setItem('uid', uid);

  const requiredRole = route.data?.['role'];

  if (requiredRole && rol !== requiredRole) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  return true;
};
