import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpModule } from '@angular/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { NavbarAdminComponent } from './component/navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from './component/navbar-user/navbar-user.component';
import { FormComponent } from './component/form/form.component';
import { FormRegistroComponent } from './component/form-registro/form-registro.component';
import { InicioComponent } from './view/inicio/inicio.component';
import { FooterComponent } from './component/footer/footer.component';
import { CarritoComponent } from './view/carrito/carrito.component';

//Módulo de autenticacion
import { AuthModule } from './auth/auth.module';

// Modulos de angular
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

// Firestore
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';

// Componentes
import { OlvidoPassComponent } from './component/olvido-pass/olvido-pass.component';
import { NosotrosComponent } from './view/nosotros/nosotros.component';
import { ArteComponent } from './view/arte/arte.component';
import { ElectrodomesticoComponent } from './view/electrodomestico/electrodomestico.component';
import { HogarComponent } from './view/hogar/hogar.component';
import { AdminComponent } from './view/admin/admin.component';
import { PerfilComponent } from './view/perfil/perfil.component'

// Modulos Ngx-Boostrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { UsuariosComponent } from './view/usuarios/usuarios.component';
import { PagoComponent } from './view/pago/pago.component';
import { WishlistComponent } from './view/wishlist/wishlist.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavbarAdminComponent,
    NavbarUserComponent,
    FormComponent,
    FormRegistroComponent,
    InicioComponent,
    FooterComponent,
    CarritoComponent,
    OlvidoPassComponent,
    NosotrosComponent,
    ArteComponent,
    ElectrodomesticoComponent,
    HogarComponent,
    AdminComponent,
    PerfilComponent,
    UsuariosComponent,
    PagoComponent,
    WishlistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule,
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }