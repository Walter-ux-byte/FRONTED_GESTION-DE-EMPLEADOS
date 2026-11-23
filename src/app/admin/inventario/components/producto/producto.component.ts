import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Producto, ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  categorias: any[] = [
    { id: 1, name: 'Equipos de Cómputo', code: 'EC' },
    { id: 2, name: 'Mobiliario de Oficina', code: 'MO' },
    { id: 3, name: 'Uniformes y Dotación', code: 'UD' },
    { id: 4, name: 'Periféricos y Accesorios', code: 'PA' },
    { id: 5, name: 'Suministros de Oficina', code: 'SO' }
  ];

  categoriaSeleccionada: any = null;

  productos: Producto[] = [];
  productoDialog: boolean = false;
  producto_id: number = -1;

  private readonly imagenesDefault = [
    'assets/layout/images/product-placeholder-1.svg',
    'assets/layout/images/product-placeholder-2.svg'
  ];

  productoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    categoriaId: new FormControl<number | null>(null, [Validators.required]),
    descripcion: new FormControl(''),
    image: new FormControl(''),
    estado: new FormControl(true)
  });

  constructor(private productoService: ProductoService) {
    this.productoService.funListar2().subscribe(
      (res: any) => {
        this.productos = Array.isArray(res) ? res : (res?.data ?? []);
      }
    );
  }

  ngOnInit(): void {
    this.getProductos();
  }

  getImagenUrl(producto: Producto): string {
    if (producto.image && producto.image.trim() !== '') {
      return producto.image;
    }
    const index = Math.abs(producto.id ?? 0) % this.imagenesDefault.length;
    return this.imagenesDefault[index];
  }

  getNombreCategoria(producto: Producto): string {
    if (producto.categoria?.nombre) {
      return producto.categoria.nombre;
    }
    const cat = this.categorias.find(c => c.id === producto.categoriaId);
    return cat ? cat.name : 'Sin categoría';
  }

  alerta(title: string, text: string, icon: SweetAlertIcon = 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#3085d6'
    });
  }

  // Consultar lista de productos desde el backend (/producto/back o /producto)
  getProductos(): void {
    this.productoService.funListarPaginado(1, '', '').subscribe({
      next: (resp: any) => {
        const lista = Array.isArray(resp) ? resp : (resp?.data ?? []);
        this.productos = lista;
      },
      error: (error: unknown) => {
        console.error('Error al cargar productos:', error);
        this.alerta('Error', 'No se pudieron cargar los productos desde el servidor.', 'error');
      }
    });
  }

  // Filtrar productos por categoría desde el dropdown
  filtrarPorCategoria(): void {
    if (!this.categoriaSeleccionada) {
      this.getProductos();
      return;
    }
    this.productoService.funListar().subscribe({
      next: (data: Producto[]) => {
        this.productos = data.filter(p => p.categoriaId === this.categoriaSeleccionada.id);
      }
    });
  }

  // Abrir modal para nuevo producto / equipo
  openNew(): void {
    this.producto_id = -1;
    this.productoForm.reset({
      nombre: '',
      precio: null,
      stock: 0,
      categoriaId: null,
      descripcion: '',
      image: '',
      estado: true
    });
    this.productoDialog = true;
  }

  // Cerrar modal
  hideDialog(): void {
    this.productoDialog = false;
    this.producto_id = -1;
    this.productoForm.reset();
  }

  // Cargar datos del producto para editar
  editProducto(producto: Producto): void {
    this.producto_id = producto.id ?? -1;
    this.productoForm.patchValue({
      nombre: producto.nombre ?? '',
      precio: Number(producto.precio ?? 0),
      stock: producto.stock ?? 0,
      categoriaId: producto.categoriaId ?? producto.categoria?.id ?? null,
      descripcion: producto.descripcion ?? '',
      image: producto.image ?? '',
      estado: producto.estado ?? true
    });
    this.productoDialog = true;
  }

  // Eliminar producto con confirmación
  deleteProducto(producto: Producto): void {
    if (!producto.id) return;

    Swal.fire({
      title: '¿Está seguro de eliminar este producto?',
      text: `Se eliminará "${producto.nombre}" del inventario. ¡Esta acción no se puede deshacer!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.funEliminar(producto.id!).subscribe({
          next: () => {
            this.alerta('¡Eliminado!', 'Producto eliminado del inventario.', 'success');
            this.getProductos();
            this.producto_id = -1;
          },
          error: (error: unknown) => {
            console.error('Error al eliminar producto:', error);
            this.alerta('Error', 'No se pudo eliminar el producto.', 'error');
          }
        });
      }
    });
  }

  // Guardar o actualizar producto
  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.alerta('Formulario incompleto', 'Por favor complete los campos obligatorios del producto.', 'warning');
      return;
    }

    const formValues = this.productoForm.value;
    const datosProducto: Partial<Producto> = {
      nombre: formValues.nombre?.trim() ?? '',
      precio: Number(formValues.precio ?? 0),
      stock: Number(formValues.stock ?? 0),
      categoriaId: Number(formValues.categoriaId),
      descripcion: formValues.descripcion?.trim() ?? '',
      image: formValues.image?.trim() ?? '',
      estado: formValues.estado ?? true
    };

    if (this.producto_id > 0) {
      this.productoService.funModificar(this.producto_id, datosProducto).subscribe({
        next: () => {
          this.productoDialog = false;
          this.productoForm.reset();
          this.producto_id = -1;
          this.getProductos();
          this.alerta('¡Actualizado!', 'Producto modificado con éxito.', 'success');
        },
        error: (error: unknown) => {
          console.error('Error al modificar producto:', error);
          this.alerta('Error', 'No se pudieron actualizar los datos del producto.', 'error');
        }
      });
    } else {
      this.productoService.funGuardar(datosProducto).subscribe({
        next: () => {
          this.productoDialog = false;
          this.productoForm.reset();
          this.producto_id = -1;
          this.getProductos();
          this.alerta('¡Registrado!', 'Producto agregado al inventario exitosamente.', 'success');
        },
        error: (error: unknown) => {
          console.error('Error al registrar producto:', error);
          this.alerta('Error', 'No se pudo registrar el producto.', 'error');
        }
      });
    }
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}