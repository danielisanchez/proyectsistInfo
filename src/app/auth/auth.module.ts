import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Router:

//Servicios:
import { AuthService } from './auth.service';

//Firebase:
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';

//Componentes:

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    FormsModule
  ],
  declarations: [],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }
