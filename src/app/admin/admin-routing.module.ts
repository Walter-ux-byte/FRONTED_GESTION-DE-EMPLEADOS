import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { CategoriaComponent } from './inventario/components/categoria/categoria.component';
import { ProductoComponent } from './inventario/components/producto/producto.component';

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "perfil",
        component: PerfilComponent
      },
      {
        path: "categoria",
        component: CategoriaComponent
      },
      {
        path: "departamento",
        component: DepartamentoComponent
      },
      {
        path: "empleado",
        component: ProductoComponent
      },
      {
        path: "producto",
        redirectTo: "empleado",
        pathMatch: "full"
      },
      {
        path: "persona",
        redirectTo: "empleado",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
