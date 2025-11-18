import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = async (route, state) => {

  const router = inject(Router);
  const auth = inject(Auth);
  const authService = inject(AuthService);

  const user = await new Promise<any>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      resolve(u);
      unsub();
    });
  });

  if (!user) {
    localStorage.clear();
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  // Si intenta ir al login estando logueado
  if (state.url === '/login') {
    router.navigate(['/home'], { replaceUrl: true });
    return false;
  }

  //  Bloqueo suave para evitar salir de /turnos con botón atrás
  if (state.url === '/turnos') {
    history.pushState(null, '', '/turnos');
  }

  const uid = user.uid;
  const rol = await authService.getUserRole(uid);

  if (!rol) {
    localStorage.clear();
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  localStorage.setItem('uid', uid);
  localStorage.setItem('rol', rol);

  const requiredRole = route.data?.['role'];

  if (requiredRole && rol !== requiredRole) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  return true;
};
