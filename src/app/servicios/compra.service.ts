import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import {Compra} from "../models/compra";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as faker from 'faker';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  compraCollection: AngularFirestoreCollection<Compra>;
  compraDoc: AngularFirestoreDocument<Compra>;
  compras: Observable<Compra[]>;
  compra: Observable<Compra>;
  totalAmount;
  comprasTotales;
  depHogar: boolean = false;
  depElectro: boolean = false;
  depArte: boolean = false;
  gananciasDep = [0,0,0]; //HOGAR/ARTE/ELECTRO  -- 0,1,2
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
     //Para que el admin pueda verlos todos
    this.compras = this.compraCollection.snapshotChanges().pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Compra;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
      return this.compras;
}

  getCompra(id: string) {
    return this.afs.doc<Compra>(`purchases/${id}`);
  }

  save(compra: Compra){
    const id = faker.random.alphaNumeric(20);
    compra.id = id;
    this.compraCollection.doc(id).set(compra);
  }

  GananciasTotales(compras): number {
    let total = 0;
    for (let i = 0; i < compras.length; i++) {
      total += (parseInt(compras[i]['amount']));
    }
    return total;
  }
}