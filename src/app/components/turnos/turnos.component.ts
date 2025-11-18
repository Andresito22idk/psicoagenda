import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {

  turnos: any[] = [];
  loading = true;

  constructor(
    private turnosService: TurnosService,
    private router: Router
  ) {}

  async ngOnInit() {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      this.router.navigate(['/login']);
      return;
    }

    this.turnos = await this.turnosService.getTurnosUsuario(uid);
    this.loading = false;
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
