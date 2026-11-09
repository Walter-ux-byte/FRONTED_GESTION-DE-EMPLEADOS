import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ProductoComponent } from './inventario/components/producto/producto.component';
import { CategoriaComponent } from './inventario/components/categoria/categoria.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ListaPedidoComponent } from './pedido/components/lista-pedido/lista-pedido.component';
import { NuevoPedidoComponent } from './pedido/components/nuevo-pedido/nuevo-pedido.component';
import { LayoutComponent } from './layout/layout.component';
import { AppLayoutModule } from './layout/app.layout.module';

@NgModule({
  declarations: [
    PerfilComponent,
    ProductoComponent,
    CategoriaComponent,
    ClienteComponent,
    ListaPedidoComponent,
    NuevoPedidoComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppLayoutModule
  ]
})
export class AdminModule { }