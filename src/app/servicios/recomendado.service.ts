import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RecomendadoService {
  productCollection: AngularFirestoreCollection<Product>;
  productDoc: AngularFirestoreDocument<Product>;
  productos: Observable<Product[]>;
  producto: Observable<Product>;

  constructor( 
    private afs: AngularFirestore) {
      this.productCollection = this.afs.collection('recomendado', ref => ref);
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

  deleteProducto(product: Product){
    this.productDoc = this.afs.doc(`recomendado/${product.id}`);
    this.productDoc.delete();
  }
}
