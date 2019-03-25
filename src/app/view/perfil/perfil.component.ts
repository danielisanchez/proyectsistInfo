import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  
  usuario: Usuario
  constructor(public auth: AuthService,public afAuth: AngularFireAuth) { }


  ngOnInit() {
    this.ObtenerUsuario();
  }

  ObtenerUsuario() {
    this.auth.User.subscribe(usuario => { this.usuario = usuario });
  }

  actualizarPerfil(form: NgForm)
  {
    const nombre = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirm;
    if(password !=""){
      this.reautenticate(password).then(() => {
        var user = this.afAuth.auth.currentUser;
        if(confirmPassword != ""){
          user.updatePassword(confirmPassword).then(()=> {
            alert("Se cambio su contraseña");
            form.setValue({
              name: "",
              email: "",
              password: "",
              confirm: ""
            })
          }).catch((error => {
            alert(error.message);
          }));
        }
        if(nombre != ""){
          var Profile ={
            displayName: name
          }
          user.updateProfile(Profile).then(() => {
            alert("Se actualizo el nombre");
            this.usuario.name = nombre
            this.auth.updateUserData(this.usuario);
            form.setValue({
              name: "",
              email: "",
              password: "",
              confirm: ""
            })
          }).catch((error) => {
            alert(error.message);
          });
        }
        if(email != ""){
          user.updateEmail(email).then(()=>{
            alert("Se actualizo el email");
            this.usuario.email = email;
            this.auth.updateUserData(this.usuario);
            form.setValue({
              name: "",
              email: "",
              password: "",
              confirm: ""
            })
          }).catch((error) => {
            alert(error.message);
          })
        }
      }).catch((error) => {
        alert(error.message);
      });
    }else{
      alert("Para realizar cualquier cambio necesita poner su contraseña actual")
      return; 
    }
  }
  reautenticate(pass){
    var user = this.afAuth.auth.currentUser;
    var credential = auth.EmailAuthProvider.credential(user.email, pass);
    return user.reauthenticateWithCredential(credential);
  }
}
