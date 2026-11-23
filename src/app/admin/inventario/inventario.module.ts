import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './components/producto/producto.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CategoriaService } from './services/categoria.service';
import { ProductoService } from './services/producto.service';
import { PersonaService } from './services/persona.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimengModule } from '../../primeng/primeng.module';

@NgModule({
  declarations: [
    ProductoComponent,
    CategoriaComponent
  ],
  exports: [
    ProductoComponent,
    CategoriaComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule
  ],
  providers: [
    CategoriaService,
    ProductoService,
    PersonaService
  ]
})
export class InventarioModule { }