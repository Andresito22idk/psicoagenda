// src/app/components/paginas/admin/admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  turnos: any[] = [];
  loading = true;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.load();
    // opcional: refrescar cada X segundos para "casi realtime"
    setInterval(() => this.load(), 8000);
  }

  async load() {
    this.loading = true;
    try {
      this.turnos = await this.authService.getAllTurnos();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  async aceptar(t: any) {
    await this.authService.updateTurno(t.id, { estado: 'confirmada' });
    alert('Cita aceptada.');
    await this.load();
    // aquí enviarás correo cuando implementes envíos
  }

  async cancelar(t: any) {
    await this.authService.updateTurno(t.id, { estado: 'cancelada' });
    alert('Cita cancelada.');
    await this.load();
  }

  async reagendar(t: any) {
    const nuevaFecha = prompt('Nueva fecha (YYYY-MM-DD):', t.fecha);
    const nuevaHora = prompt('Nueva hora (HH:MM):', t.hora);
    if (!nuevaFecha || !nuevaHora) return;
    await this.authService.updateTurno(t.id, { fecha: nuevaFecha, hora: nuevaHora, estado: 'reagendada' });
    alert('Cita reagendada.');
    await this.load();
    // enviar correo de notificación cuando habilites correo
  }
}
