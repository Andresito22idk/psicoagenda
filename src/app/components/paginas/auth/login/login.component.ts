import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async loginEmail() {
    this.errorMessage = '';

    try {
      const cred = await this.authService.login(this.email, this.password);
      await this.finishLogin(cred.user.uid, cred.user.email!);

    } catch (e) {
      console.error(e);
      this.errorMessage = 'Credenciales incorrectas.';
    }
  }

  async loginGoogle() {
    this.errorMessage = '';

    try {
      const cred = await this.authService.loginWithGoogle();
      await this.finishLogin(cred.user.uid, cred.user.email!);

    } catch (e) {
      console.error(e);
      this.errorMessage = 'Error al iniciar sesión con Google.';
    }
  }

  private async finishLogin(uid: string, email: string) {

    // Asegura que el usuario existe en Firestore
    await this.authService.ensureUserExists(uid, email);

    // Obtiene el rol
    const rol = await this.authService.getUserRole(uid);

    if (!rol) {
      this.errorMessage = "Tu usuario no tiene rol asignado.";
      return;
    }

    // 🔥 Guardamos datos
    localStorage.setItem('rol', rol);
    localStorage.setItem('uid', uid);
    localStorage.setItem('userNombre', email.split('@')[0]); // <-- IMPORTANTE

    // Redireccionar según rol
    this.router.navigate([rol === 'admin' ? '/admin' : '/home'], { replaceUrl: true });
  }
}
