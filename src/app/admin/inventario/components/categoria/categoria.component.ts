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
  categoria_id: number = -1;

  categoriaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    detalle: new FormControl('')
  });

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.categoriaService.funListar().subscribe({
      next: (data: any) => {
        this.categorias = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  mostrarDialog(): void {
    this.categoria_id = -1;
    this.categoriaForm.reset();
    this.dialog_visible = true;
  }

  hideDialog(): void {
    this.dialog_visible = false;
    this.categoria_id = -1;
  }

  editCategoria(cat: Categoria): void {
    this.categoria_id = cat.id ?? -1;
    this.categoriaForm.setValue({
      nombre: cat.nombre,
      detalle: cat.detalle ?? ''
    });
    this.dialog_visible = true;
  }

  deleteCategoria(cat: Categoria): void {
    if (!cat.id) return;

    this.categoriaService.funEliminar(cat.id).subscribe({
      next: () => {
        this.getCategorias();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    if (this.categoria_id > 0) {
      this.categoriaService.funModificar(this.categoria_id, this.categoriaForm.value).subscribe(
        (res: any) => {
          this.dialog_visible = false;
          this.getCategorias();
          this.categoria_id = -1;
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.categoriaService.funGuardar(this.categoriaForm.value).subscribe(
        (res: any) => {
          this.dialog_visible = false;
          this.getCategorias();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    this.categoriaForm.reset();
  }
}