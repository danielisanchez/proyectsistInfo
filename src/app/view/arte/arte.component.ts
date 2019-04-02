import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subject, combineLatest} from 'rxjs';
import { ProductoService } from 'src/app/servicios/producto.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { wishlistService } from 'src/app/servicios/wishlist.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-arte',
  templateUrl: './arte.component.html',
  styleUrls: ['./arte.component.css']
})
export class ArteComponent implements OnInit {
  modalRef: BsModalRef;
  searchterm;
  startAt = new Subject();
  endAt = new Subject();
  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();
  productos;
  filteredProductos;
  // propiedades para el filtro
  precio: number;
  name: string;
  variacion;
  rate = [];
  Productocomentarios;
  constructor(public auth: AuthService, 
    public productoService: ProductoService, 
    public afs: AngularFirestore, 
    public carritoService: CarritoService, 
    public wishlistService: wishlistService,
    public ModalService: BsModalService
    ) { }

  ngOnInit() {
    this.getProducts()
    combineLatest(this.startObs, this.endObs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((arte) => {
        this.productos = arte;
      })
    })
  }
  getProducts() {
    this.productoService.ProductosArte().subscribe(productos => this.productos = productos);
  }
  search(event){
    const q = event;
    if(q!==null){
      this.startAt.next(q);
      this.endAt.next(q + '\uf8ff');
    }else{
      this.getProducts();
    }
  }
  firequery(start,end){
    return this.afs.collection('products', ref => ref.orderBy('name').where("department", "==", "arte")
    .startAt(start).endAt(end)).valueChanges();  
  }
    //Filtro nombre ascendiente
    NameAsc(){
      return this.afs.collection('products', ref => ref.orderBy("name", "asc")).valueChanges();
    }
    // Filtro nombre descendiente
    NameDes(){
      return this.afs.collection('products', ref => ref.orderBy("name", "desc")).valueChanges();
    }
    // Filtro Precio ascendiente
    PrecioAsc(){
      return this.afs.collection('products', ref => ref.orderBy("price", "asc")).valueChanges();
    }
    // Filtro precio descendiente
    PrecioDesc(){
      return this.afs.collection('products', ref => ref.orderBy("price", "desc")).valueChanges();
    }
    // Precio entre valores
    PrecioEntre(menor:number, mayor:number){
      if(menor<= mayor){
        return this.afs.collection('products', ref => ref.where("price", ">=",menor).where("price","<=",mayor)).valueChanges();
      }else{
        alert("Error en los valores suminstrados")
      }
    }
    anadirCarrito(producto){
      this.carritoService.agregarProducto(producto, this.variacion)
      alert("Producto añadido al carrito")   
      this.variacion = undefined
    }
    anadirWish(producto){
      this.wishlistService.agregarProducto(producto, this.variacion)
      alert("Producto añadido a la wishlist");
      this.variacion = undefined
    }
    MostrarComentarios(template: TemplateRef<any>, producto){
      if(isNullOrUndefined(producto.comentarios)){
        alert("Este producto no tiene comentarios");
        return
      }else{
        this.Productocomentarios = producto.comentarios;
        this.Productocomentarios.forEach(comentario => {
          this.rate.push(comentario.calificacion);
        });
        this.modalRef = this.ModalService.show(template, {class: 'gray modal-lg'});
      }
    }
}
