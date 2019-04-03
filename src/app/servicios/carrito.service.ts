import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoService } from './producto.service';
import { Carrito } from '../models/carrito';
import { Product } from '../models/product';
import { isUndefined, isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  
  constructor(
    public auth: AuthService,
    private afs: AngularFirestore
  ) { }

  CrearCarrito(id){
    this.afs.collection('carritos').doc(id).set(
      {id: id, products: [], totalProducts: 0}
    )
  }

  MiCarrito(uid){
    return this.afs.doc<Carrito>(`carritos/${uid}`).snapshotChanges();
  }

  RefMiCarrito(uid){
    return this.afs.collection<Carrito>('carritos').doc(uid).ref;
  }

  agregarProducto(producto, variacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.User.subscribe(data => {
        if(data){
          const cartRef = this.RefMiCarrito(data.uid);
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

                const exist = CarritoService.ProductosIguales(productosEnCarrito,producto,variacion);
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
                  const exist = CarritoService.ProductosIguales(productosEnCarrito,producto, variacion);
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

  resetCart(uid): Promise<any>{
    return new Promise((resolve, reject) => {
      const ref = this.RefMiCarrito(uid);
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

  incrementar(producto,uid, variacion){
    return new Promise((resolve,reject)=> {
      const ref = this.RefMiCarrito(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productosEnCarrito = cartData.products;
        const exist = CarritoService.ProductosIguales(productosEnCarrito, producto, variacion)
        if(exist){
            exist.qty = exist.qty + 1;
            cartData.totalProducts = parseInt(cartData.totalProducts) + 1;
          return ref.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
        }
      })
    })
  }

  disminuir(producto,uid, variacion){
    return new Promise((resolve,reject)=> {
      const ref = this.RefMiCarrito(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productosEnCarrito = cartData.products;
        const exist = CarritoService.ProductosIguales(productosEnCarrito,  producto, variacion)
        if(exist){
            exist.qty = exist.qty - 1;
            cartData.totalProducts = parseInt(cartData.totalProducts) - 1;
          return ref.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
        }
      })
    })
  }
  totalPrice(products: Product[]): number {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += (parseInt(products[i]['qty']) * products[i]['price']);
    }
    return total;
  }

  removeProduct(product, uid, index): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.RefMiCarrito(uid);
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