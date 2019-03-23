import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { RecomendadoService } from 'src/app/servicios/recomendado.service';
import { PromocionService } from 'src/app/servicios/promocion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(public auth: AuthService, public recomendadoService: RecomendadoService, public promocionService: PromocionService) { }
  productosRecomendados;
  productosPromocionales;
  
  ngOnInit() {
    this.getProducts();
  }
  getProducts(){
    this.recomendadoService.Productos().subscribe(productos => this.productosRecomendados = productos);
    this.promocionService.Productos().subscribe(productos => this.productosPromocionales = productos);
  }
}
