import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  userCollection: AngularFirestoreCollection<Usuario>;
  userDoc: AngularFirestoreDocument<Usuario>;
  users: Observable<Usuario[]>;
  user: Observable<Usuario>;

  constructor(private afs: AngularFirestore) 
  { 
    this.userCollection = this.afs.collection('users', ref => ref);
  }

  //Crear Usuario:
  CrearUsuario(user: Usuario)
  {
    this.userCollection.add(user);
  }

  //Obtener Usuario:
  ObtenerUsuarios():Observable<Usuario[]>
  {
    this.users = this.userCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
          const data = action.payload.doc.data() as Usuario;
          data.uid = action.payload.doc.id;
          return data;
      });
    }));
    return this.users;
  }

  //Obtener usuario:
  ObtenerUsuario( idUser: string)
  {
    this.userDoc = this.afs.doc<Usuario>(`users/${idUser}`);
    this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as Usuario;
        data.uid = action.payload.id;
        return data;
      }
    }));
    return this.user;
  }

  //Actualizar usuario:
  ActualizarUsuario(user: Usuario)
  {
    this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc.update(user);
  }
  //Borrar usuario:
  BorrarUsuario(user: Usuario){
    this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc.delete();
  }


}
