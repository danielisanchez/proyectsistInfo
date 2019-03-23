import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  productCollection: AngularFirestoreCollection<Product>;
  productDoc: AngularFirestoreDocument<Product>;
  productos: Observable<Product[]>;
  productosDisponible: Observable<Product[]>;
  producto: Observable<Product>;

  constructor( 
    private afs: AngularFirestore) {
      this.productCollection = this.afs.collection('products', ref => ref);
  }
  crearProducto(product: Product){
    this.productCollection.add(product);
  }
  Productos():Observable<Product[]>{
    this.productos = this.productCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productos;
  }
  getProducto( idProducto: string){
    this.productDoc = this.afs.doc<Product>(`products/${idProducto}`);
    this.producto = this.productDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as Product;
        data.id = action.payload.id;
        return data;
      }
    }));
    return this.producto;
  }
  ProductosHogar():Observable<Product[]>{
    this.productosDisponible = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productosDisponible.pipe(map(arr => arr.filter( r => r.department === 'hogar')))
  }
  ProductosElectro():Observable<Product[]>{
    this.productosDisponible = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productosDisponible.pipe(map(arr => arr.filter( r => r.department === 'electrodomesticos')))
  }
  ProductosArte():Observable<Product[]>{
    this.productosDisponible = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productosDisponible.pipe(map(arr => arr.filter( r => r.department === 'arte')))
  }
  updateProducto(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.update(product);
  }
  deleteProducto(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.delete();
  }
}
