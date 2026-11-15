import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Persona, PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  private readonly personaService = inject(PersonaService);

  empleados: Persona[] = [];
  empleadoDialog: boolean = false;
  empleado_id: number = -1;

  private readonly fotosEmpleados = [
    'assets/layout/images/employee-portrait-1.svg',
    'assets/layout/images/employee-portrait-2.svg',
    'assets/layout/images/employee-portrait-3.svg',
    'assets/layout/images/employee-portrait-4.svg'
  ];

  empleadoForm = new FormGroup({
    nombres: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellidos: new FormControl('', [Validators.required, Validators.minLength(2)]),
    mail: new FormControl('', [Validators.required, Validators.email])
  });

  ngOnInit(): void {
    this.getEmpleados();
  }

  getImagenUrl(empleado: Persona): string {
    const index = Math.abs(empleado.id ?? 0) % this.fotosEmpleados.length;
    return this.fotosEmpleados[index];
  }

  getCorreo(empleado: Persona): string {
    return empleado.mail ?? empleado.email ?? empleado.user?.mail ?? empleado.user?.email ?? 'Sin correo';
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

  // Consultar lista de empleados desde el backend
  getEmpleados(): void {
    this.personaService.funListar().subscribe({
      next: (data: Persona[]) => {
        this.empleados = Array.isArray(data) ? data : [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar empleados:', error);
        this.alerta('Error', 'No se pudieron cargar los empleados desde el servidor.', 'error');
      }
    });
  }

  // Abrir formulario modal para registrar un nuevo empleado
  openNew(): void {
    this.empleado_id = -1;
    this.empleadoForm.reset({
      nombres: '',
      apellidos: '',
      mail: ''
    });
    this.empleadoDialog = true;
  }

  // Cerrar diálogo modal
  hideDialog(): void {
    this.empleadoDialog = false;
    this.empleado_id = -1;
    this.empleadoForm.reset();
  }

  // Cargar datos del empleado seleccionado en el formulario para editar
  editEmpleado(empleado: Persona): void {
    this.empleado_id = empleado.id ?? -1;
    this.empleadoForm.setValue({
      nombres: empleado.nombres ?? '',
      apellidos: empleado.apellidos ?? '',
      mail: empleado.mail ?? empleado.email ?? empleado.user?.mail ?? empleado.user?.email ?? ''
    });
    this.empleadoDialog = true;
  }

  // Eliminar empleado con confirmación SweetAlert2
  deleteEmpleado(empleado: Persona): void {
    if (!empleado.id) return;

    Swal.fire({
      title: '¿Está seguro de eliminar el empleado?',
      text: `Se eliminará a ${empleado.nombres} ${empleado.apellidos}. ¡Esta acción no se puede deshacer!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.funEliminar(empleado.id!).subscribe({
          next: () => {
            this.alerta('¡Eliminado!', 'Empleado eliminado correctamente.', 'success');
            this.getEmpleados();
            this.empleado_id = -1;
          },
          error: (error: unknown) => {
            console.error('Error al eliminar empleado:', error);
            this.alerta('Error', 'No se pudo eliminar el empleado.', 'error');
          }
        });
      }
    });
  }

  // Registrar o actualizar empleado
  guardarEmpleado(): void {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      this.alerta('Formulario incompleto', 'Por favor complete todos los campos requeridos.', 'warning');
      return;
    }

    const formValues = this.empleadoForm.value;
    const mail = formValues.mail?.trim() ?? '';
    const datosEmpleado: Partial<Persona> = {
      nombres: formValues.nombres?.trim() ?? '',
      apellidos: formValues.apellidos?.trim() ?? '',
      mail
    };

    if (this.empleado_id > 0) {
      // Modificar empleado existente
      this.personaService.funModificar(this.empleado_id, datosEmpleado).subscribe({
        next: () => {
          this.empleadoDialog = false;
          this.empleadoForm.reset();
          this.empleado_id = -1;
          this.getEmpleados();
          this.alerta('¡Actualizado!', 'Datos del empleado modificados con éxito.', 'success');
        },
        error: (error: unknown) => {
          console.error('Error al modificar empleado:', error);
          this.alerta('Error', 'No se pudieron actualizar los datos del empleado.', 'error');
        }
      });
    } else {
      // Registrar nuevo empleado
      this.personaService.funGuardar(datosEmpleado).subscribe({
        next: () => {
          this.empleadoDialog = false;
          this.empleadoForm.reset();
          this.empleado_id = -1;
          this.getEmpleados();
          this.alerta('¡Registrado!', 'Empleado registrado exitosamente.', 'success');
        },
        error: (error: unknown) => {
          console.error('Error al registrar empleado:', error);
          this.alerta('Error', 'No se pudo registrar el nuevo empleado.', 'error');
        }
      });
    }
  }

  // Filtro global para la tabla
  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
