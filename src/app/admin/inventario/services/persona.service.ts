import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Persona {
  id?: number;
  nombres: string;
  apellidos: string;
  mail?: string;
  email?: string;
  user?: {
    id?: number;
    name?: string;
    mail?: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private readonly baseUrl = environment.urlServidor;
  private readonly http = inject(HttpClient);

  // Listar todos los empleados / personas
  funListar(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/persona`);
  }

  // Buscar empleado por ID
  funBuscar(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/persona/${id}`);
  }

  // Guardar nuevo empleado
  funGuardar(registro: Partial<Persona>): Observable<Persona> {
    return this.http.post<Persona>(`${this.baseUrl}/persona`, registro);
  }

  // Modificar empleado existente
  funModificar(id: number, registro: Partial<Persona>): Observable<Persona> {
    return this.http.patch<Persona>(`${this.baseUrl}/persona/${id}`, registro);
  }

  // Eliminar empleado por ID
  funEliminar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/persona/${id}`);
  }

  // Métodos alias en español estándar
  listar() { return this.funListar(); }
  buscar(id: number) { return this.funBuscar(id); }
  guardar(registro: Partial<Persona>) { return this.funGuardar(registro); }
  modificar(id: number, registro: Partial<Persona>) { return this.funModificar(id, registro); }
  eliminar(id: number) { return this.funEliminar(id); }
}
