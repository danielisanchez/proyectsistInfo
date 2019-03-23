import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { wishlistService } from 'src/app/servicios/wishlist.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {
  
  carrito: any;
  wishlist: any;
  constructor(public auth: AuthService, public carritoService: CarritoService, public wishlistService: wishlistService) { }

  ngOnInit() {
    this.auth.User.subscribe(Usuario => {
      if(Usuario){
      if(Usuario.role == 'customer') {
        const cartRef = this.carritoService.RefMiCarrito(Usuario.uid).get();
        const wishRef = this.wishlistService.RefMiWish(Usuario.uid).get();
        //carrito
        cartRef.then((cart) => {
          if(cart.exists) {
            this.carritoService.MiCarrito(Usuario.uid).subscribe(myCart => {
              this.carrito = myCart.payload.data();
            })
          } else {
            this.carritoService.CrearCarrito(Usuario.uid);
            this.carritoService.MiCarrito(Usuario.uid).subscribe(myCart => {
              this.carrito = myCart.payload.data();
            })
          }
        })
        //wishlist
        wishRef.then((wish) => {
          if(wish.exists) {
            this.wishlistService.MiWishList(Usuario.uid).subscribe(myWishList => {
              this.wishlist = myWishList.payload.data();
            })
          } else {
            this.wishlistService.CrearWishList(Usuario.uid);
            this.wishlistService.MiWishList(Usuario.uid).subscribe(myCart => {
              this.wishlist = myCart.payload.data();
            })
          }
        })
      }
    }
    })
  }

}
