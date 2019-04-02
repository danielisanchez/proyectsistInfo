import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map, finalize} from 'rxjs/operators';
import { CarritoService } from './carrito.service';
import { CompraService } from './compra.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  productCollection: AngularFirestoreCollection<Product>;
  productDoc: AngularFirestoreDocument<Product>;
  productos: Observable<Product[]>;
  ProductosDep: Observable<Product[]>;
  producto: Observable<Product>;
  productoVenta;
  productoComentario;
  constructor( 
    private afs: AngularFirestore, public carritoService: CarritoService, public ComprasService: CompraService, private router: Router) {
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
    this.ProductosDep = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.ProductosDep.pipe(map(arr => arr.filter( r => r.department === 'hogar')))
  }
  ProductosElectro():Observable<Product[]>{
    this.ProductosDep = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.ProductosDep.pipe(map(arr => arr.filter( r => r.department === 'electrodomesticos')))
  }
  ProductosArte():Observable<Product[]>{
    this.ProductosDep = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.ProductosDep.pipe(map(arr => arr.filter( r => r.department === 'arte')))
  }

  ProductosMasVendidos(){
    return this.afs.collection('products', ref => ref.orderBy("sold", "desc").limit(6)).valueChanges();
  }
  updateProducto(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.update(product);
  }
  deleteProducto(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.delete();
  }
  updateSold( cantidad: number, producto: Product){
    //Metodo para hacer transacciones de la página oficial de firestore

    // Create a reference to the SF doc.
    var sfDocRef = this.afs.firestore.collection("products").doc(producto.id);

return this.afs.firestore.runTransaction(function(transaction) {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(sfDocRef).then(function(sfDoc) {
        if (!sfDoc.exists) {
            throw "Document does not exist!";
        }
        
        // Add one person to the city population.
        // Note: this could be done without a transaction
        //       by updating the population using FieldValue.increment()
        var newVenta = sfDoc.data().sold + cantidad;
        transaction.update(sfDocRef, { sold: newVenta });
    });
}).then(function() {
    console.log("Transaction successfully committed!");
}).catch(function(error) {
    console.log("Transaction failed: ", error);
});
}
  ventaProducto(Carritoproductos, Compra, uid){
    //Por cada producto en el carrito es necesario llamar al producto original
    //Para modificarle el campo sold
    Carritoproductos.forEach(productoCarrito => {
      var subscription = this.getProducto(productoCarrito.id).subscribe(producto => {
        this.productoVenta = producto
        //Una vez que productoVenta se llena del producto que trae el subscribe debo hacer un unsubscribe
        subscription.unsubscribe();

        //El metodo add es un metodo que pertenece a los subscribe de firestore y se ejecuta una vez que ya no estoy subscrito
        //Por eso hago el unsubscribe anteriormente
      }).add(()=>{
        this.updateSold(productoCarrito.qty, this.productoVenta);
      });
    });
    this.ComprasService.save(Compra);    
    this.carritoService.resetCart(uid).then(() => {
      this.router.navigate(['compras']);
      alert("Compra exitosa")
    })
  }
  agregarComentario(producto, comentario, rate, usuario){
    var subscription = this.getProducto(producto.id).subscribe(producto => {
      this.productoComentario = producto
      subscription.unsubscribe();
    }).add( () => {
      if(this.productoComentario.comentarios == null){
        let ProductoNuevo = {
          id: this.productoComentario.id,
          department: this.productoComentario.department,
          description: this.productoComentario.description,
          name: this.productoComentario.name,
          photoUrl: this.productoComentario.photoUrl,
          price: this.productoComentario.price,
          sold: this.productoComentario.sold,
          variaciones: this.productoComentario.variaciones,
          comentarios: []
        }
        let NuevoComentario = {
          nombre: usuario.name,
          comentario: comentario,
          calificacion: rate
        }
        ProductoNuevo.comentarios.push(NuevoComentario)
        this.updateProducto(ProductoNuevo);
        alert("se agrego el comentario");
      }else {
        let ProductoNuevo = {
          id: this.productoComentario.id,
          department: this.productoComentario.department,
          description: this.productoComentario.description,
          name: this.productoComentario.name,
          photoUrl: this.productoComentario.photoUrl,
          price: this.productoComentario.price,
          sold: this.productoComentario.sold,
          variaciones: this.productoComentario.variaciones,
          comentarios: this.productoComentario.comentarios
        }
        let NuevoComentario = {
          nombre: usuario.name,
          comentario: comentario,
          calificacion: rate
        }
        ProductoNuevo.comentarios.push(NuevoComentario)
        this.updateProducto(ProductoNuevo);
        alert("se agrego el comentario");
      }
    })
    }
}
