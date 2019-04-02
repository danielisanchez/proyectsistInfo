import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { isUndefined } from 'util';
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
  constructor(private productoService: ProductoService,
    public comprasService: CompraService,
    private auth: AuthService, 
    private modalService: BsModalService,
    private afs: AngularFirestore) { }

  ngOnInit() {
    this.getCompras()
  }
  getCompras() {
    this.auth.User.subscribe(user => {
      this.usuario = user;
      if(user){
        this.comprasService.obtenerCompras(user.uid).subscribe(compras => this.compras = compras);
      }
    })
  }
  DetalleProductos(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
}