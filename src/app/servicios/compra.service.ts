import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import {Compra} from "../models/compra";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CompraService {
  compraCollection: AngularFirestoreCollection<Compra>;
  compraDoc: AngularFirestoreDocument<Compra>;
  compras: Observable<Compra[]>;
  compra: Observable<Compra>;
  constructor(private afs: AngularFirestore) {
    this.compraCollection = this.afs.collection<Compra>('purchases', ref => ref);
   }
   InicializarCollection(uid?: string){
    if(uid){
      this.compraCollection = this.afs.collection<Compra>('purchases', ref => ref.where('uid', '==', uid));
    }
  }
  obtenerCompras(uid?: string) {
    if(uid){
      this.InicializarCollection(uid);
      this.compras = this.compraCollection.snapshotChanges().pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Compra;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
      return this.compras;
    }
}

  getCompra(id: string) {
    return this.afs.doc<Compra>(`purchases/${id}`);
  }

  save(compra: Compra){
    this.compraCollection.add(compra);
  }
}

