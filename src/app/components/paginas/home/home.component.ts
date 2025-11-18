// src/app/components/paginas/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // datos del usuario
  usuarioNombre = localStorage.getItem('userNombre') || 'Usuario';
  usuarioUid = localStorage.getItem('uid') || '';
  userEmail = localStorage.getItem('userEmail') || '';

  // selección y validaciones
  fechaSeleccionada = '';
  mostrarErrorFecha = false;
  mostrarErrorHora = false; // corregido: usado en template si quieres mostrar error

  // horas maestras (mismas para todos los profesionales)
  horasDisponibles = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  // profesionales (imágenes públicas)
  profesionales = [
    {
      id: 'p1',
      nombre: 'Dra. Sofía Torres',
      especialidad: 'Psicóloga clínica',
      descripcion: 'Acompaño con TCC a personas que buscan herramientas prácticas para ansiedad, autoestima y manejo del estrés. Enfoque cercano y orientado a resultados.',
      imagen: 'https://images.unsplash.com/photo-1594824476967-d91b142bc5b9?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'p2',
      nombre: 'Dr. Mateo Ríos',
      especialidad: 'Psiquiatra',
      descripcion: 'Experiencia en trastornos del ánimo. Combino psicoterapia y, cuando es necesario, manejo farmacológico con un trato humano.',
      imagen: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'p3',
      nombre: 'Dra. Valentina Cruz',
      especialidad: 'Neuropsicóloga',
      descripcion: 'Evaluación cognitiva, memoria y funciones ejecutivas. Planes prácticos y explicaciones claras para cada paciente y su familia.',
      imagen: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60'
    }
  ];

  // por-profesional: horas ocupadas (ej. { p1: ['09:00'] })
  ocupadasMap: Record<string, string[]> = {};

  // por-profesional: hora seleccionada en la UI
  selectedHora: Record<string, string> = {};

  constructor(
    private auth: Auth,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // seguridad mínima
    if (!localStorage.getItem('userNombre')) {
      this.router.navigate(['/login']);
    }
  }

  // cuando cambia la fecha, reseteamos selecciones locales
  onFechaChange() {
    this.selectedHora = {};
    this.ocupadasMap = {};
    this.mostrarErrorFecha = false;
    this.mostrarErrorHora = false;
  }

  // seleccionar hora para un profesional (guardamos por id)
  selectHora(profId: string, hora: string) {
    this.selectedHora[profId] = hora;
    this.mostrarErrorHora = false;
  }

  // carga las horas ocupadas para un profesional y la fecha actual
  async cargarOcupadas(prof: any) {
    // limpiar selección para este profesional
    this.selectedHora[prof.id] = '';

    if (!this.fechaSeleccionada) {
      this.ocupadasMap[prof.id] = [];
      this.mostrarErrorFecha = true;
      return;
    }

    try {
      const lista = await this.authService.getTurnosProfesionalFecha(prof.id, this.fechaSeleccionada);
      this.ocupadasMap[prof.id] = lista.map(t => t.hora || t['hora']);
      this.mostrarErrorFecha = false;
    } catch (e) {
      console.error('Error cargando turnos ocupados', e);
      this.ocupadasMap[prof.id] = [];
    }
  }

  // agendar cita para un profesional (usa selectedHora[prof.id])
  async agendar(prof: any) {
    this.mostrarErrorFecha = false;
    this.mostrarErrorHora = false;

    if (!this.fechaSeleccionada) {
      this.mostrarErrorFecha = true;
      return;
    }

    const hora = this.selectedHora[prof.id];
    if (!hora) {
      this.mostrarErrorHora = true;
      // también mostramos alerta (suave)
      alert('Selecciona una hora antes de agendar.');
      return;
    }

    // comprobación extra
    if ((this.ocupadasMap[prof.id] || []).includes(hora)) {
      alert('Esa hora ya fue ocupada. Por favor elige otra.');
      return;
    }

    const turno = {
      profesionalId: prof.id,
      profesionalNombre: prof.nombre,
      profesionalEspecialidad: prof.especialidad,
      userUid: this.usuarioUid,
      userNombre: this.usuarioNombre,
      userEmail: this.userEmail || '',
      fecha: this.fechaSeleccionada,
      hora,
      estado: 'pendiente'
    };

    try {
      await this.authService.createTurno(turno);

      // feedback al usuario con backticks correctamente formateado
      alert(`Cita agendada con ${prof.nombre} el ${this.fechaSeleccionada} a las ${hora}.`);

      // reset UI local para ese prof
      this.selectedHora[prof.id] = '';
      // recargar ocupadas para bloquear la hora recién pedida
      await this.cargarOcupadas(prof);
    } catch (e) {
      console.error(e);
      alert('No se pudo crear la cita. Intenta de nuevo.');
    }
  }

  verTurnos() {
    this.router.navigate(['/turnos']);
  }

  logout() {
    signOut(this.auth).then(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
