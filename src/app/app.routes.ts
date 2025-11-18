import { Routes } from '@angular/router';
import { LoginComponent } from './components/paginas/auth/login/login.component';
import { SignupComponent } from './components/paginas/auth/sign_up/signup.component';
import { HomeComponent } from './components/paginas/home/home.component';
import { AdminComponent } from './components/paginas/admin/admin.component';
import { TurnosComponent } from './components/turnos/turnos.component';

// Importar standalone components en rutas
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { role: 'cliente' }
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },

  //FIX IMPORTANTE: standalone components deben declararse aquí al usarlos
  {
    path: 'turnos',
    component: TurnosComponent,
    canActivate: [AuthGuard],
    data: { role: 'cliente' }
  },

  { path: '**', redirectTo: 'login' }
];
