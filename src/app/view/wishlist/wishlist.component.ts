import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { wishlistService } from 'src/app/servicios/wishlist.service';
import { CarritoService } from 'src/app/servicios/carrito.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  constructor(public auth: AuthService, public wishlist: wishlistService , public afs: AngularFirestore, public carritoService: CarritoService) { }
  ListaDeseo;
  ngOnInit() {
    this.getWishList()
  }
  getWishList(){
    this.auth.User.subscribe(user => {
      if(user){
          this.wishlist.MiWishList(user.uid).subscribe(wishList => {
            this.ListaDeseo = wishList.payload.data();
          })
      }
    })
  }

  eliminarProducto(producto, uid, index){
    this.wishlist.removeProduct(producto,uid,index);
  }

  LimpiarWishList(uid){
    this.wishlist.resetWishList(uid)
  }

  AnadirCarrito(producto,uid,index){
    this.carritoService.agregarProducto(producto, producto.variacion);
    this.eliminarProducto(producto,uid,index)
    alert("Producto añadido al carrito");
  }
}
