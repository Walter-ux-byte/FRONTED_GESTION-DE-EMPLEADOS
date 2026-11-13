import { Component, OnInit, inject } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface Categoria {
  id?: number;
  nombre: string;
  detalle?: string;
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaComponent implements OnInit {

  private categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  dialog_visible: boolean = false;

  categoriaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    detalle: new FormControl('')
  });

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.funListar().subscribe({
      next: (data: any) => {
        this.categorias = data;
      },
      error: (error: any) => {
        console.error('Error al listar categorías:', error);
      }
    });
  }

  mostrarDialog(): void {
    this.categoriaForm.reset();
    this.dialog_visible = true;
  }

  hideDialog(): void {
    this.dialog_visible = false;
  }

  saveCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const nuevaCategoria = this.categoriaForm.value;

    this.categoriaService.funGuardar(nuevaCategoria).subscribe({
      next: () => {
        this.dialog_visible = false;
        this.categoriaForm.reset();
        this.cargarCategorias();
      },
      error: (error: any) => {
        console.error('Error al guardar categoría:', error);
      }
    });
  }
}
