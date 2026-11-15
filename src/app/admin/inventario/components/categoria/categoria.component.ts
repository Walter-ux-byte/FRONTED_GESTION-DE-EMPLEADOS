import { Component, OnInit, inject } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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

  // Función reutilizable para alertas con SweetAlert2
  alerta(title: string, text: string, icon: SweetAlertIcon = 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#3085d6'
    });
  }

  // Listado de categorías (ordenado por ID)
  getCategorias(): void {
    this.categoriaService.funListar().subscribe({
      next: (data: any) => {
        this.categorias = Array.isArray(data) ? data : [];
      },
      error: (error: any) => {
        console.error('Error al listar categorías:', error);
        this.alerta('Error', 'No se pudieron cargar las categorías del servidor.', 'error');
      }
    });
  }

  // Abrir diálogo para nueva categoría
  mostrarDialog(): void {
    this.categoria_id = -1;
    this.categoriaForm.reset({
      nombre: '',
      detalle: ''
    });
    this.dialog_visible = true;
  }

  // Cerrar diálogo y limpiar
  hideDialog(): void {
    this.dialog_visible = false;
    this.categoria_id = -1;
    this.categoriaForm.reset();
  }

  // Cargar datos en el formulario para editar
  editCategoria(cat: Categoria): void {
    this.categoria_id = cat.id ?? -1;
    this.categoriaForm.setValue({
      nombre: cat.nombre,
      detalle: cat.detalle ?? ''
    });
    this.dialog_visible = true;
  }

  // Eliminar categoría con confirmación SweetAlert2
  deleteCategoria(cat: Categoria): void {
    if (!cat.id) return;

    Swal.fire({
      title: '¿Está seguro de eliminar la categoría?',
      text: `Se eliminará permanentemente "${cat.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.funEliminar(cat.id!).subscribe({
          next: () => {
            this.alerta('¡Eliminado!', 'Categoría eliminada con éxito.', 'success');
            this.getCategorias();
            this.categoria_id = -1;
            this.dialog_visible = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar categoría:', error);
            this.alerta('Error', 'No se pudo eliminar la categoría.', 'error');
          }
        });
      }
    });
  }

  // Guardar (crear o modificar) categoría
  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      this.alerta('Formulario incompleto', 'El campo nombre es obligatorio.', 'warning');
      return;
    }

    const formValue = this.categoriaForm.value;
    const categoria = {
      nombre: formValue.nombre?.trim() ?? '',
      detalle: formValue.detalle?.trim() ?? ''
    };

    if (this.categoria_id > 0) {
      // Modificar categoría existente
      this.categoriaService.funModificar(this.categoria_id, categoria).subscribe({
        next: () => {
          this.dialog_visible = false;
          this.categoriaForm.reset();
          this.categoria_id = -1;
          this.getCategorias();
          this.alerta('¡Actualizado!', 'Categoría modificada exitosamente.', 'success');
        },
        error: (error: any) => {
          console.error('Error al modificar categoría:', error);
          this.alerta('Error', 'No se pudo modificar la categoría.', 'error');
        }
      });
    } else {
      // Registrar nueva categoría
      this.categoriaService.funGuardar(categoria).subscribe({
        next: () => {
          this.dialog_visible = false;
          this.categoriaForm.reset();
          this.categoria_id = -1;
          this.getCategorias();
          this.alerta('¡Registrado!', 'Categoría registrada exitosamente.', 'success');
        },
        error: (error: any) => {
          console.error('Error al guardar categoría:', error);
          this.alerta('Error', 'No se pudo registrar la categoría.', 'error');
        }
      });
    }
  }
}
