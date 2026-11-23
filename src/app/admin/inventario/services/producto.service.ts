import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  nombre: string;
  precio: number | string;
  stock: number;
  image?: string;
  descripcion?: string;
  estado?: boolean;
  categoriaId?: number;
  categoria?: {
    id?: number;
    nombre?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = environment.urlServidor;
  private http = inject(HttpClient);

  funListar2() {
    return this.http.get(`${this.baseUrl}/producto/back`);
  }

  // Listar todos los productos
  funListar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/producto`);
  }

  // Listar paginado y con búsqueda (/producto/back)
  funListarPaginado(page = 1, q = '', sort = ''): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/producto/back?page=${page}&q=${q}&sort=${sort}`);
  }

  // Buscar producto por ID
  funBuscar(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/producto/${id}`);
  }

  // Guardar nuevo producto
  funGuardar(registro: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/producto`, registro);
  }

  // Modificar producto existente
  funModificar(id: number, registro: Partial<Producto>): Observable<Producto> {
    return this.http.patch<Producto>(`${this.baseUrl}/producto/${id}`, registro);
  }

  // Eliminar producto por ID
  funEliminar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/producto/${id}`);
  }

  // Alias estándar
  listar() { return this.funListar(); }
  buscar(id: number) { return this.funBuscar(id); }
  guardar(registro: Partial<Producto>) { return this.funGuardar(registro); }
  modificar(id: number, registro: Partial<Producto>) { return this.funModificar(id, registro); }
  eliminar(id: number) { return this.funEliminar(id); }
}