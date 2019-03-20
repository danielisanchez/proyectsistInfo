import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { Router} from "@angular/router";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form-registro',
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.css']
})
export class FormRegistroComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public title: Title,
    public router: Router,
  ) { }

  ngOnInit() {
  }
  public onSignup(form: NgForm) {
    const usuario = form.value.username;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.ConfirmPassword;
    // Se validan que los passwords coincidan

    if(password != confirmPassword){
      alert("los passwords no coinciden");
    }
    else{

    this.auth.signUp(email, password).then((userCredentials) => {
      const FireUser = userCredentials.user;
      alert("Registro Exitoso");

      const data = {
        uid: FireUser.uid,
        isActive: true,
        email: email,
        name: usuario,
        role: 'customer'
      };
    
      this.afs.collection('users').doc(FireUser.uid).set(data)
      .then(()=> {
        this.auth.emailAndPassword(email, password).then(() => {
          this.router.navigate(['/iniciosesion']);
        }).catch(err => {
          alert(err.message);
        })
      }).catch(err => {
        alert(err.message);
      })
    }).catch(err => {
      alert(err.message);
    })
  } 
}
}
