import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Carrito } from '../models/carrito';
import { Product } from '../models/product';
import { isUndefined, isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class wishlistService {

  
  constructor(
    public auth: AuthService,
    private afs: AngularFirestore
  ) { }

  CrearWishList(id){
    this.afs.collection('wishlist').doc(id).set(
      {id: id, products: [], totalProducts: 0}
    )
  }

  MiWishList(uid){
    return this.afs.doc<Carrito>(`wishlist/${uid}`).snapshotChanges();
  }

  RefMiWish(uid){
    return this.afs.collection<Carrito>('wishlist').doc(uid).ref;
  }

  agregarProducto(producto, variacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.User.subscribe(data => {
        if(data){
          const cartRef = this.RefMiWish(data.uid);
          cartRef.get().then(doc => {
            let cartData = doc.data();
            let productosEnCarrito = cartData.products;
              if(!isUndefined(variacion)){
                const productoAlCarrito = {
                  id: producto.id,
                  name: producto.name,
                  price: producto.price,
                  photoUrl: producto.photoUrl,
                  description: producto.description,
                  variacion: variacion,
                  qty: 1
                }

                const exist = wishlistService.ProductosIguales(productosEnCarrito,producto,variacion);
                if(!exist){
                  productosEnCarrito.push(productoAlCarrito);
                  cartData.totalProducts += 1;
                }else {
                  exist.qty +=1;
                  cartData.totalProducts +=1;
                }

                }else{
                  const productToCart = {
                    id: producto.id,
                    name: producto.name,
                    price: producto.price,
                    photoUrl: producto.photoUrl,
                    description: producto.description,
                    qty: 1
                  }
                  const exist = wishlistService.ProductosIguales(productosEnCarrito,producto, variacion);
                  if(!exist){
                    productosEnCarrito.push(productToCart);
                    cartData.totalProducts += 1;
                  }else {
                    exist.qty +=1;
                    cartData.totalProducts +=1;
                  }
                }
          return cartRef.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
          })
        }
      })
    })
  }

  static ProductosIguales(productosEnCarrito,producto,variacion){
    if(productosEnCarrito.length > 0){
      for(let i =0; i<productosEnCarrito.length; i++){
        if(productosEnCarrito[i].id === producto.id){
          if(isNullOrUndefined(variacion) && isNullOrUndefined(productosEnCarrito[i].variacion)){
            return productosEnCarrito[i];
          }else{
            if(productosEnCarrito[i].variacion == variacion){
              return productosEnCarrito[i];
            }
          }
        }else{
          return null;
        }
      }
    }else{
      return null;
    }
  }
  static totalProducts(product: Product[]) {
    let sum = 0;
    for (let i = 0; i < product.length; i++) {
      sum += parseInt(product[i]['qty'])
    }
    return sum;
  }

  resetWishList(uid): Promise<any>{
    return new Promise((resolve, reject) => {
      const ref = this.RefMiWish(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        cartData.products = [];
        cartData.totalProducts = 0;
        return ref.update(cartData).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

  removeProduct(product, uid, index): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.RefMiWish(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productsInCart = cartData.products;
        let totalQty = cartData.totalProducts;
        cartData.totalProducts = parseInt(totalQty) - parseInt(product.qty);

        cartData.products = [
          ...productsInCart.slice(0, index),
          ...productsInCart.slice(index + 1)
        ];
        return ref.update(cartData).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }
}