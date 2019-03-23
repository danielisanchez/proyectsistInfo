import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router} from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { auth } from 'firebase';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  admin: Usuario
  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
  }


  login(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.auth.emailAndPassword(email, password).then(credentials => {
      this.auth.isAdmin(credentials.user.uid).subscribe(usuario => {
        if(usuario.isActive == false){
          alert("El usuario no se encuentra activo");
          return 
        }else{
          if(usuario.role == 'admin'){
            this.router.navigate(['admin'])
          }
          if(usuario.role == 'customer'){
            this.router.navigate(['inicio'])
          }
        }
      })
    }).catch(err => {
      alert(err.message);
    })
  }
}
