import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Departamento {
  id: number;
  nombreDepartamento: string;
  ubicacion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private readonly baseUrl = environment.urlServidor;
  private readonly http = inject(HttpClient);

  listar(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.baseUrl}/departamento`);
  }
}
