import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { RecomendadoService } from 'src/app/servicios/recomendado.service';
import { PromocionService } from 'src/app/servicios/promocion.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CarritoService } from 'src/app/servicios/carrito.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    public auth: AuthService, 
    public recomendadoService: RecomendadoService, 
    public promocionService: PromocionService,
    public afs: AngularFirestore, 
    public productoService: ProductoService, 
    public carritoService: CarritoService
    ) { }
  productosRecomendados;
  productosPromocionales;
  productosMasVendidos;
  variacion;
  ngOnInit() {
    this.getProducts();
  }
  getProducts(){
    this.productoService.ProductosMasVendidos().subscribe(productos => this.productosMasVendidos = productos);
    this.recomendadoService.Productos().subscribe(productos => this.productosRecomendados = productos);
    this.promocionService.Productos().subscribe(productos => this.productosPromocionales = productos);
  }

  agregarCarrito(producto){
    this.carritoService.agregarProducto(producto, producto.variacion)
    alert("Producto añadido al carrito")   
    this.variacion = undefined
  }
}
 