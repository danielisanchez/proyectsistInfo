import { Component, OnInit } from '@angular/core';
import { PilotoService } from 'src/app/servicios/piloto.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  piloto:boolean;
  //invocar servicio de piloto y llenar la variable
  constructor(public pilotoService: PilotoService) { }
  
  ngOnInit() {
    this.pilotoService.getPiloto().subscribe(element => this.piloto = element.value)
  }

}
