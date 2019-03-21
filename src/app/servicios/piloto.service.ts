import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PilotoService {
  pilotoCollection: AngularFirestoreCollection<any>;
  pilotoDoc: AngularFirestoreDocument<any>;
  piloto: Observable<any>;
  id = 'poDTO53Gd3m8gVZu7RQU'
  constructor( 
    private afs: AngularFirestore) {
      this.pilotoCollection = this.afs.collection('piloto', ref => ref);
  }
  getPiloto(){
    this.pilotoDoc = this.afs.doc<any>(`piloto/${this.id}`);
    this.piloto = this.pilotoDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data();
        data.id = action.payload.id;
        return data;
      }
    }));
    return this.piloto;
  }
  habilitarPiloto(){
    var piloto ={
      value: true
    }

    this.pilotoDoc = this.afs.doc(`piloto/${this.id}`);
    this.pilotoDoc.update(piloto);
  }
  deshabilitarPiloto(){
    var piloto ={
      value: false
    }

    this.pilotoDoc = this.afs.doc(`piloto/${this.id}`);
    this.pilotoDoc.update(piloto);
  }
}
