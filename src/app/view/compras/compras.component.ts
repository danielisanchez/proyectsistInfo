import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { isUndefined, isNullOrUndefined } from 'util';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CompraService } from 'src/app/servicios/compra.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  compras: any;
  modalRef: BsModalRef;
  ComentarmodalRef: BsModalRef;
  productoComentar:any;
  comentario: string;
  max = 5;
  rate = 0;
  isReadonly = false;
  usuario;
  checkDes: boolean = false;
  checkAsc: boolean = false;
  checkRgo: boolean = false;
  checkUser: boolean = false;
  checkFiltro: boolean = false;
  minPrecio;
  maxPrecio;
  uid;
  constructor(private productoService: ProductoService,
    public comprasService: CompraService,
    public auth: AuthService, 
    private modalService: BsModalService,
    private afs: AngularFirestore) { }

  ngOnInit() {
    this.getCompras()
  }
  getCompras() {
    this.auth.User.subscribe(user => {
      this.usuario = user;
      if(user){
        if(user.role == 'customer'){
          this.comprasService.obtenerCompras(user.uid).subscribe(compras => this.compras = compras);
        }else if(user.role =='admin'){
          this.comprasService.obtenerCompras().subscribe(compras => this.compras = compras);
        }
      }
    })
  }
  DetalleProductos(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    console.log(this.compras);
  }
  Modalcomentar(template: TemplateRef<any>, producto){
    this.productoComentar = producto;
    this.modalRef.hide();
    this.ComentarmodalRef = this.modalService.show(template);
  }
  agregarComentario(){
    if(isUndefined(this.comentario)){
      alert("No escribio un comentario")
      this.comentario = undefined;
      this.rate = 0;
      return;
    }
    if(this.rate == 0){
      alert("No dejo una calificacion")
      this.comentario = undefined;
      this.rate = 0;
      return;
    }
    if(this.productoComentar.variacion == null){
      this.comentario = "Comentario para" +" "+ this.productoComentar.name +" "+ "sin variacion: " + this.comentario
    }else{
      this.comentario = "Comentario para" +" "+ this.productoComentar.name +" "+ this.productoComentar.variacion + ":" + " " + this.comentario
    }
    this.productoService.agregarComentario(this.productoComentar, this.comentario, this.rate, this.usuario);
    this.comentario = undefined;
    this.rate = 0;
    this.ComentarmodalRef.hide();

  }
  CheckedUser(event){
    this.checkRgo = false;
    this.checkDes = false;
    this.checkAsc = false;
    this.checkUser = true;
    this.checkFiltro = false;
  }
  CheckedAsc(event){
    this.checkRgo = false;
    this.checkDes = false;
    this.checkAsc = true;
    this.checkUser = false;
    this.checkFiltro = false;
  }
  CheckedDesc(event){
    this.checkRgo = false;
    this.checkDes = true;
    this.checkAsc = false;
    this.checkUser = false;
    this.checkFiltro = false;
  }
  CheckedRgo(event){
    this.checkRgo = true;
    this.checkDes = false;
    this.checkAsc = false;
    this.checkUser = false;
    this.checkFiltro = false;
  }
  CheckedFiltro(event){
    this.checkRgo = false;
    this.checkDes = false;
    this.checkAsc = false;
    this.checkUser = false;
    this.checkFiltro = true;
  }
  filtro(){
    if(this.checkAsc == true){
      this.PrecioAsc().subscribe(compras => this.compras = compras);
      return;
    }else if(this.checkDes == true){
      this.PrecioDesc().subscribe(compras => this.compras = compras);
      return;
    }else if(this.checkRgo == true){
      if(isNullOrUndefined(this.minPrecio)){
        alert("Introduzca el precio minimo")
        return;
      }else if(isNullOrUndefined(this.maxPrecio)){
        alert("Introduzca el precio minimo")
        return;
      }else{
        this.PrecioEntre(this.minPrecio, this.maxPrecio).subscribe(compras => this.compras = compras);
        this.minPrecio = null;
        this.maxPrecio = null;
        return;
      }
    }else if(this.checkUser == true){
      this.FiltroUid(this.uid).subscribe(compras => this.compras = compras);
      this.uid = null;
      return;
    }else if(this.checkFiltro == true){
      this.getCompras();
      return;
    }
  }
  
  // Filtro Precio ascendiente
  PrecioAsc(){
    return this.afs.collection('purchases', ref => ref.orderBy("amount", "asc")).valueChanges();
  }
  // Filtro precio descendiente
  PrecioDesc(){
    return this.afs.collection('purchases', ref => ref.orderBy("amount", "desc")).valueChanges();
  }
  // Precio entre valores
  PrecioEntre(menor:number, mayor:number){
    if(menor<= mayor){
      return this.afs.collection('purchases', ref => ref.where("amount", ">=",menor).where("amount","<=",mayor)).valueChanges();
    }else{
      alert("Error en los valores suminstrados")
    }
  }
  // Filtro para un solo usuario
  FiltroUid(userId){
    return this.afs.collection('purchases', ref => ref.where("uid", "==", userId)).valueChanges();
  }
}