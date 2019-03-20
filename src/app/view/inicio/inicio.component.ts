import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(public auth: AuthService) { }
  piloto: boolean = true;
  
  //Se llama al servicio de piloto y se verifica el valor de la variable
  ngOnInit() {
  }

}
