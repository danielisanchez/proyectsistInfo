import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
//Firebase:
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

//Modelos:
import { Usuario } from "../models/usuario";

//Observables:
import {switchMap} from 'rxjs/operators';
import { Observable , of} from 'rxjs';


@Injectable()
export class AuthService {
  
  User: Observable<Usuario>;
  UserDoc: AngularFirestoreDocument<Usuario>;
  admin: Observable<Usuario>;
  constructor (
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) 
  {
    //Se comprueba si el usuario esta correctamente logeado en la aplicación:
    this.User = this.afAuth.authState.pipe(switchMap(User => 
    {
      //Usuario conectado:
      if( User )
      {
        return this.firestore.doc<Usuario>(`users/${User.uid}`).valueChanges();
      }
      //Usuario desconectado:
      else 
      {
        return of(null);
      }
    }))
  }

  //Método que actualiza la data del usuario:
  public updateUserData(user){
    const userRef: AngularFirestoreDocument<Usuario> = this.firestore.doc(`users/${user.uid}`);
    if(user.photoUrl == null){
      if(user.role == "customer"){
        const data: Usuario = {
          uid: user.uid,
          email: user.email,
          name: user.name,
          photoUrl: null,
          role: "customer",
          isActive: true
        }
        return userRef.set(data);
      }else{
        const data: Usuario = {
          uid: user.uid,
          email: user.email,
          name: user.name,
          photoUrl: null,
          role: "admin",
          isActive: true
        }
        return userRef.set(data);
      }
    }else{
      if(user.role == "customer"){
        const data: Usuario = {
          uid: user.uid,
          email: user.email,
          name: user.name,
          photoUrl: user.photoUrl,
          role: "customer", 
          isActive: true
      }
      return userRef.set(data);
    }else {
      const data: Usuario = {
        uid: user.uid,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
        role: "admin",
        isActive: true
      }
      return userRef.set(data);
    }
  }
  }
  //Método para iniciar sesión con email y password:
  public emailAndPassword(email, password)
  {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  //Método para registrar un nuevo usuario:
  public signUp(email, password)
  {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  //Método para cerrar sesión:
  public signOut() 
  {
    this.afAuth.auth.signOut().then(() => 
    this.router.navigate(['/login']));
  }

  //Recuperar contraseña
  public ForgotPassword(email)
  {
    this.afAuth.auth.sendPasswordResetEmail(email).then(function() {
      alert("email sent")
    }).catch(function(error) {
      alert(error.message);
    });
  }
  isAdmin(id: string){
    this.UserDoc = this.firestore.doc<Usuario>(`users/${id}`);
    this.admin = this.UserDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as Usuario;
        data.uid = action.payload.id;
        return data;
      }
    }));
    return this.admin
  }
}

