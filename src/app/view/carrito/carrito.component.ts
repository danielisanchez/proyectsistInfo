import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  constructor(public auth: AuthService, public carritoService: CarritoService, public afs: AngularFirestore, public router: Router) { }
  carrito;
  ngOnInit() {
    this.getCarrito()
  }
  getCarrito(){
    this.auth.User.subscribe(user => {
      if(user){
          this.carritoService.MiCarrito(user.uid).subscribe(Cart => {
            this.carrito = Cart.payload.data();
          })
      }
    })
  }
  LimpiarCarrito(uid){
    this.carritoService.resetCart(uid);
  }
  incrementar(producto, uid ){
    this.carritoService.incrementar(producto,uid, producto.variacion);
  }
  decrementar(producto, uid){
    if(producto.qty == 1){
      alert("Por favor elimine el producto")
    }else{
    this.carritoService.disminuir(producto,uid, producto.variacion );
    }
  }
  Comprar(){
    this.router.navigate(['pago'])
  }
  eliminarProducto(producto,uid,index){
    this.carritoService.removeProduct(producto, uid, index);
  }
}
