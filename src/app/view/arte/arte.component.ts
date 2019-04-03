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
  // check para el filtro
  PrecioAsc: boolean = false;
  PrecioDesc: boolean = false;
  PrecioRgo: boolean = false;
  NombreAsc: boolean = false;
  NombreDesc: boolean = false;

  minPrecio;
  maxPrecio;

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
      return this.afs.collection('products', ref => ref.orderBy("name", "asc").where("department", "==", "arte")).valueChanges();
    }
    // Filtro nombre descendiente
    NameDes(){
      return this.afs.collection('products', ref => ref.orderBy("name", "desc").where("department", "==", "arte")).valueChanges();
    }
    // Filtro Precio ascendiente
    PrecioAscendente(){
      return this.afs.collection('products', ref => ref.orderBy("price", "asc").where("department", "==", "arte")).valueChanges();
    }
    // Filtro precio descendiente
    PrecioDescendiente(){
      return this.afs.collection('products', ref => ref.orderBy("price", "desc").where("department", "==", "arte")).valueChanges();
    }
    // Precio entre valores
    PrecioEntre(menor:number, mayor:number){
      if(menor<= mayor){
        this.productoService.ProductosArteEntre(menor,mayor).subscribe(productos => this.productos = productos);
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

    CheckedPrecioAsc(){
      this.PrecioDesc = false;
      this.PrecioRgo = false;
      this.PrecioAsc= true;
      this.NombreAsc = false;
      this.NombreDesc = false;
    }
    CheckedPrecioDesc(){
      this.PrecioDesc = true;
      this.PrecioRgo = false;
      this.PrecioAsc= false;
      this.NombreAsc = false;
      this.NombreDesc = false;
    }
    CheckedRgo(){
      this.PrecioDesc = false;
      this.PrecioRgo = true;
      this.PrecioAsc= false;
      this.NombreAsc = false;
      this.NombreDesc = false;
    }
    CheckedNombreAsc(){
      this.PrecioDesc = false;
      this.PrecioRgo = false;
      this.PrecioAsc= false;
      this.NombreAsc = true;
      this.NombreDesc = false;
    }
    CheckedNombreDesc(){
      this.PrecioDesc = false;
      this.PrecioRgo = false;
      this.PrecioAsc= false;
      this.NombreAsc = false;
      this.NombreDesc = true;
    }
    filtro(){
      if(this.PrecioAsc == true){
        this.PrecioAscendente().subscribe(productos => this.productos = productos);
        return;
      }else if(this.PrecioDesc == true){
        this.PrecioDescendiente().subscribe(productos => this.productos = productos);
        return;
      }else if(this.PrecioRgo == true){
        if(isNullOrUndefined(this.minPrecio)){
          alert("Introduzca el precio minimo")
          return;
        }else if(isNullOrUndefined(this.maxPrecio)){
          alert("Introduzca el precio minimo")
          return;
        }else{
          this.PrecioEntre(this.minPrecio, this.maxPrecio);
          this.minPrecio = null;
          this.maxPrecio = null;
          return;
        }
      }else if(this.NombreAsc == true){
        this.NameAsc().subscribe(productos => this.productos = productos);
        return;
      }else if(this.NombreDesc == true){
        this.NameDes().subscribe(productos => this.productos = productos);
        return;
      }
    }
    Quitarfiltro(){
      this.getProducts();
    }
}
