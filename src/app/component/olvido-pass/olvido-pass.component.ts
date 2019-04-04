import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router} from "@angular/router";

@Component({
  selector: 'app-olvido-pass',
  templateUrl: './olvido-pass.component.html',
  styleUrls: ['./olvido-pass.component.css']
})
export class OlvidoPassComponent implements OnInit {

  constructor(public auth: AuthService,  public router: Router) { }

  ngOnInit() {
  }
  forgot(form: NgForm) {
    const email = form.value.email;
    alert("se envio un correo de verificacion a " + email)
    this.auth.ForgotPassword(email);
  }
}
