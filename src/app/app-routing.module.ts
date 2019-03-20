import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './component/form/form.component';
import { InicioComponent } from './view/inicio/inicio.component';
import { FormRegistroComponent } from './component/form-registro/form-registro.component';
import {CarritoComponent} from './view/carrito/carrito.component';
import {OlvidoPassComponent} from './component/olvido-pass/olvido-pass.component'
import{NosotrosComponent} from './view/nosotros/nosotros.component';
import { PerfilComponent } from './view/perfil/perfil.component';
import { AdminComponent } from './view/admin/admin.component';

const routes: Routes = [
{
path:'',
component: NosotrosComponent,

},
{
  path:'inicio',
  component: InicioComponent,
  
  },
  {
    path:'admin',
    component: AdminComponent,
    
    },
  {
    path:'perfil',
    component: PerfilComponent,
    
    },
{
  path: 'carrito',
  component: CarritoComponent,
},

{
  path: 'iniciosesion',
  component: FormComponent,
},
{
  path: 'registro',
  component: FormRegistroComponent,
},
{
  path: 'olvido',
  component: OlvidoPassComponent,
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
