import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  usuarioNombre = localStorage.getItem('userNombre') || 'Usuario';
  fechaSeleccionada = "";
  mostrarErrorFecha = false;

  profesionales = [
    {
      id: 1,
      nombre: 'Dra. Sofía Torres',
      especialidad: 'Psicología',
      descripcion: 'Especialista en terapia cognitivo-conductual (TCC) con más de 10 años de experiencia en ansiedad, estrés y manejo emocional. Acompaña a sus pacientes con un enfoque cálido y práctico.',
      imagen: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'
    },
    {
      id: 2,
      nombre: 'Dr. Mateo Ríos',
      especialidad: 'Psiquiatría',
      descripcion: 'Psiquiatra clínico experto en trastornos del estado de ánimo, depresión y tratamiento farmacológico. Combina medicina basada en evidencia con un enfoque humano e integral.',
      imagen: 'https://cdn-icons-png.flaticon.com/512/2922/2922656.png'
    },
    {
      id: 3,
      nombre: 'Dra. Valentina Cruz',
      especialidad: 'Neuropsicología',
      descripcion: 'Neuropsicóloga especializada en evaluación cognitiva, memoria, atención y funciones ejecutivas. Ayuda a pacientes con secuelas neurológicas y dificultades de aprendizaje.',
      imagen: 'https://cdn-icons-png.flaticon.com/512/2922/2922688.png'
    }
  ];

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('userNombre')) {
      this.router.navigate(['/login']);
    }
  }

  agendar(prof: any) {
    if (!this.fechaSeleccionada) {
      this.mostrarErrorFecha = true;
      return;
    }

    this.mostrarErrorFecha = false;

    alert(`Cita agendada con ${prof.nombre} para el día ${this.fechaSeleccionada}.`);
  }

  verTurnos() {
    alert("Aquí se mostrarán tus turnos.");
  }

  logout() {
    signOut(this.auth).then(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

}
