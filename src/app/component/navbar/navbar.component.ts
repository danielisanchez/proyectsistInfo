import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  piloto:boolean = true;
  //invocar servicio de piloto y llenar la variable
  constructor() { }
  
  ngOnInit() {
  }

}
