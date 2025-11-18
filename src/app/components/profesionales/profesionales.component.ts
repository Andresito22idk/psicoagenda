// src/app/components/paginas/profesionales/profesionales.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profesionales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesionales.component.html',
  styleUrls: ['./profesionales.component.css']
})
export class ProfesionalesComponent {

  profesionales: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadProfesionales();
  }

  async loadProfesionales() {
    this.loading = true;
    try {
      this.profesionales = await this.authService.getProfesionales(); 
      // Usa el mismo servicio que ya usas en Home, no afecta nada.
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  volverHome() {
    this.router.navigate(['/home']);
  }
}
