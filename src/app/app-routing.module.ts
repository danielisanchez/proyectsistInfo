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
import { HogarComponent } from './view/hogar/hogar.component';
import { ArteComponent } from './view/arte/arte.component';
import { ElectrodomesticoComponent } from './view/electrodomestico/electrodomestico.component';
import { WishlistComponent } from './view/wishlist/wishlist.component';
import { PagoComponent } from './view/pago/pago.component';
import { PespecialComponent } from './view/pespecial/pespecial.component';
import { UsuariosComponent } from './view/usuarios/usuarios.component';
import { ComprasComponent } from './view/compras/compras.component';
import { EstadisticasComponent } from './view/estadisticas/estadisticas.component';

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
  path:'hogar',
  component: HogarComponent,
    
},
{
  path:'arte',
  component: ArteComponent,
      
},
{
  path:'electrodomesticos',
  component: ElectrodomesticoComponent,
        
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
  path: 'wish',
  component: WishlistComponent,
},
{
  path: 'pago',
  component: PagoComponent,
},
{
  path: 'iniciosesion',
  component: FormComponent,
},
{
  path: 'especial',
  component: PespecialComponent,
},
{
  path: 'registro',
  component: FormRegistroComponent,
},
{
  path: 'olvido',
  component: OlvidoPassComponent,
},
{
  path: 'usuarios',
  component: UsuariosComponent,
},
{
  path: 'estadisticas',
  component: EstadisticasComponent,
},
{
  path: 'compras',
  component: ComprasComponent,
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
