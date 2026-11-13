import { Component, OnInit, inject } from '@angular/core';
import { Departamento, DepartamentoService } from './departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.scss'
})
export class DepartamentoComponent implements OnInit {
  private readonly departamentoService = inject(DepartamentoService);

  departamentos: Departamento[] = [];
  error: string | null = null;

  ngOnInit(): void {
    this.departamentoService.listar().subscribe({
      next: (departamentos) => {
        if (!Array.isArray(departamentos)) {
          console.error('La API de departamentos devolvió una respuesta inválida:', departamentos);
          this.error = 'El servidor devolvió datos de departamentos con un formato inválido.';
          return;
        }

        this.departamentos = departamentos;
      },
      error: (error: unknown) => {
        console.error('Error al cargar los departamentos:', error);
        this.error = 'No se pudieron cargar los departamentos.';
      }
    });
  }
}
