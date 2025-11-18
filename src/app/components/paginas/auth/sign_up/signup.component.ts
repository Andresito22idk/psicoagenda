import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';


import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  nombre = "";
  apellido = "";
  email = "";
  password = "";
  errorMessage = "";

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService
  ) {}

  async register() {
    this.errorMessage = "";

    if (!this.nombre || !this.apellido || !this.email || !this.password) {
      this.errorMessage = "Todos los campos son obligatorios.";
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      const uid = cred.user.uid;

      await setDoc(doc(this.firestore, "users", uid), {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        rol: "cliente"
      });

      this.router.navigate(['/login']);

    } catch (e) {
      console.error(e);
      this.errorMessage = "No se pudo crear la cuenta.";
    }
  }
}
